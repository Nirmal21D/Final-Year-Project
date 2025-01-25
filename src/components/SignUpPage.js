"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  useToast,
  Divider,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "../firebase"; // Adjust the path as necessary
import { setDoc, doc, getDoc } from "firebase/firestore"; // Firestore functions
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation"; // Changed from next/router

const SignUpPage = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [salary, setSalary] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [profileImage, setProfileImage] = useState(null);
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [bankEmail, setBankEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [bpaswd, setBpaswd] = useState("");
  const [status, setStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/'); // Redirect to home if user is already logged in
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]); // Add router to dependency array

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic validation for regular users
    if (userType === "regular" && (!name || !email || !password)) {
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
    if (userType === "bank" && (!bankEmail || !bankName || !bpaswd)) {
      toast({
        title: "Error",
        description: "Please fill in all the required fields for Bank.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      let userCredential;
      if (userType === "regular") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          bankEmail,
          bpaswd
        );
      }
      const user = userCredential.user;

      if (userType === "regular") {
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          name: userType === "regular" ? name : null,
          email: userType === "regular" ? email : bankEmail,
          userType,
          salary: null,
          mobileNumber: null,
          profileImage: null,
        });
      } else if (userType === "bank") {
        await setDoc(doc(db, "Banks", user.uid), {
          bankEmail,
          bankName,
          bpaswd,
          isVerified: false, // Set isVerified to false for bank accounts
        });
      }

      toast({
        title: "Sign Up Successful",
        description: `Welcome, ${
          userType === "bank" ? bankName : name
        }! Your account has been created.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (userType === "regular") {
        window.location.href = "/";
      } else if (userType === "bank") {
        window.location.href = "/bankdashboard";
      }
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
      setIsLoading(false);
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
          userId: user.uid,
          name: user.displayName || "",
          userType,
          salary: null,
          mobileNumber: null,
          profileImage: null,
          email: user.email,
        });
      }

      toast({
        title: "Google Sign Up Successful",
        description: `Welcome, ${user.displayName || "User"}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (userType === "regular") {
        window.location.href = "/";
      } else if (userType === "bank") {
        window.location.href = "/bankdashboard";
      }
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
  //

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1.2fr" }} height="100vh">
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
              position={"fixed"}
              top={28}
            >
              Sign Up for Finance Mastery
            </Text>
          </Box>
          <Box
            // display="flex"
            // flexDirection="column"
            // alignItems="center"
            // justifyContent="center"
            // p={6}
            // color="white"
            // borderRadius="xl"
            // width="100%"
            // maxWidth="600px"
            // mx="auto"
            // mt={10}
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
                      Name
                    </Text>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your Name"
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
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Signing Up..."
                    width="full"
                    mb={4}
                    colorScheme="teal"
                    borderRadius={50}
                  >
                    Sign Up
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
                    onClick={handleGoogleSignUp}
                  >
                    Signup with Google
                  </Button>
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

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Signing Up..."
                    width="full"
                    mb={4}
                    colorScheme="teal"
                    borderRadius={50}
                  >
                    Sign Up
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
                    onClick={handleGoogleSignUp}
                  >
                    Signup with Google
                  </Button>
                </>
              )}
            </form>
          </Box>
        </GridItem>
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
                Don't have an Account?
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                Create one now!
              </Text>
              <Box
                pt={16}
                display="flex"
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={4}
              >
                <Text fontSize="lg">Already have an Account?</Text>
                <Link href=" /login">
                  <Button colorScheme={"teal"} borderRadius={50}>
                    Login
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
export default SignUpPage;
