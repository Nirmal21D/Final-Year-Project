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

const SIPCalculator = () => {
  const [installment, setInstallment] = useState(1000); // Monthly SIP amount
  const [rate, setRate] = useState(5); // Annual interest rate
  const [months, setMonths] = useState(12); // Investment duration in months
  const [sipValue, setSipValue] = useState(null);

  const calculateSIP = () => {
    const monthlyRate = rate / 100 / 12; // Convert annual rate to monthly and decimal
    const totalAmount =
      installment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    setSipValue(totalAmount.toFixed(2));
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
        SIP Calculator
      </Text>

      {renderSliderWithTextbox(
        "Monthly Installment (₹)",
        installment,
        setInstallment,
        500,
        50000,
        100,
        "₹"
      )}
      {renderSliderWithTextbox(
        "Annual Interest Rate (%)",
        rate,
        setRate,
        1,
        20,
        0.5,
        "%"
      )}
      {renderSliderWithTextbox("Time Period (Months)", months, setMonths, 6, 360, 6)}

      <Button
        color="#ebeff4"
        bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
        onClick={calculateSIP}
        width="100%"
        mb={4}
      >
        Calculate SIP
      </Button>

      {sipValue && (
        <Text fontSize="lg" color="green.500" mt={4}>
          Future Value: ₹{sipValue}
        </Text>
      )}
    </Box>
  );
};

export default SIPCalculator;
