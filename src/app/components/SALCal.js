"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";

const SalaryCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);
  const [ta, setTa] = useState(0);
  const [pf, setPf] = useState(0);
  const [tax, setTax] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [grossSalary, setGrossSalary] = useState(null);

  const calculateSalary = () => {
    // Calculate HRA and PF as percentages
    const hraAmount = basicSalary * (hra / 100);
    const pfAmount = basicSalary * (pf / 100);

    // Calculate Gross Salary
    const totalGrossSalary =
      basicSalary + hraAmount + ta - pfAmount - tax - otherDeductions;
    setGrossSalary(totalGrossSalary.toFixed(2));
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
        Salary Calculator
      </Text>

      <Input
        type="number"
        placeholder="Basic Salary"
        value={basicSalary}
        onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="HRA (%)"
        value={hra}
        onChange={(e) => setHra(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="Transport Allowance (₹)"
        value={ta}
        onChange={(e) => setTa(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="PF (%)"
        value={pf}
        onChange={(e) => setPf(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="Tax (₹)"
        value={tax}
        onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      <Input
        type="number"
        placeholder="Other Deductions (₹)"
        value={otherDeductions}
        onChange={(e) => setOtherDeductions(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />

      <Button colorScheme="blue" onClick={calculateSalary} width="100%" mb={4}>
        Calculate Salary
      </Button>

      {grossSalary && (
        <Text fontSize="lg" color="green.500">
          Gross Salary: ₹{grossSalary}
        </Text>
      )}
    </Box>
  );
};

export default SalaryCalculator;
