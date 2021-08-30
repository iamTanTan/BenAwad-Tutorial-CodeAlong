import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

// Attach ObjectTyoe and Field() decorators to interact with graphql and typeorm
@ObjectType()
@Entity()
export class Post extends BaseEntity {
    //note you can remove Field decorator and then this filed will not be exposed in graphql
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    title!: string;

    @Field(() => String)
    @Column()
    text!: string;

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    points!: number;

    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
}
