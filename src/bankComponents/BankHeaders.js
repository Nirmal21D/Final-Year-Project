"use client";

import { Box, Text, Image } from "@chakra-ui/react";
import BankWelcome from "./BankWelcome";

const BankHeaders = () => {
  return (
    <Box
      id="main"
      w="full"
      height="10vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.300"
      zIndex="10"
      px={10}
    >
      {/* Left Section: Sidenav and Finance Mastery */}
      <Box id="left-sec" display="flex" alignItems="center" position="relative">
        <Text
          zIndex="15" // Added z-index to ensure text stays above background
          fontSize="lg" // Optional: adjust font size if needed
          fontWeight="medium" // Optional: adjust font weight if needed
        >
          <Image
            src="/images/logoDark.png"
            alt="Financial Portal Logo"
            width={220}
            objectFit="contain"
            position="relative"
            top="12px"
          />
        </Text>
      </Box>
    </Box>
  );
};

export default BankHeaders;
