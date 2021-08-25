import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import {
    Box,
    Link,
    Stack,
    Heading,
    Text,
    Flex,
    Button,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import React from "react";

const Index = () => {
    const [{ data, fetching }] = usePostsQuery({ variables: { limit: 100 } });

    if (!fetching && !data) return <div>query failed</div>;

    return (
        <Layout variant='regular'>
            <Flex align='center'>
                <Heading>Breddit</Heading>
                <NextLink href='./create-post'>
                    <Link ml='auto'>create post</Link>
                </NextLink>
            </Flex>

            {!data && fetching ? (
                <div>loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.map((p) => (
                        <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
                            <Heading fontSize='xl'>{p.title}</Heading>
                            <Text mt={4}>{p.textSnippet}</Text>
                        </Box>
                    ))}
                </Stack>
            )}
            {data ? (
                <Flex>
                    <Button m='auto' my={4}>
                        load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

//Add ssr if doing queries and if it is important to SEO,
//you might want to use a custom loader instead of ssr in some cases
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
