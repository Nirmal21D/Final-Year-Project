"use client";
import {
  Box,
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SIPCalculator = () => {
  const [installment, setInstallment] = useState(0); // Monthly SIP amount
  const [rate, setRate] = useState(0); // Annual interest rate
  const [months, setMonths] = useState(0); // Investment duration in months
  const [sipValue, setSipValue] = useState(null);

  const calculateSIP = () => {
    const monthlyRate = rate / 100 / 12; // Convert annual rate to monthly and decimal
    const totalAmount =
      installment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    setSipValue(totalAmount.toFixed(2));
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
        SIP Calculator
      </Text>

      <NumberInput
        value={installment}
        onChange={(valueString) => setInstallment(parseFloat(valueString) || 0)}
        mb={4}
        bg="white"
        size="lg"
        placeholder="Monthly Installment (₹)"
      >
        <NumberInputField placeholder="Monthly Installment (₹)" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <Input
        value={rate}
        type="number"
        placeholder="Annual Interest Rate (%)"
        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />

      <Input
        value={months}
        type="number"
        placeholder="Time Period (in months)"
        onChange={(e) => setMonths(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />

      <Button colorScheme="blue" onClick={calculateSIP} width="100%" mb={4}>
        Calculate SIP
      </Button>

      {sipValue && (
        <Text fontSize="lg" color="green.500">
          Future Value: ₹{sipValue}
        </Text>
      )}
    </Box>
  );
};

export default SIPCalculator;
