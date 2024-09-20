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

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(1);
  const [si, setSi] = useState(null);

  const calculateSI = () => {
    const siAmount = (principal * rate * time) / 100;
    setSi(siAmount.toFixed(2));
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
        Simple Interest Calculator
      </Text>

      {renderSliderWithTextbox(
        "Principal Amount (₹)",
        principal,
        setPrincipal,
        1000,
        1000000,
        1000,
        "₹"
      )}
      {renderSliderWithTextbox(
        "Interest Rate (%)",
        rate,
        setRate,
        0,
        15,
        0.1,
        "%"
      )}
      {renderSliderWithTextbox("Time (years)", time, setTime, 1, 30, 1)}

      <Button
        color="#ebeff4"
        bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
        onClick={calculateSI}
        width="100%"
        mb={4}
      >
        Calculate SI
      </Button>

      {si && (
        <Text fontSize="lg" color="green.500" mt={4}>
          Simple Interest: ₹{si}
        </Text>
      )}
    </Box>
  );
};

export default SimpleInterestCalculator;
