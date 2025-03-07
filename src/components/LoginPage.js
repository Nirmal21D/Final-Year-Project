"use client";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  useToast,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Heading,
  VStack,
  Link as ChakraLink,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  
  // Reset password states
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState("");
  
  // Hooks
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fix hydration issues by ensuring component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set reset email to login email when opening modal
  useEffect(() => {
    if (isOpen) {
      setResetEmail(email);
    }
  }, [isOpen, email]);
  
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Check user type in Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect based on user type
        if (userData.userType === "regular") {
          router.push("/");
        } else {
          router.push("/bankdashboard");
        }
      } else {
        // Try to check if it's a bank account
        const bankDocRef = doc(db, "Banks", userCredential.user.uid);
        const bankDoc = await getDoc(bankDocRef);
        
        if (bankDoc.exists()) {
          toast({
            title: "Login Successful",
            description: "Welcome back to your bank account!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          router.push("/bankdashboard");
        } else {
          // Handle case where user document doesn't exist
          console.error("User profile not found");
          toast({
            title: "Error",
            description: "User profile not found",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "An error occurred during login.";
      
      if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-email") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      setResetError("");
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for further instructions",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      
      let errorMessage = "Failed to send password reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      }
      
      setResetError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset modal state when closing
  const handleModalClose = () => {
    setResetEmailSent(false);
    setResetError("");
    onClose();
  };

  // Return null during server-side rendering
  if (!mounted) return null;

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} minHeight="100vh">
        {/* Left side - Image and intro */}
        <GridItem
          display={{ base: "none", md: "flex" }} 
          position="relative"
          overflow="hidden"
          bg="teal.500"
        >
          <Box 
            position="absolute" 
            top={0} 
            right={0} 
            bottom={0} 
            left={0} 
            backgroundImage="url(/images/login7.png)"
            backgroundPosition="center"
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
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
              <Heading size="2xl" mb={6}>Welcome Back!</Heading>
              <Text fontSize="xl" maxW="md" mb={10}>
                Log in to access your account and continue managing your finances.
              </Text>
              
              <VStack spacing={4} mt={8}>
                <Text fontSize="lg">Don't have an account?</Text>
                <Link href="/signup" passHref legacyBehavior>
                  <Button 
                    as="a" 
                    colorScheme="teal" 
                    size="lg"
                    borderRadius="full"
                    fontWeight="bold"
                    px={8}
                    bg="whiteAlpha.200"
                    _hover={{ bg: "whiteAlpha.300", transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  >
                    Create Account
                  </Button>
                </Link>
              </VStack>
            </Flex>
          </Box>
        </GridItem>

        {/* Right side - Login form */}
        <GridItem
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={{ base: 6, md: 10 }}
          bg="white"
        >
          <Box maxW="450px" mx="auto" w="full">
            <VStack align="start" spacing={8} mb={8}>
              <Heading 
                as="h1" 
                size="xl" 
                color="teal.600" 
                fontWeight="bold"
              >
                Login to Finance Mastery
              </Heading>
              <Text color="gray.600">
                Enter your credentials to access your account
              </Text>
            </VStack>
            
            <Box 
              as="form" 
              onSubmit={handleLogin} 
              boxShadow="lg" 
              p={8} 
              borderRadius="xl" 
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <VStack spacing={5} align="stretch">
                {/* Email Field */}
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
                      placeholder="your@email.com"
                      size="lg"
                      _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                    />
                  </InputGroup>
                  {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
                </FormControl>

                {/* Password Field */}
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
                      placeholder="Enter your password"
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

                {/* Forgot Password */}
                <Flex justify="flex-end">
                  <ChakraLink 
                    color="teal.600" 
                    fontWeight="medium"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                    onClick={onOpen}
                    cursor="pointer"
                  >
                    Forgot Password?
                  </ChakraLink>
                </Flex>

                {/* Login Button */}
                <Button
                  colorScheme="teal"
                  size="lg"
                  width="full"
                  mt={4}
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Logging In..."
                  fontWeight="bold"
                  py={7}
                  borderRadius="full"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Login
                </Button>
                
                {/* Mobile Sign Up Link */}
                <Box display={{ base: "block", md: "none" }} textAlign="center" mt={6}>
                  <Text color="gray.600">
                    Don't have an account?{" "}
                    <Link href="/signup" passHref legacyBehavior>
                      <Box as="a" color="teal.600" fontWeight="bold" _hover={{ textDecoration: "underline" }}>
                        Sign Up
                      </Box>
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </GridItem>
      </Grid>

      {/* Forgot Password Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" boxShadow="xl">
          <ModalHeader 
            bg="#003a5c" 
            color="white" 
            borderTopRadius="xl"
            py={4}
          >
            Reset Your Password
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody py={6}>
            {resetEmailSent ? (
              <VStack spacing={4} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    A password reset link has been sent to your email address. Please check your inbox and follow the instructions.
                  </AlertDescription>
                </Alert>
                <Text fontSize="sm" color="gray.600">
                  If you don't see the email in your inbox, please check your spam folder.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Text>
                  Enter your email address below and we'll send you a link to reset your password.
                </Text>
                {resetError && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {!resetEmailSent ? (
              <>
                <Button 
                  variant="outline" 
                  mr={3} 
                  onClick={handleModalClose}
                  borderRadius="md"
                >
                  Cancel
                </Button>
                <Button 
                  colorScheme="teal" 
                  onClick={handleForgotPassword}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  borderRadius="md"
                >
                  Send Reset Link
                </Button>
              </>
            ) : (
              <Button 
                colorScheme="teal" 
                onClick={handleModalClose}
                borderRadius="md"
              >
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginPage;
