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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { useRouter } from "next/navigation";

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
        router.push("/profile");
      } else if (userType === "bank") {
        router.push("/pages/Bankpages/bankpanel");
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="rgba(117, 122, 140, 0.299)"
      color="white"
      borderRadius="xl"
      shadow="md"
      width="100%"
      maxWidth="600px"
      mx="auto"
      position="relative"
      top={14}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Login
      </Text>

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
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

        <Flex mb={4} width="100%" alignItems="center">
          <Text color="white" width="40%" fontWeight="bold" mr={4}>
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

        <Button
          color="white"
          bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
          _hover={{ bgGradient: "linear(to-r, #56577b, #302b63, #0f0c29)" }}
          width="100%"
          mb={4}
          type="submit"
        >
          Login
        </Button>

        <Divider my={4} borderColor="white" />
        <Text textAlign="center" mb={4}>
          OR
        </Text>

        <Button
          color="white"
          bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
          _hover={{ bgGradient: "linear(to-r, #56577b, #302b63, #0f0c29)" }}
          width="100%"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
