"use client";
import React, { useEffect, useState } from "react";

import LoginPage from "../../../components/LoginPage";
import { Box } from "@chakra-ui/react";

const login = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  useEffect(() => {
    if (userLoggedIn) {
      // Redirect logic or state change to welcome page can be handled here
      // For example, you can set a state to show a welcome message or component
      console.log("User logged in, show welcome message.");
    }
  }, [userLoggedIn]);

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
          <Box id="login">
            <LoginPage handleLogin={handleLogin} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default login;
