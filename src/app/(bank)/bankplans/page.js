"use client";
import React from "react";
import BankSidenav from "@/bankComponents/BankSidenav";

import { Box, Flex } from "@chakra-ui/react";
import PlanDisplay from "@/bankComponents/plandisplay";
import BankHeaders from "@/bankComponents/BankHeaders";
const page = () => {
  return (
    <>
      <Flex h="auto">
        {/* Sidebar */}
        <Box
          w="20%"
          bg="gray.800"
          color="white"
          p={4}
          position={"fixed"}
          h={"full"}
        >
          <BankSidenav />
        </Box>

        {/* Main Content */}
        <Box
          w="80%"
          bg="gray.50"
          display="flex"
          flexDirection="column"
          position={"absolute"}
          left={"20%"}
          h={"full"}
        >
          <Box position="fixed" width="80%" zIndex={1000}>
            <BankHeaders />
          </Box>
          <Box px={6} mt={20} h="full">
            <PlanDisplay />
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default page;
