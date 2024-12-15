"use client";
import React from "react";
import SideNav from "../components/SideNav";
import SearchBox from "../components/SearchBar";
import { Box, Text } from "@chakra-ui/react";
import Welcome from "../components/Welcome";
import InUp from "../components/InUp";

import NavbarMain from "../components/NavbarMain";

const ProfilePage = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        backgroundImage="url(/images/newbg.png)"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh" // Ensures the background covers at least the full viewport height
        minWidth="auto" // Ensures the background covers the full viewport width
      >
        <Box
          width="100%"
          background="#003a5c"
          height="9vh"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          color="#ffffff"
        >
          Finance Mastery
          <SearchBox />
        </Box>

        <Box
          width="100%"
          height="8vh"
          bg="#567C8D"
          display="flex"
          alignSelf="self"
          boxShadow="lg"
        >
          <NavbarMain />
        </Box>
        <Box
          m="40px"
          height="30vh"
          width="90%"
          background="red"
          borderRadius="xl"
          boxShadow="lg"
          backdropFilter="blur(50px)" /* Glassmorphism Blur Effect */
          bg="rgba(255, 255, 255, 0.1)" /* Semi-transparent background */
          border="1px solid rgba(255, 255, 255)" /* Subtle white border */
        >
          <Welcome />
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
