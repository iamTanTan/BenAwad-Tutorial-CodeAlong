import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

// Attach ObjectType and Field() decorators to interact with mikro-orm
// Note: Make sure to add to entities within mikro-orm.config file
@ObjectType()
@Entity()
export class User {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: "date" })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field(() => String)
    @Property({ type: "text", unique: true })
    username!: string;

    //note you can remove Field decorator and then this field will not be exposed in graphql
    @Property({ type: "text" })
    password!: string;
}
