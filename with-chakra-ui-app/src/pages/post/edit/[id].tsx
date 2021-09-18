import { withUrqlClient } from "next-urql";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

const EditPost = ({}) => {
    const [, editPost] = useUpdatePostMutation();
    return <Layout></Layout>;
};

export default withUrqlClient(createUrqlClient)(EditPost);
