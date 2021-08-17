import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Link } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";

const Index = () => {
    const [{ data }] = usePostsQuery();
    return (
        <Layout variant='regular'>
            <NextLink href='./create-post'>
                <Link>create post</Link>
            </NextLink>
            <Box>
                Hello World
                {!data ? (
                    <div>loading...</div>
                ) : (
                    data.posts.map((p) => <li key={p.id}>{p.title}</li>)
                )}
            </Box>
        </Layout>
    );
};

//Add ssr if doing queries and if it is important to SEO,
//you might want to use a custom loader instead of ssr in some cases
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
