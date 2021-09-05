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
import React, { useState } from "react";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as string | null,
    });
    const [{ data, fetching }] = usePostsQuery({ variables: variables });

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
                    {data!.posts.posts.map((p) => (
                        <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
                            <UpdootSection post={p} />
                            <Box>
                                <Heading fontSize='xl'>{p.title}</Heading>{" "}
                                <Text>posted by {p.creator.username}</Text>
                                <Text mt={4}>{p.textSnippet}</Text>
                            </Box>
                        </Flex>
                    ))}
                </Stack>
            )}

            {data && data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            setVariables({
                                limit: variables?.limit,
                                cursor: data.posts.posts[
                                    data.posts.posts.length - 1
                                ].createdAt,
                            });
                        }}
                        m='auto'
                        my={4}
                        isLoading={fetching}>
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
