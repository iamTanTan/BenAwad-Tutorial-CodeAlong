import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

const main = async () => {
    //Initialize mikro-orm with config and set migrator up
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    /* Express */
    const app = express();

    // CORS
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    //Use session middleware before apollo
    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__, //cookie only works in https
            },
            saveUninitialized: false,
            secret: "hgdkgdjgdskydkkhyfkhrytscqqqqt",
            resave: false,
        })
    );

    // Use Express with graphql with apolloserver
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });
    // apply apollo middleware to express to create graphql endpoint on server
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000" },
    });
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
};

main().catch((err) => {
    console.error(err);
});
