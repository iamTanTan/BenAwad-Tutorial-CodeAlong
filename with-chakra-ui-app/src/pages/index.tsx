import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
    useDeletePostMutation,
    useMeQuery,
    usePostsQuery,
} from "../generated/graphql";
import {
    Box,
    Link,
    Stack,
    Heading,
    Text,
    Flex,
    Button,
    IconButton,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import React, { useState } from "react";
import UpdootSection from "../components/UpdootSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Index = () => {
    const [variables, setVariables] = useState({
        limit: 15,
        cursor: null as string | null,
    });
    const [{ data: meData }] = useMeQuery();
    const [{ data, fetching }] = usePostsQuery({ variables: variables });
    const [, deletePost] = useDeletePostMutation();

    if (!fetching && !data) return <div>query failed</div>;

    return (
        <Layout variant='regular'>
            {!data && fetching ? (
                <div>loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) =>
                        !p ? null : (
                            <Flex
                                key={p.id}
                                p={5}
                                shadow='md'
                                borderWidth='1px'>
                                <UpdootSection post={p} />
                                <Box flex={1}>
                                    <NextLink
                                        href='/post/[id]'
                                        as={`/post/${p.id}`}>
                                        <Link>
                                            <Heading fontSize='xl'>
                                                {p.title}
                                            </Heading>{" "}
                                        </Link>
                                    </NextLink>
                                    <Text>posted by {p.creator.username}</Text>
                                    <Flex>
                                        <Text mt={4}>{p.textSnippet}</Text>
                                        {meData?.me?.id !==
                                        p.creator.id ? null : (
                                            <Box ml='auto'>
                                                <NextLink
                                                    href='/post/edit/[id]'
                                                    as={`/post/edit/${p.id}`}>
                                                    <IconButton
                                                        ml='auto'
                                                        as={Link}
                                                        mr={3}
                                                        icon={<EditIcon />}
                                                        aria-label='Edit Post'
                                                    />
                                                </NextLink>
                                                <IconButton
                                                    ml='auto'
                                                    icon={<DeleteIcon />}
                                                    aria-label='Delete Post'
                                                    onClick={() => {
                                                        deletePost({
                                                            id: p.id,
                                                        });
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            </Flex>
                        )
                    )}
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
