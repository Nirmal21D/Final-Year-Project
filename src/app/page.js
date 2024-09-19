"use client";
import React from "react";
import SideNav from "./components/SideNav";
import SearchBox from "./components/SearchBar";
import { Box, Text } from "@chakra-ui/react";
import Welcome from "./components/Welcome";
import InUp from "./components/InUp";

const Page = () => {
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
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        height="100vh"
        width="100%"
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
        >
          {/* <InUp /> */}
          <Welcome />
        </Box>
      </Box>
    </>
  );
};

export default Page;
