import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Login: React.FC<{}> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <>
            <NavBar />
            <Wrapper variant='small'>
                <Formik
                    initialValues={{ usernameOrEmail: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await login(values);

                        if (response.data?.login.errors) {
                            setErrors(toErrorMap(response.data.login.errors));
                        } else if (response.data?.login.user) {
                            if (typeof router.query.next === "string") {
                                router.push(router.query.next);
                            } else {
                                router.push("/");
                            }
                        }
                    }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name='usernameOrEmail'
                                    label='Username or Email'
                                    placeholder='username or email'
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
                            <Flex>
                                <NextLink href='/forgot-password'>
                                    <Link mt={2} ml='auto'>
                                        forgot password?
                                    </Link>
                                </NextLink>
                            </Flex>
                            <Button
                                mt={4}
                                type='submit'
                                isLoading={isSubmitting}
                                colorScheme='teal'>
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
