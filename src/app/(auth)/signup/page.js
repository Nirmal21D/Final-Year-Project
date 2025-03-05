"use client";
import React, { useEffect, useState } from "react";
import SignUpPage from "../../../components/SignUpPage";
import { Box, Image } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth"; // Import getAuth instead

const auth = getAuth(); // Initialize auth

const SignUp = () => {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/"); // Redirect to home if user is already logged in
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
            id="logo"
            width="100%"
            height="9vh"
            background="#003a5c"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="#ffffff"
          >
            <Image
              src="/images/logo.png"
              width={200}
              pos={"absolute"}
              top={-14}
            />
          </Box>
        </Box>
        <Box id="lower" w="full">
          <Box id="signup">
            <SignUpPage isVerified={isVerified} />{" "}
            {/* Pass isVerified to SignUpPage */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
