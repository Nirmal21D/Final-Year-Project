"use client";
import {
  Box,
  Button,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Text,
  Flex,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";

const SalaryCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(10000);
  const [hra, setHra] = useState(10);
  const [ta, setTa] = useState(1000);
  const [pf, setPf] = useState(5);
  const [tax, setTax] = useState(1000);
  const [otherDeductions, setOtherDeductions] = useState(500);
  const [grossSalary, setGrossSalary] = useState(null);

  const calculateSalary = () => {
    const hraAmount = basicSalary * (hra / 100);
    const pfAmount = basicSalary * (pf / 100);

    const totalGrossSalary =
      basicSalary + hraAmount + ta - pfAmount - tax - otherDeductions;
    setGrossSalary(totalGrossSalary.toFixed(2));
  };

  const renderSliderWithTextbox = (label, value, setValue, min, max, step, unit = "") => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Box mb={6} width="100%">
        <Text mb={2}>{label}</Text>
        <Flex alignItems="center">
          <Slider
            flex="1"
            defaultValue={value}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(v) => setValue(v)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            colorScheme="teal"
            mr={4}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${value}${unit}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <Input
            width="100px"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            type="number"
            textAlign="center"
          />
        </Flex>
      </Box>
    );
  };

  return (
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
        Salary Calculator
      </Text>

      {renderSliderWithTextbox("Basic Salary (₹)", basicSalary, setBasicSalary, 5000, 1000000, 1000, "₹")}
      {renderSliderWithTextbox("HRA (%)", hra, setHra, 0, 50, 0.5, "%")}
      <Input
        type="number"
        placeholder="Transport Allowance (₹)"
        value={ta}
        onChange={(e) => setTa(parseFloat(e.target.value) || 0)}
        mb={4}
        bg="white"
        size="lg"
      />
      {renderSliderWithTextbox("PF (%)", pf, setPf, 0, 20, 0.5, "%")}
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

      <Button
        color="#ebeff4"
        bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
        onClick={calculateSalary}
        width="100%"
        mb={4}
      >
        Calculate Salary
      </Button>

      {grossSalary && (
        <Text fontSize="lg" color="green.500" mt={4}>
          Gross Salary: ₹{grossSalary}
        </Text>
      )}
    </Box>
  );
};

export default SalaryCalculator;
