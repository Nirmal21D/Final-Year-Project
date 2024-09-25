"use client";
// import Welcome from "./Welcome";
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

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(""); // Email or username
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Input for phone number
  const [userType, setUserType] = useState("user"); // Default to 'user'
  const [bankIdentifier, setBankIdentifier] = useState(""); // Bank ID or Bank Email
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userType === "user" && !identifier) {
      toast({
        title: "Error",
        description: "Please provide your Email or Username.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (userType === "bank" && !bankIdentifier) {
      toast({
        title: "Error",
        description: "Please provide your Bank ID or Bank Email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Example login logic (replace with your actual authentication logic)
    try {
      const loginSuccessful = await loginUser(identifier, password, userType);

      if (loginSuccessful) {
        // Redirect to the main page
        window.location.href = "/"; // Use window.location for redirection
        toast({
          title: "Login Successful.",

          description: `Logged in as ${userType}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Login failed.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login functionality here
    toast({
      title: "Google Login",
      description: "Logging in with Google...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    console.log("Google login initiated");
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
              setIdentifier(""); // Clear identifier input when switching types
              setBankIdentifier(""); // Clear bank input when switching types
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

// Mock login function (replace with your actual authentication logic)
const loginUser = async (identifier, password, userType) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
};

export default LoginPage;
