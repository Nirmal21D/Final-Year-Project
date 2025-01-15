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
  Container,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Stack,
  Checkbox,
  VStack,
} from "@chakra-ui/react";

const InputForm = ({ income, setIncome, tax, setTax, onCalculate, deductions, setDeductions }) => {
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

  const renderDeductionOption = (label, key) => (
    <Box key={key} mb={4}>
      <Checkbox
        isChecked={deductions[key]?.enabled}
        onChange={() =>
          setDeductions((prev) => ({
            ...prev,
            [key]: { ...prev[key], enabled: !prev[key].enabled },
          }))
        }
      >
        {label}
      </Checkbox>
      {deductions[key]?.enabled && (
        <Input
          mt={2}
          placeholder="Enter amount"
          value={deductions[key]?.amount || ""}
          onChange={(e) =>
            setDeductions((prev) => ({
              ...prev,
              [key]: { ...prev[key], amount: parseFloat(e.target.value) || 0 },
            }))
          }
          type="number"
        />
      )}
    </Box>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="rgba(45, 55, 72, 0.6)"
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

      <VStack align="start" spacing={4} mb={4}>
        <Text>Select Deduction Options:</Text>
        {renderDeductionOption("Section 80C (Investments) - Up to ₹1,50,000", "section80C")}
        {renderDeductionOption("Section 80D (Medical Insurance) - Up to ₹25,000", "section80D")}
        {renderDeductionOption("Section 80E (Education Loan Interest) - Up to ₹50,000", "section80E")}
        {renderDeductionOption("Section 80G (Donations) - No limit", "section80G")}
        {renderDeductionOption("Section 24(b) (Home Loan Interest) - Up to ₹2,00,000", "section24B")}
        {renderDeductionOption("Section 10(13A) (HRA) - Rent Deduction", "section10HRA")}
        {renderDeductionOption("Section 80TTA (Interest on Savings Account) - Up to ₹10,000", "section80TTA")}
      </VStack>

      <Button
        color="#ebeff4"
        bgGradient="linear(to-l, #05153f 28.26% ,  #072561 91.2%)"
        _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
        onClick={onCalculate}
        width="100%"
        mb={4}
      >
        Calculate Tax
      </Button>
    </Box>
  );
};

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState(250000);
  const [tax, setTax] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [deductions, setDeductions] = useState({
    section80C: { enabled: false, amount: 0 },
    section80D: { enabled: false, amount: 0 },
    section80E: { enabled: false, amount: 0 },
    section80G: { enabled: false, amount: 0 },
    section24B: { enabled: false, amount: 0 },
    section10HRA: { enabled: false, amount: 0 },
    section80TTA: { enabled: false, amount: 0 },
  });

  const calculateTax = () => {
    let totalDeductions = Object.values(deductions)
      .filter((item) => item.enabled)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    const taxableIncome = income - totalDeductions;
    let taxAmount = 0;

    if (taxableIncome <= 250000) {
      taxAmount = 0;
    } else if (taxableIncome <= 500000) {
      taxAmount = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      taxAmount = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      taxAmount = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    setTax(taxAmount.toFixed(2));
    setShowResults(true);
  };

  return (
    <Container maxW="7xl">
      {!showResults ? (
        <Card maxW="md" mx="auto" bg="transparent" boxShadow="none">
          <CardBody>
            <InputForm
              income={income}
              setIncome={setIncome}
              tax={tax}
              setTax={setTax}
              onCalculate={calculateTax}
              deductions={deductions}
              setDeductions={setDeductions}
            />
          </CardBody>
        </Card>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <GridItem>
            <Card height="100%" width="30vw" bg="transparent" boxShadow="none">
              <CardHeader></CardHeader>
              <CardBody>
                <InputForm
                  income={income}
                  setIncome={setIncome}
                  tax={tax}
                  setTax={setTax}
                  onCalculate={calculateTax}
                  deductions={deductions}
                  setDeductions={setDeductions}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card height="100%" bg="#567C8D">
              <CardBody>
                <Box width="100%" position="relative">
                  <Stack spacing={4}>
                    <Text fontSize="lg" color="white">
                      Income: ₹{income}
                    </Text>
                    <Text fontSize="lg" color="white">
                      Tax: ₹{tax}
                    </Text>
                  </Stack>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </Container>
  );
};

export default IncomeTaxCalculator;
