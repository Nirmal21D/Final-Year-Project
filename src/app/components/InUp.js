"use client";
import React from "react";
import { Text, Button, Box } from "@chakra-ui/react";

const InUp = () => {
  return (
    <>
      <Text fontSize="lg" color="gray.400">
        Dont have an account yet??
      </Text>
      <Box display="flex" flexDirection="column" gap={4}>
        <Button
          width="10vw"
          color="#ebeff4"
          bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
          height="auto"
        >
          Sign In
        </Button>
        <Button
          width="12vw"
          color="#ebeff4"
          bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
        >
          Create an Account
        </Button>
      </Box>
    </>
  );
};

export default InUp;
