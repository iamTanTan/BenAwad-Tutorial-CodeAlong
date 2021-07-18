import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";

//Antoher method of performing input rather than with @Arg
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}
//We are creating an object to display the error and with a message field that is user friendly
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
        //you arenot logged in
        if (!req.session.userId) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        // validate username length
        if (options.username.length <= 5) {
            return {
                errors: [
                    {
                        field: "invalid username length",
                        message: "the username entered is too short",
                    },
                ],
            };
        }

        // validate password length
        if (options.password.length <= 8) {
            return {
                errors: [
                    {
                        field: "invalid password length",
                        message: "the password entered is too short",
                    },
                ],
            };
        }

        //you can validate username by checking if it is already taken
        // const existingUser = await em.findOne(User, {
        //     username: options.username,
        // });
        // if (existingUser) {
        //     return {
        //         errors: [
        //             {
        //                 field: "username already exists",
        //                 message: "that username already exists",
        //             },
        //         ],
        //     };
        // }

        // We do not want to pass in our password here we want to hash our password
        // so that if a breach occurs there is no awful loss of data
        // We will use argon2 to acheive the hashing
        const hashedPassword = await argon2.hash(options.password);
        // const user = em.create(User, {
        //     username: options.username,
        //     password: hashedPassword,
        // });
        let user;

        //If an error occurs we want to return the error of our cutom UserResponse Object rather than the user
        try {
            const result = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning("*");
            user = result[0];
        } catch (err) {
            console.log(err);
            if (err.detail.includes("already exists")) {
                return {
                    errors: [
                        {
                            field: "username already exists",
                            message: "that username already exists",
                        },
                    ],
                };
            }
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ) {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }

        const valid = await argon2.verify(user.password, options.password);

        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        req.session.userId = user.id;

        //if no errors, return the existing user
        return {
            user,
        };
    }
}
