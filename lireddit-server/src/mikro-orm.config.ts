import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [User, Post],
    dbName: "lireddit",
    type: "postgresql",
    debug: !__prod__,
    password: "Tanman11!!",
} as Parameters<typeof MikroORM.init>[0];