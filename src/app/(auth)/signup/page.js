"use client";
import React, { useEffect, useState } from "react";
import SignUpPage from "../../../components/SignUpPage";
import { Box } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBar";
import { useRouter } from "next/navigation"; // Changed from next/router

const SignUp = () => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize useRouter

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

  const [isVerified, setIsVerified] = useState(false); // Set isVerified to false when creating a bank account

  return (
    <>
      <Box
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        height="auto"
        width="auto"
        minHeight="100vh"
        minWidth="auto"
      >
        <Box
          id="upper"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Box
            id="search"
            width="100%"
            background="#003a5c"
            height="9vh"
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            color="#ffffff"
          >
            Finance Mastery
          </Box>
        </Box>
        <Box id="lower" w="full">
          <Box id="signup">
            <SignUpPage isVerified={isVerified} /> {/* Pass isVerified to SignUpPage */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
