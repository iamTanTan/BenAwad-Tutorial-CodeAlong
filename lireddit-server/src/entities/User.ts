import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

// Attach ObjectType and Field() decorators to interact with graphql and typeorm
// Note: Make sure to add to entities within typeorm createConnection
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ unique: true })
    username!: string;

    //note you can remove Field decorator and then this field will not be exposed in graphql
    @Column()
    password!: string;

    @Field(() => String)
    @Column({ unique: true })
    email!: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
}
