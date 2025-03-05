"use client";
import React from "react";
import SearchBox from "../components/SearchBar";
import NavbarMain from "../components/NavbarMain";
import { Box, Image } from "@chakra-ui/react";

const Headers = () => {
  return (
    <>
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
        <Image src="/images/logo.png" width={200} pos={"absolute"} top={-14} />
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
