"use client";
import {
  Box,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

const FDCalculator = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);
  const [fdAmount, setFDAmount] = useState(null);

  const calculateFD = () => {
    const maturityAmount = principal * Math.pow(1 + rate / 100, time);
    setFDAmount(maturityAmount.toFixed(2));
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
        Fixed Deposit Calculator
      </Text>

      <NumberInput
        value={principal}
        onChange={(valueString) => setPrincipal(parseFloat(valueString) || 0)}
        mb={4}
        bg="white"
        size="lg"
        placeholder="Principal Amount (₹)"
      >
        <NumberInputField placeholder="Principal Amount (₹)" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput
        value={rate}
        onChange={(valueString) => setRate(parseFloat(valueString) || 0)}
        mb={4}
        bg="white"
        size="lg"
        placeholder="Interest Rate (%)"
      >
        <NumberInputField placeholder="Interest Rate (%)" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput
        value={time}
        onChange={(valueString) => setTime(parseFloat(valueString) || 0)}
        mb={4}
        bg="white"
        size="lg"
        placeholder="Time (years)"
      >
        <NumberInputField placeholder="Time (years)" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Button colorScheme="blue" onClick={calculateFD} width="100%" mb={4}>
        Calculate FD
      </Button>

      {fdAmount && (
        <Text fontSize="lg" color="green.500">
          FD Maturity Amount: ₹{fdAmount}
        </Text>
      )}
    </Box>
  );
};

export default FDCalculator;
