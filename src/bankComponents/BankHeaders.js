"use client";

import { Box, Text } from "@chakra-ui/react";
import BankWelcome from "./BankWelcome";

const BankHeaders = () => {
  return (
    <Box
      id="main"
      w="full"
      height="10vh"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.300"
      zIndex="10"
      px={10}
    >
      {/* Left Section: Sidenav and Finance Mastery */}
      <Box id="left" display="flex" alignItems="center" position="relative">
        <Text
          zIndex="15" // Added z-index to ensure text stays above background
          fontSize="lg" // Optional: adjust font size if needed
          fontWeight="medium" // Optional: adjust font weight if needed
        >
          Finance Mastery
        </Text>
      </Box>

      {/* Right Section: Profile */}
      <Box id="right">
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            width="2vw"
            height="2vw"
            borderRadius="50%"
            bg="red"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            B
          </Box>
          <Text>View Profile</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default BankHeaders;
