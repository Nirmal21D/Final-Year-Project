"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);
  const [si, setSi] = useState(null);

  const calculateSI = () => {
    const siAmount = (principal * rate * time) / 100;
    setSi(siAmount.toFixed(2));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="gray.50"
      borderRadius="md"
      shadow="md"
      width="100%"
      maxWidth="400px"
      mx="auto"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Simple Interest Calculator
      </Text>

      <Input
        type="number"
        placeholder="Principal"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="Time (in years)"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
        mb={4}
        bg="white"
        size="lg"
      />

      <Button colorScheme="blue" onClick={calculateSI} width="100%" mb={4}>
        Calculate SI
      </Button>

      {si && (
        <Text fontSize="lg" color="green.500">
          Simple Interest: ₹{si}
        </Text>
      )}
    </Box>
  );
};

export default SimpleInterestCalculator;
