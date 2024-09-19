"use client";
import React from "react";
import { Text } from "@chakra-ui/react";

const Welcome = () => {
  return (
    <>
      <Text fontSize="md" color="gray.400">
        Welcome back,
      </Text>
      <Text fontSize="3xl" color="white" fontWeight="bold" mb={4}>
        Harshita Gawas
      </Text>
      <Text fontSize="lg" color="gray.400">
        Glad to see you again!
      </Text>
    </>
  );
};

export default Welcome;
