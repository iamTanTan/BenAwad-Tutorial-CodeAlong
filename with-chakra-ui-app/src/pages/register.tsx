import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Register: React.FC<{}> = ({}) => {
    const [, register] = useRegisterMutation();
    const router = useRouter();
    return (
        <>
            <NavBar />
            <Wrapper variant='small'>
                <Formik
                    initialValues={{ email: "", username: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await register({ options: values });

                        if (response.data?.register.errors) {
                            setErrors(
                                toErrorMap(response.data.register.errors)
                            );
                        } else if (response.data?.register.user) {
                            router.push("/");
                        }
                    }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name='username'
                                    label='Username'
                                    placeholder='username'
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name='email'
                                    label='Email'
                                    placeholder='email'
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name='password'
                                    label='Password'
                                    placeholder='password'
                                    type='password'
                                />
                            </Box>

                            <Button
                                mt={4}
                                type='submit'
                                isLoading={isSubmitting}
                                colorScheme='teal'>
                                Register
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
