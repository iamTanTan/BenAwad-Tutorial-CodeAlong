import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation();
    const [loadingState, setLoadingState] = useState<
        "updoot-loading" | "downdoot-loading" | "not-loading"
    >("not-loading");
    return (
        <Flex
            pr={8}
            direction='column'
            alignItems='center'
            justifyContent='center'>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }
                    setLoadingState("updoot-loading");
                    await vote({ value: 1, postId: post.id });
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === "updoot-loading"}
                colorScheme={post.voteStatus === 1 ? "green" : undefined}
                aria-label='Upvote'
                icon={<ChevronUpIcon />}
                size='50px'
            />
            {post.points}
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }
                    setLoadingState("downdoot-loading");
                    await vote({ value: -1, postId: post.id });
                    setLoadingState("not-loading");
                }}
                isLoading={loadingState === "downdoot-loading"}
                colorScheme={post.voteStatus === -1 ? "red" : undefined}
                aria-label='Downvote'
                icon={<ChevronDownIcon />}
                size='50px'
            />
        </Flex>
    );
};

export default UpdootSection;
