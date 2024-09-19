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

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState(250000);
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
            <SliderMark value={250000} mt="1" ml="-2.5" fontSize="sm">
            250000
            </SliderMark>
            <SliderMark value={500000} mt="1" ml="-2.5" fontSize="sm">
              500000
            </SliderMark>
            <SliderMark value={750000} mt="1" ml="-2.5" fontSize="sm">
              750000
            </SliderMark>
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
        Income Tax Calculator
      </Text>

      {renderSliderWithTextbox(
        "Income (₹)",
        income,
        setIncome,
        100000,
        1000000,
        50000,
        "₹"
      )}

      <Button
        color="#ebeff4"
        bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
        onClick={calculateTax}
        width="100%"
        mb={4}
      >
        Calculate Tax
      </Button>

      {tax !== null && (
        <Text fontSize="lg" color="green.500" mt={4}>
          Tax: ₹{tax}
        </Text>
      )}
    </Box>
  );
};

export default IncomeTaxCalculator;
