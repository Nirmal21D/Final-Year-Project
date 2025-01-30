"use client";

import React from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const InformationOptions = () => {
  const router = useRouter();

  const handleOptionClick = (option) => {
    if (option === "gold") {
      router.push("/informative/infoopt/gold");
    } else if (option === "tax") {
      router.push("/informative/infoopt/tax");
    } else if (option === "scheme") {
      router.push("/informative/infoopt/scheme");
    } else if (option == "news") {
      router.push("/news");
    } else {
      console.log(`Selected option: ${option}`);
    }
  };

  return (
    <Box
      p={5}
      borderRadius="md"
      boxShadow="lg"
      bg="rgba(255, 255, 255, 0.9)"
      maxWidth="800px"
      margin="auto"
      mt={5}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color="teal.600">
        Information Options
      </Heading>
      <HStack spacing={6} justify="center">
        <Button colorScheme="gray" onClick={() => handleOptionClick("gold")}>
          Gold
        </Button>
        <Button colorScheme="gray" onClick={() => handleOptionClick("tax")}>
          Tax
        </Button>
        <Button colorScheme="gray" onClick={() => handleOptionClick("scheme")}>
          Schemes
        </Button>
        <Button colorScheme="green" onClick={() => handleOptionClick("news")}>
          Bank to News
        </Button>
      </HStack>
    </Box>
  );
};

export default InformationOptions;
