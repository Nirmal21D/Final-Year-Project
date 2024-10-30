"use client";

import React from "react";
import { Box } from "@chakra-ui/react";
import BankSidenav from "@/bankComponents/BankSidenav";
// import Navbar from "@/app/bankComponents/Navbar";
import DashStats from "@/bankComponents/DashStats";
import BankWelcome from "@/bankComponents/BankWelcome";

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
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        minHeight="100vh" // Ensure it covers the viewport height
        width="auto" // Ensure it covers the viewport width
        overflow="hidden" // Prevent the background from being repeated unnecessarily
      >
        <Box display="flex" gap={30} justifyItems="center">
          <BankSidenav />
          {/* <Navbar /> */}
        </Box>
        <DashStats />
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
          top={8}
          my={5}
        >
          <BankWelcome />
        </Box>
      </Box>
    </>
  );
};

export default page;
