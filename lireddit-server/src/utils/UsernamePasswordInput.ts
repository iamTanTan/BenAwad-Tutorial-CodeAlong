import { Field, InputType } from "type-graphql";

//Another method of performing input rather than with @Arg

@InputType()
export class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    email: string;
}
