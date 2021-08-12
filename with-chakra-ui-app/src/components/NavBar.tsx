import { Box, Flex, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    //pause is added so that the query runs on the browser, but not the server
    const [{ data, fetching }] = useMeQuery({ pause: isServer() });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    let body = null;

    //data is loading
    if (fetching) {
        // user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link mr={4} color='white'>
                        Login
                    </Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='white'>Register</Link>
                </NextLink>
            </>
        );
        // user is logged in
    } else {
        body = (
            <Flex>
                <Box>{data.me.username}</Box>
                <Button
                    ml={4}
                    variant='link'
                    onClick={() => {
                        logout();
                    }}
                    isLoading={logoutFetching}>
                    logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex bg='tan' p={4} ml={"auto"}>
            <Box ml={"auto"}>{body}</Box>
        </Flex>
    );
};
