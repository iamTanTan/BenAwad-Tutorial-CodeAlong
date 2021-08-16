import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Box, Button, Link } from "@chakra-ui/react";
import { Wrapper } from "../../components/Wrapper";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/dist/client/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";

const ChangePassword: NextPage<{}> = () => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    const { token } = router.query;
    const [tokenError, setTokenError] = useState("");

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token: token as string,
                    });

                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name='newPassword'
                                label='New Password'
                                placeholder='new password'
                                type='password'
                            />
                        </Box>
                        {tokenError ? (
                            <Box>
                                <Box color='red'>{tokenError}</Box>
                                <NextLink href='/forgot-password'>
                                    <Link>Forgot Password?</Link>
                                </NextLink>
                            </Box>
                        ) : null}
                        <Button
                            mt={4}
                            type='submit'
                            isLoading={isSubmitting}
                            colorScheme='teal'>
                            Change Password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

// ChangePassword.getInitialProps = ({ query }) => {
//     return {
//         token: query.token as string,
//     };
// };

export default withUrqlClient(createUrqlClient)(ChangePassword);
