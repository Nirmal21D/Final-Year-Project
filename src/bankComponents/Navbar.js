"use client";
import React from "react";
import { Box, Text, Image, Flex, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import SideNav from './BankSidenav';

const Navbar = ({ onOpen }) => {
  return (
    <>
      <Box
        bg="rgba(255, 255, 255, 0.9)"
        width="100%"
        px={4}
        py={3}
        height={70}
        borderRadius="md"
        position="fixed"
        left={0}
        color="black"
        boxShadow="md"
      >
        <SideNav />
        <Flex align="center" justify="space-between" pl={16}>
          <Flex align="center" gap={3}>
            <Image src="../../images/home.png" height={8} />
            <Text fontSize="lg" fontWeight="semibold">Dashboard</Text>
          </Flex>
          <Text fontWeight="bold" fontSize="lg">Dashboard</Text>
        </Flex>
      </Box>
      
    </>
  );
};

export default Navbar;
