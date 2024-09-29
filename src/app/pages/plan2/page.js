"use client";
import React from "react";
import SideNav from "@/app/components/SideNav";
import SearchBox from "../../components/SearchBar";
import { Box } from "@chakra-ui/react";

const page = () => {
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
      </Box>
    </>
  );
};

export default page;
