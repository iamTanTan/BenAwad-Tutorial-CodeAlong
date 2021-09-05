import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/Updoot";

const RedisStore = connectRedis(session);
const redis = new Redis();


const main = async () => {
    //Initialize type-orm with configu and set migrator up
    const conn = await createConnection({
        type: "postgres",
        database: "lireddit2",
        username: "postgres",
        password: "Tanman11!!",
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User, Updoot],
    });

    console.log(conn.options);

    //conn.runMigrations();

    //await Post.delete({});

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
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
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
        context: ({ req, res }) => ({ req, res, redis }),
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
