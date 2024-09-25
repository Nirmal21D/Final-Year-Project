"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  useToast,
  Divider,
  Select,
} from "@chakra-ui/react";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../../firebase"; // Adjust the path as necessary
import { setDoc, doc, getDoc } from "firebase/firestore"; // Firestore functions
import Link from "next/link";

const SignUpPage = () => {
  // State variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [bankEmail, setBankEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [bpaswd, setBpaswd] = useState("");
  const [ifscode, setIfscode] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const toast = useToast();

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation for regular users
    if (
      userType === "regular" &&
      (!firstName || !lastName || !email || !username || !password)
    ) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Basic validation for bank users
    if (
      userType === "bank" &&
      (!bankEmail || !bankName || !bpaswd || !ifscode)
    ) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields for Bank.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Create user with email and password if userType is "regular" or "bank"
      let userCredential;
      if (userType === "regular") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        // For "bank" users
        userCredential = await createUserWithEmailAndPassword(
          auth,
          bankEmail,
          bpaswd
        );
      }
      const user = userCredential.user;

      // Add user to Firebase Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: userType === "regular" ? firstName : null,
        lastName: userType === "regular" ? lastName : null,
        email: userType === "regular" ? email : bankEmail,
        username: userType === "regular" ? username : null,
        userType,
        ...(userType === "bank" && {
          bankEmail,
          bankName,
          bpaswd, // Security: Consider hashing this before storing
          ifscode,
        }),
        createdAt: new Date(),
      });

      toast({
        title: "Sign Up Successful",
        description: `Welcome, ${
          userType === "bank" ? bankName : firstName
        }! Your account has been created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect the user to the dashboard or desired page
      // Example: window.location.href = "/dashboard";
    } catch (error) {
      console.error("Sign Up Error:", error);
      let errorMessage = "An error occurred during sign up.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    setIsLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Add user data to Firestore
        await setDoc(userDocRef, {
          email: user.email,
          username: user.displayName || "",
          userType: "regular",
          createdAt: new Date(),
        });
      }

      toast({
        title: "Google Sign Up Successful",
        description: `Welcome, ${user.displayName || "User"}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect the user to the dashboard or desired page
      // Example: window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      let errorMessage = "An error occurred during Google sign up.";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "The popup was closed before completing the sign in.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="rgba(117, 122, 140,0.299)"
      color="white"
      borderRadius="xl"
      shadow="md"
      width="100%"
      maxWidth="600px"
      mx="auto"
      mt={10}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Sign Up
      </Text>

      <form onSubmit={handleSignUp} style={{ width: "100%" }}>
        {/* User Type Selection */}
        <Flex mb={4} width="100%" alignItems="center">
          <Text width="40%" fontWeight="bold" mr={4}>
            User Type
          </Text>
          <Select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            bg="white"
            color="black"
            size="lg"
            flex="1"
            placeholder="Select user type"
            required
          >
            <option value="regular">Regular User</option>
            <option value="bank">Bank</option>
          </Select>
        </Flex>

        {/* Regular User Fields */}
        {userType === "regular" && (
          <>
            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                First Name
              </Text>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your First Name"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Last Name
              </Text>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your Last Name"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Email
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Username
              </Text>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your Username"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

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
                required
              />
            </Flex>

            <Button
              onClick={handleGoogleSignUp}
              colorScheme="red"
              width="full"
              isLoading={isLoading}
              bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
              _hover={{ bgGradient: "linear(to-r, #56577b, #302b63, #0f0c29)" }}
            >
              Sign Up with Google
            </Button>
            <Divider my={4} borderColor="white" />
          </>
        )}

        {/* Bank User Fields */}
        {userType === "bank" && (
          <>
            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Bank Email
              </Text>
              <Input
                type="email"
                value={bankEmail}
                onChange={(e) => setBankEmail(e.target.value)}
                placeholder="Enter your Bank Email"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Bank Name
              </Text>
              <Input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter your Bank Name"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                Bank Password
              </Text>
              <Input
                type="password"
                value={bpaswd}
                onChange={(e) => setBpaswd(e.target.value)}
                placeholder="Enter your Bank Password"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>

            <Flex mb={4} width="100%" alignItems="center">
              <Text width="40%" fontWeight="bold" mr={4}>
                IFSC Code
              </Text>
              <Input
                type="text"
                value={ifscode}
                onChange={(e) => setIfscode(e.target.value)}
                placeholder="Enter your IFSC Code"
                bg="white"
                color="black"
                size="lg"
                flex="1"
                required
              />
            </Flex>
          </>
        )}

        <Link href="/">
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Signing Up..."
            colorScheme="teal"
            width="full"
            mb={4}
            bgGradient="linear(to-r, #0f0c29, #302b63, #24243e)"
            _hover={{ bgGradient: "linear(to-r, #56577b, #302b63, #0f0c29)" }}
          >
            Sign Up
          </Button>
        </Link>
      </form>
    </Box>
  );
};

export default SignUpPage;
