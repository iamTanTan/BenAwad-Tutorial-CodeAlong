import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

// This file demonstrates basic CRUD operations with typeorm and GraphQl

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
        return root.text.slice(0, 60);
    }

    @Mutation(() => Boolean)
    async vote(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const { userId } = req.session;
        const updoot = await Updoot.findOne({ where: { postId, userId } });
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;

        // user already voted
        //and they are changing their vote
        if (updoot && updoot.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                    update updoot
                    set value = $1
                    where "postId" = $2 and "userId" = $3`,
                    [realValue, postId, userId]
                );

                //note must multiply by 2 to undo upvote for downdoot or vice versa
                await tm.query(
                    `
                    update post
                    set points = points + $1
                    where id = $2
                    `,
                    [2 * realValue, postId]
                );
            });

            //never voted before
        } else if (!updoot) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                    insert into updoot ("userId", "postId", value)
                    values ($1, $2, $3)
                    `,
                    [userId, postId, realValue]
                );

                await tm.query(
                    `
                    update post
                    set points = points + $1
                    where id = $2`,
                    [realValue, postId]
                );
            });
        } else {
        }
        return true;
    }

    //Query from post using em from mikro-orm with a defined type (types.ts)
    //and returning the result of the query.
    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {
        //check one outside limit to determine if more posts are going to be available to show
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (req.session.userId) {
            replacements.push(req.session.userId);
        }

        let cursorIdx = 3;
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
            cursorIdx = replacements.length;
        }

        const posts = await getConnection().query(
            `
            select p.*,
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email
            ) creator,
            ${
                req.session.userId
                    ? '(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"'
                    : 'null as "voteStatus"'
            }
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $${cursorIdx}` : ""}
            order by p."createdAt" DESC
            limit $1
            `,
            replacements
        );

        // const qb = getConnection()
        //     .getRepository(Post)
        //     .createQueryBuilder("post")
        //     .innerJoinAndSelect("post.creator", "u", 'u.id = post."creatorId"')
        //     .take(realLimitPlusOne)
        //     .orderBy('post."createdAt"', "DESC");

        // if (cursor)
        //     qb.where('post."createdAt" < :cursor', {
        //         cursor: new Date(parseInt(cursor)),
        //     });

        // const posts = await qb.getMany();

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
        return Post.findOne(id, { relations: ["creator"] });
    }

    // Queries are for getting data, mutations are for updating, creating and deleting data
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        return Post.create({ ...input, creatorId: req.session.userId }).save();
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        // In this case there is only one field to change, but if we wanted to change a specific one
        // or optionlly update it we could add nullable option
        @Arg("title") title: string,
        @Arg("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.id,
            })
            .returning("*")
            .execute();

        return result.raw[0];
    }

    // Notice we cannot return the post we deleted (it does not exist anymore!) thus we return a boolean
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        await Post.delete({ id, creatorId: req.session.userId });
        return true;
    }
}
