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
} from "@chakra-ui/react";

const InputForm = ({
  principal,
  setPrincipal,
  rate,
  setRate,
  tenure,
  setTenure,
  onCalculate,
}) => {
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
            // defaultValue={value}
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
      bg="rgba(45, 55, 72, 0.6)"
      color="white"
      borderRadius="xl"
      shadow="md"
      width="100%"
      maxWidth="400px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        EMI Calculator
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
        "Interest Rate (%)",
        rate,
        setRate,
        0,
        50,
        0.1,
        "%"
      )}
      {renderSliderWithTextbox("Tenure (months)", tenure, setTenure, 1, 360, 1)}

      <Button
        color="#ebeff4"
        bgGradient="linear(to-l, #05153f 28.26% ,  #072561 91.2%)"
        _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
        onClick={onCalculate}
        width="100%"
        mb={4}
      >
        Calculate EMI
      </Button>
    </Box>
  );
};

const EMICalculatorPage = () => {
  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(5);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(null);
  const [interest, setInterest] = useState(null);
  const [withInterestAmount, setWithInterestAmount] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const calculateEMI = () => {
    const monthlyRate = rate / 12 / 100;
    const emiAmount =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    const totalWithInterest = emiAmount * tenure;
    const interestAmount = totalWithInterest - principal;

    setInterest(interestAmount.toFixed(2));
    setEmi(emiAmount.toFixed(2));
    setWithInterestAmount(totalWithInterest.toFixed(2));
    setShowResults(true);
  };

  return (
    <Container maxW="7xl">
      {!showResults ? (
        <Card maxW="md" mx="auto" bg="transparent" boxShadow="none">
          <CardBody>
            <InputForm
              principal={principal}
              setPrincipal={setPrincipal}
              rate={rate}
              setRate={setRate}
              tenure={tenure}
              setTenure={setTenure}
              onCalculate={calculateEMI}
            />
          </CardBody>
        </Card>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={6}
        >
          <GridItem>
            <Card height="100%" width="30vw" bg="transparent" boxShadow="none">
              <CardHeader></CardHeader>
              <CardBody>
                <InputForm
                  principal={principal}
                  setPrincipal={setPrincipal}
                  rate={rate}
                  setRate={setRate}
                  tenure={tenure}
                  setTenure={setTenure}
                  onCalculate={calculateEMI}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card height="100%" bg="#567C8D">
              <CardBody>
                <Box width="auto " position="relative">
                  <Stack spacing={4}>
                    <Text fontSize="lg" color="white">
                      EMI Amount: ₹{emi}
                    </Text>
                    <Text fontSize="lg" color="white">
                      Interest: ₹{interest}
                    </Text>
                    <Text fontSize="lg" color="white">
                      Total Repayment with Interest: ₹{withInterestAmount}
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

export default EMICalculatorPage;
