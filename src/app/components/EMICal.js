"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const EMICalculatorPage = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [tenure, setTenure] = useState(0);
  const [emi, setEmi] = useState(null);
  const [monthlyamount, setMonthlyamount] = useState(null);
  const [withInterestAmount, setWithInterestAmount] = useState(null);
  const [monthlyAmountWithInterest, setMonthlyAmountWithInterest] =
    useState(null);

  const calculateEMI = () => {
    const monthlyRate = rate / 12 / 100;
    const emiAmount =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    const monthlyAmount = principal / tenure;
    const totalWithInterest = emiAmount + principal;
    const monthlyAmountWithInterest = totalWithInterest / tenure;

    setMonthlyamount(monthlyAmount.toFixed(2));
    setEmi(emiAmount.toFixed(2));
    setWithInterestAmount(totalWithInterest.toFixed(2));
    setMonthlyAmountWithInterest(monthlyAmountWithInterest.toFixed(2));
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
        EMI Calculator
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
        placeholder="Tenure (in months)"
        value={tenure}
        onChange={(e) => setTenure(Number(e.target.value))}
        mb={4}
        bg="white"
        size="lg"
      />

      <Button colorScheme="blue" onClick={calculateEMI} width="100%" mb={4}>
        Calculate EMI
      </Button>

      {emi && (
        <Text fontSize="lg" color="green.500">
          EMI Amount: ₹{emi}
        </Text>
      )}
      {monthlyamount && (
        <Text fontSize="lg" color="green.500">
          Monthly Amount Without Interest: ₹{monthlyamount}
        </Text>
      )}
      {withInterestAmount && (
        <Text fontSize="lg" color="green.500">
          Total Repayment with Interest: ₹{withInterestAmount}
        </Text>
      )}
      {monthlyAmountWithInterest && (
        <Text fontSize="lg" color="green.500">
          Monthly Amount With Interest: ₹{monthlyAmountWithInterest}
        </Text>
      )}
    </Box>
  );
};

export default EMICalculatorPage;
