"use client";
import React from "react";
import SideNav from "../../../components/SideNav";
import SearchBox from "../../../components/SearchBar";
import SignUpPage from "../../../components/SignUpPage";
import { Box } from "@chakra-ui/react";
const login = () => {
  return (
    <>
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
        height="auto"
        width="auto"
        minHeight="100vh" // Ensures the background covers at least the full viewport height
        minWidth="auto" // Ensures the background covers the full viewport width
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
          <SearchBox />
        </Box>

        <SignUpPage />
      </Box>
    </>
  );
};

export default login;
