import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

// This file demonstrates basic CRUD operations with mikro-orm and GraphQl

@Resolver()
export class PostResolver {
    //Query from post using em from mikro-orm with a defined type (types.ts)
    //and returning the result of the query.
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // Queries are for getting data, mutations are for updating, creating and deleting data
    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = em.create(Post, { title });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg("id", () => Int) id: number,
        // In this case there is only one field to change, but if we wanted to change a specific one
        // or optionlly update it we could add nullable option
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    // Notice we cannot return the post we deleted (it does not exist anymore!) thus we return a boolean
    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        await em.nativeDelete(Post, { id });
        return true;
    }
}
