import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
    const [{ data }] = usePostsQuery();
    return (
        <div>
            <NavBar />
            Hello World
            <br></br>
            <br></br>
            {!data ? (
                <div>loading...</div>
            ) : (
                data.posts.map((p) => <li key={p.id}>{p.title}</li>)
            )}
            after
        </div>
    );
};

//Add ssr if doing queries and if it is important to SEO,
//you might want to use a custom loader instead of ssr in some cases
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
