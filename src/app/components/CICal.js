"use client";
import React, { useState } from "react";
import {
  Box,
  Text,
  Button,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Input,
  Flex,
} from "@chakra-ui/react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(1);
  const [compound, setCompound] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const calculateCompound = () => {
    const amount = principal * Math.pow(1 + rate / 100, time);
    setCompound((amount - principal).toFixed(2));

    const totalAmount = amount.toFixed(2);
    setTotalAmount(amount.toFixed(2));
  };

  const renderSliderWithTextbox = (
    label,
    value,
    setValue,
    min,
    max,
    step,
    unit = ""
  ) => {
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

        {renderSliderWithTextbox(
          "Principal Amount (₹)",
          principal,
          setPrincipal,
          0,
          1000000,
          1000,
          "₹"
        )}
        {renderSliderWithTextbox(
          "Rate of Interest (%)",
          rate,
          setRate,
          0,
          50,
          0.1,
          "%"
        )}
        {renderSliderWithTextbox("Time (years)", time, setTime, 0, 50, 1)}

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
          <Text fontSize="lg" color="white" mt={4}>
            Compound Interest: ₹{compound}
            <br />
            Total Amount: ₹{totalAmount}
          </Text>
        )}
      </Box>
    </>
  );
};

export default CompoundInterestCalculator;
