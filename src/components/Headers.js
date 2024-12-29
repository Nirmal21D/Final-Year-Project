"use client";
import React from "react";
import SearchBox from "../components/SearchBar";
import NavbarMain from "../components/NavbarMain";
import { Box } from "@chakra-ui/react";

const Headers = () => {
  return (
    <>
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
        <SearchBox />
      </Box>

      <Box
        id="nav"
        width="100%"
        height="8vh"
        bg="#567C8D"
        display="flex"
        alignSelf="self"
        boxShadow="lg"
      >
        <NavbarMain />
      </Box>
    </>
  );
};

export default Headers;
