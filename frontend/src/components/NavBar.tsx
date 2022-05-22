import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    //pause is added so that the query runs on the browser, but not the server
    const [{ data, fetching }] = useMeQuery({ pause: isServer() });
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    let body = null;
    const router = useRouter();

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
            <Flex align='center'>
                <NextLink href='./create-post'>
                    <Button
                        rightIcon={<SmallAddIcon />}
                        size='sm'
                        mr={4}
                        shadow='md'>
                        create post
                    </Button>
                </NextLink>
                <Box bgColor='white' bgClip='text'>
                    {data.me.username}
                </Box>
                <Button
                    ml={4}
                    variant='link'
                    bgColor='white'
                    bgClip='text'
                    onClick={async () => {
                        await logout();
                        router.reload();
                    }}
                    isLoading={logoutFetching}>
                    logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex
            position='sticky'
            top={0}
            zIndex={1}
            bgGradient='linear(to-l, blue.600, pink.500)'
            p={4}
            shadow='xl'>
            <Flex flex={1} m='auto' align='center' maxW={800}>
                <NextLink href='/'>
                    <Link>
                        <Heading
                            size='lg'
                            p={0}
                            mb={0}
                            color='white'
                            textShadow='1px 2px #000000'>
                            A Website
                        </Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    );
};
