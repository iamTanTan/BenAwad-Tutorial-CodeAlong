import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// m to n
// many to many
//user -> join <- posts
// user -> updoot <- posts

// Attach ObjectTyoe and Field() decorators to interact with graphql and typeorm
@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
    //note you can remove Field decorator and then this filed will not be exposed in graphql
    @Field()
    @Column({ type: "int" })
    value: number;

    @Field()
    @PrimaryColumn()
    userId: number;

    @Field(() => Post)
    @ManyToOne(() => User, (user) => user.updoots, {
        onDelete: "CASCADE",
    })
    user: User;

    @Field()
    @PrimaryColumn()
    postId: number;

    @Field(() => User)
    @ManyToOne(() => Post, (post) => post.updoots, {
        onDelete: "CASCADE",
    })
    post: Post;
}
