import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box } from "@chakra-ui/react";

const Index = () => {
    const [{ data }] = usePostsQuery();
    return (
        <div>
            <NavBar />
            <Box>
                Hello World
                {!data ? (
                    <div>loading...</div>
                ) : (
                    data.posts.map((p) => <li key={p.id}>{p.title}</li>)
                )}
            </Box>
        </div>
    );
};

//Add ssr if doing queries and if it is important to SEO,
//you might want to use a custom loader instead of ssr in some cases
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
