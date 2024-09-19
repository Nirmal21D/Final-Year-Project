"use client";
import React, { useState } from "react";
import { Text, Button } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from "@chakra-ui/react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);
  const [compound, setCompound] = useState(null);

  const calculateCompound = () => {
    const amount = principal * Math.pow(1 + rate / 100, time);
    setCompound((amount - principal).toFixed(2));
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={6}
        bg="rgba(117, 122, 140,0.299)"
        color="white"
        borderRadius="xl"
        shadow="md"
        width="100%"
        maxWidth="400px"
        mx="auto"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Compound Interest Calculator
        </Text>

        <NumberInput
          value={principal}
          onChange={(valueString) => setPrincipal(parseFloat(valueString) || 0)}
          placeholder="Principal Amount (₹)"
          mb={4}
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
          placeholder="Rate of Interest (%)"
          mb={4}
        >
          <NumberInputField placeholder="Rate of Interest (%)" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <NumberInput
          value={time}
          onChange={(valueString) => setTime(parseFloat(valueString) || 0)}
          placeholder="Time (years)"
          mb={4}
        >
          <NumberInputField placeholder="Time (years)" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Button
          color="#ebeff4"
          bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
          onClick={calculateCompound}
          width="100%"
          mb={4}
        >
          Calculate Compound Interest
        </Button>

        {compound && (
          <Text fontSize="lg" color="green.500" mt={4}>
            Compound Interest: ₹{compound}
          </Text>
        )}
      </Box>
    </>
  );
};

export default CompoundInterestCalculator;
