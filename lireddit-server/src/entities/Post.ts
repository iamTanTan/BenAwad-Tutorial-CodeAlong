import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

// Attach ObjectTyoe and Field() decorators to interact with mikro-orm

@ObjectType()
@Entity()
export class Post {
    //note you can remove Field decorator and then this filed will not be exposed in graphql
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: "text" })
    title!: string;

    @Field(() => String)
    @Property({ type: "date" })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();
}
