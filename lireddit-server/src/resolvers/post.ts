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

    //Query from post using em from mikro-orm with a defined type (types.ts)
    //and returning the result of the query.
    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedPosts> {
        //check one outside limit to determine if more posts are going to be available to show
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(
            `
            select p.*,
            json_build_object(
                'id', u.id,
                'username', u.username,
                'email', u.email
            ) creator
            from post p
            inner join public.user u on u.id = p."creatorId"
            ${cursor ? `where p."createdAt" < $2` : ""}
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
        return Post.findOne(id);
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
    async updatePost(
        @Arg("id", () => Int) id: number,
        // In this case there is only one field to change, but if we wanted to change a specific one
        // or optionlly update it we could add nullable option
        @Arg("title", () => String, { nullable: true }) title: string
    ): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await Post.update({ id }, { title });
        }
        return post;
    }

    // Notice we cannot return the post we deleted (it does not exist anymore!) thus we return a boolean
    @Mutation(() => Boolean)
    async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
        await Post.delete(id);
        return true;
    }
}
