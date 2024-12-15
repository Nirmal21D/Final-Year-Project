"use client";

import React, { useEffect, useState } from "react";
import SideNav from "../../../components/SideNav";
import SearchBox from "../../../components/SearchBar";
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
    <Box
      display="flex"
      flexDirection="column"
      gap={10}
      justifyItems="center"
      p={5}
      backgroundImage="url(/images/body-background.png)"
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundAttachment="fixed"
      backgroundRepeat="no-repeat"
      height="100vh"
      width="100%"
      minHeight="100vh" // Ensures the background covers at least the full viewport height
      minWidth="100vw" // Ensures the background covers the full viewport width
    >
      <Box display="flex" gap={10} justifyItems="center">
        <SideNav />
        <SearchBox />
      </Box>
      <LoginPage onLogin={handleLogin} />
    </Box>
  );
};

export default login;
