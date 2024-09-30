"use client";
import React from "react";
import BankSidenav from "@/app/bankComponents/BankSidenav";
import Navbar from "@/app/bankComponents/Navbar";
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
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        minHeight="100vh" // Ensure it covers the viewport height
        width="auto" // Ensure it covers the viewport width
        overflow="hidden" // Prevent the background from being repeated unnecessarily
        color="white"
      >
        <Box display="flex" gap={30} justifyItems="center">
          <BankSidenav />
          <Navbar />
        </Box>
        bank plans here
      </Box>
    </>
  );
};

export default page;
