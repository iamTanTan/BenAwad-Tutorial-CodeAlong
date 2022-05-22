import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
    usePostQuery,
    useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

const EditPost = ({}) => {
    const [, editPost] = useUpdatePostMutation();
    const router = useRouter();
    const intId =
        typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: { id: intId },
    });

    if (fetching) {
        return <Layout>loading...</Layout>;
    }

    if (!data?.post) {
        return <Layout>Post not found</Layout>;
    }

    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async (values) => {
                    console.log(values);
                    await editPost({ id: intId, ...values });
                    router.back();
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name='title'
                                label='Title'
                                placeholder='title'
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                name='text'
                                label='Body'
                                placeholder='text...'
                                textarea
                            />
                        </Box>

                        <Button
                            mt={4}
                            type='submit'
                            isLoading={isSubmitting}
                            p={4}
                            color='white'
                            fontWeight='bold'
                            borderRadius='md'
                            bgGradient='linear(to-l, blue.600, pink.500)'
                            _hover={{
                                bgGradient: "linear(to-l, blue.500, pink.400)",
                            }}>
                            save
                        </Button>
                    </Form>
                )}
            </Formik>
            <Button
                mt={4}
                p={4}
                color='white'
                fontWeight='bold'
                borderRadius='md'
                bgGradient='linear(to-l, blue.600, pink.500)'
                _hover={{
                    bgGradient: "linear(to-r, blue.500, pink.400)",
                }}
                onClick={() => router.back()}>
                cancel
            </Button>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
