import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "./wrapper";
import { InputField } from "./inputField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { useLoginMutation } from "../generated/graphql";

interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values);
                    const response = await login({ options: values });
                    console.log(response.data?.login.errors);

                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
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
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Login;
