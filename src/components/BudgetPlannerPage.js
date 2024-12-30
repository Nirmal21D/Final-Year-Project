"use client";
import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Heading,
  Select,
  Grid,
  GridItem,
  Container,
  Card,
  CardBody,
  CardHeader,
  Stack,
} from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlannerPage = () => {
  const [salary, setSalary] = useState("");
  const [formula, setFormula] = useState("50-30-20");
  const [showResults, setShowResults] = useState(false);
  const [budgetData, setBudgetData] = useState({
    investment: 0,
    dailyNeeds: 0,
    savings: 0,
    breakdown: {
      sip: 0,
      mutualFunds: 0,
      bonds: 0,
      realEstate: 0,
      gold: 0,
      fixedDeposits: 0,
    },
  });

  const calculateBudget = () => {
    const salaryNum = Number(salary);
    let investPercentage = 0.3;
    let dailyNeedsPercentage = 0.5;
    let savingsPercentage = 0.2;

    if (formula === "60-20-20") {
      investPercentage = 0.2;
      dailyNeedsPercentage = 0.6;
    } else if (formula === "40-40-20") {
      investPercentage = 0.4;
      dailyNeedsPercentage = 0.4;
    }

    const investment = salaryNum * investPercentage;

    setBudgetData({
      investment,
      dailyNeeds: salaryNum * dailyNeedsPercentage,
      savings: salaryNum * savingsPercentage,
      breakdown: {
        sip: investment * 0.2,
        mutualFunds: investment * 0.15,
        bonds: investment * 0.15,
        realEstate: investment * 0.25,
        gold: investment * 0.15,
        fixedDeposits: investment * 0.1,
      },
    });

    setShowResults(true);
  };

  const data = {
    labels: [
      "SIP",
      "Mutual Funds",
      "Bonds",
      "Real Estate",
      "Gold",
      "Fixed Deposits",
      "Daily Needs",
      "Savings",
    ],
    datasets: [
      {
        data: [
          budgetData.breakdown.sip,
          budgetData.breakdown.mutualFunds,
          budgetData.breakdown.bonds,
          budgetData.breakdown.realEstate,
          budgetData.breakdown.gold,
          budgetData.breakdown.fixedDeposits,
          budgetData.dailyNeeds,
          budgetData.savings,
        ],
        backgroundColor: [
          "#4299E1",
          "#48BB78",
          "#ED8936",
          "#38B2AC",
          "#ECC94B",
          "#805AD5",
          "#4A5568",
          "#68D391",
        ],
        hoverBackgroundColor: [
          "#3182CE",
          "#38A169",
          "#DD6B20",
          "#2C7A7B",
          "#D69E2E",
          "#6B46C1",
          "#2D3748",
          "#48BB78",
        ],
      },
    ],
  };

  const InputForm = () => (
    <VStack spacing={4} width="100%">
      <Text fontSize="xl" color="white">
        Enter your salary:
      </Text>
      <Input
        type="number"
        placeholder="Enter your monthly salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        color="white"
      />
      <Text fontSize="xl" color="white">
        Select Budgeting Formula:
      </Text>
      <Select
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        color="white"
        sx={{
          // Style for the dropdown options
          "& option": {
            color: "black",
            background: "white",
          },
        }}
      >
        <option
          value="50-30-20"
          style={{ color: "black", background: "white" }}
        >
          50-30-20 Formula
        </option>
        <option
          value="60-20-20"
          style={{ color: "black", background: "white" }}
        >
          60-20-20 Formula
        </option>
        <option
          value="40-40-20"
          style={{ color: "black", background: "white" }}
        >
          40-40-20 Formula
        </option>
      </Select>
      <Button
        bg="#567C8D"
        color="white"
        _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#11212d" }}
        onClick={calculateBudget}
        width="100%"
      >
        Calculate Budget
      </Button>
    </VStack>
  );

  return (
    <Container maxW="7xl" py={8}>
      {!showResults ? (
        <Card maxW="md" mx="auto" bg="gray.800">
          <CardHeader>
            <Heading size="lg" textAlign="center" color="white">
              Budget Planner
            </Heading>
          </CardHeader>
          <CardBody>
            <InputForm />
          </CardBody>
        </Card>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {/* Left Column - Input Form */}
          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size="md" color="white">
                  Input Details
                </Heading>
              </CardHeader>
              <CardBody>
                <InputForm />
              </CardBody>
            </Card>
          </GridItem>

          {/* Middle Column - Pie Chart */}
          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size="md" color="white">
                  Budget Distribution
                </Heading>
              </CardHeader>
              <CardBody>
                <Box width="100%" position="relative">
                  <Pie data={data} />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Column - Breakdown */}
          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size="md" color="white">
                  Budget Breakdown
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={6}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={2} color="white">
                      Total Distribution
                    </Text>
                    <Stack spacing={2} color="white">
                      <Text>
                        Investment: ₹{budgetData.investment.toFixed(2)}
                      </Text>
                      <Text>
                        Daily Needs: ₹{budgetData.dailyNeeds.toFixed(2)}
                      </Text>
                      <Text>Savings: ₹{budgetData.savings.toFixed(2)}</Text>
                    </Stack>
                  </Box>
                  <Box color="white">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Investment Breakdown
                    </Text>
                    <Stack spacing={2}>
                      <Text>
                        SIP: ₹{budgetData.breakdown.sip.toFixed(2)} (20%)
                      </Text>
                      <Text>
                        Mutual Funds: ₹
                        {budgetData.breakdown.mutualFunds.toFixed(2)} (15%)
                      </Text>
                      <Text>
                        Bonds: ₹{budgetData.breakdown.bonds.toFixed(2)} (15%)
                      </Text>
                      <Text>
                        Real Estate: ₹
                        {budgetData.breakdown.realEstate.toFixed(2)} (25%)
                      </Text>
                      <Text>
                        Gold: ₹{budgetData.breakdown.gold.toFixed(2)} (15%)
                      </Text>
                      <Text>
                        Fixed Deposits: ₹
                        {budgetData.breakdown.fixedDeposits.toFixed(2)} (10%)
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </Container>
  );
};

export default BudgetPlannerPage;
