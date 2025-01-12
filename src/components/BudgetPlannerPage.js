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
  useBreakpointValue,
} from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlannerPage = () => {
  // States
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

  // Breakpoint values
  const containerWidth = useBreakpointValue({
    base: "100%",
    lg: "7xl",
    "2xl": "8xl",
  });

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(3, 1fr)",
    "2xl": "repeat(3, minmax(0, 1fr))",
  });

  const chartSize = useBreakpointValue({
    base: 300,
    lg: 400,
    "2xl": 500,
  });

  const fontSize = useBreakpointValue({
    base: "md",
    lg: "lg",
    "2xl": "xl",
  });

  const spacing = useBreakpointValue({ base: 4, "2xl": 6 });
  const headerSize = useBreakpointValue({ base: "md", "2xl": "lg" });
  const inputHeight = useBreakpointValue({ base: "40px", "2xl": "50px" });
  const containerPadding = useBreakpointValue({ base: 8, "2xl": 12 });
  const stackSpacing = useBreakpointValue({ base: 6, "2xl": 8 });

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

  const InputForm = () => (
    <VStack spacing={spacing} width="100%">
      <Text fontSize={fontSize} color="white">
        Enter your salary:
      </Text>
      <Input
        type="text"
        placeholder="Enter your monthly salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        color="white"
        fontSize={fontSize}
        height={inputHeight}
      />
      <Text fontSize={fontSize} color="white">
        Select Budgeting Formula:
      </Text>
      <Select
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        color="white"
        fontSize={fontSize}
        height={inputHeight}
        sx={{
          "& option": {
            color: "black",
            background: "white",
          },
        }}
      >
        <option value="50-30-20">50-30-20 Formula</option>
        <option value="60-20-20">60-20-20 Formula</option>
        <option value="40-40-20">40-40-20 Formula</option>
      </Select>
      <Button
        bg="#567C8D"
        color="white"
        _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#11212d" }}
        onClick={calculateBudget}
        width="100%"
        height={inputHeight}
        fontSize={fontSize}
      >
        Calculate Budget
      </Button>
    </VStack>
  );

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

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white", // Set the legend text color to white
        },
      },
    },
  };

  return (
    <Container maxW={containerWidth} py={containerPadding}>
      {!showResults ? (
        <Card maxW="md" mx="auto" bg="gray.800">
          <CardHeader>
            <Heading size={headerSize} textAlign="center" color="white">
              Budget Planner
            </Heading>
          </CardHeader>
          <CardBody>
            <InputForm />
          </CardBody>
        </Card>
      ) : (
        <Grid templateColumns={gridTemplateColumns} gap={stackSpacing}>
          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size={headerSize} color="white">
                  Input Details
                </Heading>
              </CardHeader>
              <CardBody>
                <InputForm />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size={headerSize} color="white">
                  Budget Distribution
                </Heading>
              </CardHeader>
              <CardBody>
                <Box width="100%" height={chartSize} position="relative">
                  <Pie data={data} options={options} />
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card height="100%" bg="gray.800">
              <CardHeader>
                <Heading size={headerSize} color="white">
                  Budget Breakdown
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={stackSpacing}>
                  <Box>
                    <Text
                      fontSize={fontSize}
                      fontWeight="bold"
                      mb={2}
                      color="white"
                    >
                      Total Distribution
                    </Text>
                    <Stack spacing={2} color="white">
                      <Text fontSize={fontSize}>
                        Investment: ₹{budgetData.investment.toFixed(2)}
                      </Text>
                      <Text fontSize={fontSize}>
                        Daily Needs: ₹{budgetData.dailyNeeds.toFixed(2)}
                      </Text>
                      <Text fontSize={fontSize}>
                        Savings: ₹{budgetData.savings.toFixed(2)}
                      </Text>
                    </Stack>
                  </Box>
                  <Box color="white">
                    <Text fontSize={fontSize} fontWeight="bold" mb={2}>
                      Investment Breakdown
                    </Text>
                    <Stack spacing={2}>
                      {Object.entries(budgetData.breakdown).map(
                        ([key, value]) => (
                          <Text key={key} fontSize={fontSize}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}: ₹
                            {value.toFixed(2)}(
                            {key === "realEstate"
                              ? "25"
                              : key === "sip"
                              ? "20"
                              : key === "fixedDeposits"
                              ? "10"
                              : "15"}
                            %)
                          </Text>
                        )
                      )}
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
