"use client";
import React from "react";
import SideNav from "./components/SideNav";
import SearchBox from "./components/SearchBar";
import { Box, Text } from "@chakra-ui/react";
import Welcome from "./components/Welcome";
import InUp from "./components/InUp";

const ProfilePage = () => {
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
        <Box
          alignSelf="center"
          backgroundImage="url(/images/creature.png)"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          height="60vh"
          width="95%"
          borderRadius="lg"
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
          p={8}
          position="relative"
          top={14}
        >
          {/* <InUp /> */}
          <Welcome />
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
