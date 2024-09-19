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
        gap={10}
        alignItems="center"
        justifyItems="center"
        px={5}
      >
        <SideNav />
        <SearchBox />
      </Box>
    </>
  );
};

export default page;
