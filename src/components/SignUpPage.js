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
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Heading,
  VStack,
  HStack,
  Icon,
  Image
} from "@chakra-ui/react";
import { auth, db, createUserWithEmailAndPassword } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";

const SignUpPage = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("regular");
  const [bankEmail, setBankEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [bpaswd, setBpaswd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push('/');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (userType === "regular") {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
      
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
      
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    } else {
      if (!bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!bankEmail.trim()) newErrors.bankEmail = "Bank email is required";
      else if (!/\S+@\S+\.\S+/.test(bankEmail)) newErrors.bankEmail = "Email is invalid";
      
      if (!bpaswd) newErrors.bpaswd = "Password is required";
      else if (bpaswd.length < 6) newErrors.bpaswd = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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
          name,
          email,
          userType,
          createdAt: new Date(),
          salary: null,
          mobileNumber: null,
          profileImage: null,
        });
      } else if (userType === "bank") {
        await setDoc(doc(db, "Banks", user.uid), {
          bankEmail,
          bankName,
          createdAt: new Date(),
          isVerified: false,
        });
      }

      toast({
        title: "Account Created Successfully",
        description: userType === "bank" 
          ? "Welcome to Finance Mastery! Your bank account is pending verification." 
          : "Welcome to Finance Mastery! Your account has been created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (userType === "regular") {
        router.push("/");
      } else if (userType === "bank") {
        router.push("/bankdashboard");
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

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} minHeight="100vh">
      {/* Left side - Form */}
      <GridItem 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        p={{ base: 6, md: 10 }}
        bg="white"
      >
        <Box maxW="500px" mx="auto" w="full">
          <Heading 
            as="h1" 
            size="xl" 
            color="teal.600" 
            mb={8}
            fontWeight="bold"
          >
            Create your account
          </Heading>
          
          <Box 
            as="form" 
            onSubmit={handleSignUp} 
            boxShadow="lg" 
            p={8} 
            borderRadius="xl" 
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
          >
            {/* User Type Selection */}
            <FormControl mb={6}>
              <FormLabel fontWeight="medium">I am a</FormLabel>
              <HStack spacing={4}>
                <Button
                  type="button"
                  colorScheme={userType === "regular" ? "teal" : "gray"}
                  variant={userType === "regular" ? "solid" : "outline"}
                  size="lg"
                  flex="1"
                  onClick={() => setUserType("regular")}
                  leftIcon={<Icon as={FiUser} />}
                >
                  Individual
                </Button>
                <Button
                  type="button"
                  colorScheme={userType === "bank" ? "teal" : "gray"}
                  variant={userType === "bank" ? "solid" : "outline"}
                  size="lg"
                  flex="1"
                  onClick={() => setUserType("bank")}
                  leftIcon={<Icon as={FiCheck} />}
                >
                  Bank
                </Button>
              </HStack>
            </FormControl>

            {/* Regular User Fields */}
            {userType === "regular" ? (
              <VStack spacing={5} align="stretch">
                <FormControl isInvalid={errors.name}>
                  <FormLabel fontWeight="medium">Full Name</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors({...errors, name: null});
                      }}
                      placeholder="Enter your full name"
                      size="lg"
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                    />
                  </InputGroup>
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.email}>
                  <FormLabel fontWeight="medium">Email Address</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({...errors, email: null});
                      }}
                      placeholder="name@example.com"
                      size="lg"
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                    />
                  </InputGroup>
                  {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel fontWeight="medium">Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({...errors, password: null});
                      }}
                      placeholder="Create a password"
                      size="lg"
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                    />
                    <InputRightElement width="4.5rem" h="100%">
                      <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({...errors, confirmPassword: null});
                    }}
                    placeholder="Confirm your password"
                    size="lg"
                    _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                  />
                  {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>}
                </FormControl>
              </VStack>
            ) : (
              <VStack spacing={5} align="stretch">
                <FormControl isInvalid={errors.bankName}>
                  <FormLabel fontWeight="medium">Bank Name</FormLabel>
                  <Input
                    type="text"
                    value={bankName}
                    onChange={(e) => {
                      setBankName(e.target.value);
                      setErrors({...errors, bankName: null});
                    }}
                    placeholder="Enter your bank's name"
                    size="lg"
                    _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                  />
                  {errors.bankName && <FormErrorMessage>{errors.bankName}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.bankEmail}>
                  <FormLabel fontWeight="medium">Bank Email</FormLabel>
                  <Input
                    type="email"
                    value={bankEmail}
                    onChange={(e) => {
                      setBankEmail(e.target.value);
                      setErrors({...errors, bankEmail: null});
                    }}
                    placeholder="bank@example.com"
                    size="lg"
                    _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                  />
                  {errors.bankEmail && <FormErrorMessage>{errors.bankEmail}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={errors.bpaswd}>
                  <FormLabel fontWeight="medium">Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={bpaswd}
                      onChange={(e) => {
                        setBpaswd(e.target.value);
                        setErrors({...errors, bpaswd: null});
                      }}
                      placeholder="Create a secure password"
                      size="lg"
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                    />
                    <InputRightElement width="4.5rem" h="100%">
                      <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {errors.bpaswd && <FormErrorMessage>{errors.bpaswd}</FormErrorMessage>}
                </FormControl>
              </VStack>
            )}

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              mt={8}
              isLoading={isLoading}
              loadingText="Creating Account..."
              fontWeight="bold"
              py={7}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Create Account
            </Button>
            
            <Text mt={6} textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Link href="/login" passHref>
                <Box as="span" color="teal.600" fontWeight="bold" _hover={{ textDecoration: "underline" }}>
                  Log In
                </Box>
              </Link>
            </Text>
          </Box>
        </Box>
      </GridItem>

      {/* Right side - Image */}
      <GridItem 
        display={{ base: "none", md: "flex" }} 
        bg="teal.500" 
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top={0} 
          right={0} 
          bottom={0} 
          left={0} 
          backgroundImage="url(/images/login7.png)"
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Flex 
            direction="column" 
            justify="center" 
            align="center" 
            h="full" 
            bg="rgba(0,58,92,0.7)"
            p={8}
            color="white"
            textAlign="center"
          >
            <Heading size="2xl" mb={6}>Join Finance Mastery</Heading>
            <Text fontSize="xl" maxW="md">
              Take control of your financial future with smart investment planning and loan management.
            </Text>
          </Flex>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SignUpPage;
