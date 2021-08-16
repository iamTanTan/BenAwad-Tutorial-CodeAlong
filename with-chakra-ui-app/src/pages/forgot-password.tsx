import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const forgotPassword: React.FC<{}> = ({}) => {
    const [, forgotPassword] = useForgotPasswordMutation();
    const [complete, setComplete] = useState(false);
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values, { setErrors }) => {
                    await forgotPassword(values);
                    setComplete(true);
                }}>
                {({ isSubmitting }) =>
                    complete ? (
                        <Box>
                            An email has been sent to that address if it exists
                        </Box>
                    ) : (
                        <Form>
                            <Box mt={4}>
                                <InputField
                                    name='email'
                                    label='email'
                                    placeholder='email'
                                    type='email'
                                />
                            </Box>

                            <Button
                                mt={4}
                                type='submit'
                                isLoading={isSubmitting}
                                colorScheme='teal'>
                                send reset link
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
