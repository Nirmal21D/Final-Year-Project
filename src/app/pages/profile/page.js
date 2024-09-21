"use client";
import React from "react";
import SideNav from "../../components/SideNav";
import SearchBox from "../../components/SearchBar";
import ProfilePage from "../../components/ProfilePage";
import { Box, Text } from "@chakra-ui/react";
const profile = () => {
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
        width="100%"
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
          <SearchBox />
        </Box>

        <ProfilePage />
      </Box>
    </>
  );
};

export default profile;
