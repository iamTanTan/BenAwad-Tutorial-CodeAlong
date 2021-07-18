import { Query, Resolver } from "type-graphql";

// Test / intro to resolvers
@Resolver()
export class HelloResolver {
    @Query(() => String)
    hello() {
        return "hello world";
    }
}
