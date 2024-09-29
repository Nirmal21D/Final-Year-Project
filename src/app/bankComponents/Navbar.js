"use client";
import React from "react";
import { Box, Text, Image } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <>
      <Box
        bg="rgba(229, 229, 229, 0.1)"
        width="90%"
        px={3}
        py={2}
        height={65}
        borderRadius="md"
        position="fixed"
        left={24}
        color="white"
      >
        <Box display="flex" gap={2}>
          <Image src="../../images/home.png" height={6} />
          <Text>/</Text>
          <Text>Dashboard</Text>
        </Box>
        <Text fontWeight="bold">Dashboard</Text>
      </Box>
    </>
  );
};

export default Navbar;
