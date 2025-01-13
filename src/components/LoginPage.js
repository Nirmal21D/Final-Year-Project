"use client";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Flex,
  useToast,
  Divider,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");
  const [bankIdentifier, setBankIdentifier] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (
      (userType === "user" && !identifier) ||
      (userType === "bank" && !bankIdentifier) ||
      !password
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const email = userType === "user" ? identifier : bankIdentifier;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(`User logged in: ${userCredential.user.uid}`);

      toast({
        title: "Login Successful",
        description: `Logged in as ${userType}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on user type
      if (userType === "user") {
        router.push("/");
      } else if (userType === "bank") {
        router.push("/bankdashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result.user);

      toast({
        title: "Google Login Successful",
        description: "You've been logged in with Google.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during Google login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1.2fr 2fr" }} height="100vh">
        <GridItem>
          <Box
            position="relative"
            backgroundImage="url(/images/login7.png)"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            height="100%"
          >
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="full"
              height="full"
              display="flex"
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              color="#003a5c"
            >
              <Text fontSize="2xl" fontWeight="bold">
                Welcome Back!
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                Log in to access your account.
              </Text>
              <Box
                pt={16}
                display="flex"
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={4}
              >
                <Text fontSize="lg">Don't have an Account?</Text>
                <Link href=" /signup">
                  <Button colorScheme={"teal"} borderRadius={50}>
                    Sign Up
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </GridItem>
        <GridItem
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection={"column"}
        >
          <Box
            // border="1px solid #000000"
            display="flex"
            alignItems="flex-start"
            justifyContent="flex-start"
            w="62%"
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="#003a5c"
            >
              Login to Finance Mastery
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={6}
            color="#003a5c"
            borderRadius="xl"
            width="100%"
            maxWidth="600px"
            mx="auto"
            position="relative"
            top={14}
          >
            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Flex mb={4} width="100%" alignItems="center">
                <Text color="black" width="40%" fontWeight="bold" mr={4}>
                  Login as:
                </Text>
                <Select
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setIdentifier("");
                    setBankIdentifier("");
                  }}
                  bg="white"
                  color="black"
                  size="lg"
                  flex="1"
                >
                  <option value="user">User</option>
                  <option value="bank">Bank</option>
                </Select>
              </Flex>
              {userType === "user" && (
                <Flex mb={4} width="100%" alignItems="center">
                  <Text width="40%" fontWeight="bold" mr={4}>
                    Email or Username
                  </Text>
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your Email or Username"
                    bg="white"
                    color="black"
                    size="lg"
                    flex="1"
                  />
                </Flex>
              )}

              {userType === "bank" && (
                <Flex mb={4} width="100%" alignItems="center">
                  <Text width="40%" fontWeight="bold" mr={4}>
                    Bank ID or Bank Email
                  </Text>
                  <Input
                    type="text"
                    value={bankIdentifier}
                    onChange={(e) => setBankIdentifier(e.target.value)}
                    placeholder="Enter your Bank ID or Bank Email"
                    bg="white"
                    color="black"
                    size="lg"
                    flex="1"
                  />
                </Flex>
              )}

              <Flex mb={4} width="100%" alignItems="center">
                <Text width="40%" fontWeight="bold" mr={4}>
                  Password
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                  bg="white"
                  color="black"
                  size="lg"
                  flex="1"
                />
              </Flex>

              <Button
                color="white"
                colorScheme="teal"
                width="100%"
                mb={4}
                type="submit"
                borderRadius={50}
              >
                Login
              </Button>

              <Divider my={4} borderColor="#007b83" />
              <Text textAlign="center" mb={4}>
                OR
              </Text>

              <Button
                color="#007b83"
                bg="white"
                border="2px solid"
                borderColor="#007b83"
                width="100%"
                borderRadius={50}
                onClick={handleGoogleLogin}
              >
                Login with Google
              </Button>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

export default LoginPage;
