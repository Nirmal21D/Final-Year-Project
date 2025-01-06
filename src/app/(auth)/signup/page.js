"use client";
import React, { useEffect, useState } from "react";
import SignUpPage from "../../../components/SignUpPage";
import { Box } from "@chakra-ui/react";
import SearchBox from "@/components/SearchBar";
const signup = () => {
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
            <SignUpPage />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default signup;
