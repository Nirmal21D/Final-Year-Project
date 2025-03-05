"use client";
import React, { useEffect, useState } from "react";

import LoginPage from "../../../components/LoginPage";
import { Box, Image } from "@chakra-ui/react";

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
          <Box id="login">
            <LoginPage handleLogin={handleLogin} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default login;
