import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
    post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation();

    return (
        <Flex
            pr={8}
            direction='column'
            alignItems='center'
            justifyContent='center'>
            <IconButton
                onClick={() => vote({ value: 1, postId: post.id })}
                colorScheme='teal'
                aria-label='Upvote'
                icon={<ChevronUpIcon />}
                size='50px'
            />
            {post.points}
            <IconButton
                onClick={() => vote({ value: -1, postId: post.id })}
                colorScheme='teal'
                aria-label='Downvote'
                icon={<ChevronDownIcon />}
                size='50px'
            />
        </Flex>
    );
};

export default UpdootSection;
