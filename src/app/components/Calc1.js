"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Grid,
  VStack,
  Text,
  Heading,
  useNumberInput,
} from "@chakra-ui/react";

const FinancialCalculator = () => {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState("");

  const handleCalculateEMI = () => {
    // EMI formula: P x r x (1 + r)^n / [(1 + r)^n – 1]
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate) / 100;
    const monthlyRate = annualRate / 12;
    const numOfPayments = parseFloat(tenure) * 12;

    const emiCalc =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numOfPayments)) /
      (Math.pow(1 + monthlyRate, numOfPayments) - 1);

    setEmi(emiCalc.toFixed(2));
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={6}
      bg="gray.100"
      borderRadius="md"
      boxShadow="lg"
    >
      <VStack spacing={4}>
        <Heading size="lg" mb={4}>
          Financial Calculator
        </Heading>

        <Input
          placeholder="Loan Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          focusBorderColor="teal.400"
        />
        <Input
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          type="number"
          focusBorderColor="teal.400"
        />
        <Input
          placeholder="Loan Tenure (Years)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          type="number"
          focusBorderColor="teal.400"
        />

        <Button colorScheme="teal" width="100%" onClick={handleCalculateEMI}>
          Calculate EMI
        </Button>

        {emi && (
          <Box textAlign="center" mt={4}>
            <Text fontSize="lg" fontWeight="bold">
              Monthly EMI: ₹{emi}
            </Text>
          </Box>
        )}
      </VStack>

      <Box mt={6}>
        <Heading size="md" mb={4}>
          Other Financial Calculations
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Button colorScheme="blue">Interest Calculator</Button>
          <Button colorScheme="blue">Loan Repayment</Button>
          <Button colorScheme="blue">Investment Return</Button>
          <Button colorScheme="blue">Savings</Button>
        </Grid>
      </Box>
    </Box>
  );
};

export default FinancialCalculator;
