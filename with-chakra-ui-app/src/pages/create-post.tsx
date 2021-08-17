import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    useIsAuth();

    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values) => {
                    const { error } = await createPost({ input: values });
                    if (!error) {
                        router.push("/");
                    }
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
                            colorScheme='teal'>
                            create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
