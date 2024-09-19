"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState(0);
  const [tax, setTax] = useState(null);

  const calculateTax = () => {
    let taxAmount = 0;
    if (income <= 250000) {
      taxAmount = 0;
    } else if (income <= 500000) {
      taxAmount = (income - 250000) * 0.05;
    } else if (income <= 1000000) {
      taxAmount = 12500 + (income - 500000) * 0.2;
    } else {
      taxAmount = 112500 + (income - 1000000) * 0.3;
    }
    setTax(taxAmount.toFixed(2));
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
        Income Tax Calculator
      </Text>

      <Input
        type="number"
        placeholder="Enter your income"
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
        mb={4}
        bg="white"
        size="lg"
      />

      <Button colorScheme="blue" onClick={calculateTax} width="100%" mb={4}>
        Calculate Tax
      </Button>

      {tax !== null && (
        <Text fontSize="lg" color="green.500">
          Tax: ₹{tax}
        </Text>
      )}
    </Box>
  );
};

export default IncomeTaxCalculator;
