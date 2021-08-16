import { isAuth } from "src/middleware/isAuth";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Int,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";

// This file demonstrates basic CRUD operations with typeorm and GraphQl

@InputType()
class PostInput {
    @Field()
    title: string;
    @Field()
    text: string;
}

@Resolver()
export class PostResolver {
    //Query from post using em from mikro-orm with a defined type (types.ts)
    //and returning the result of the query.
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        return Post.find();
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
