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

  return (
    <>
      <Container maxW="7xl" py={12}>
        {!showResults ? (
          <Card maxW="md" mx="auto" bg="gray.800">
            <CardHeader>
              <Heading size="lg" textAlign="center" color="white">
                Budget Planner
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <Text fontSize="lg" color="white">
                  Enter your salary:
                </Text>
                <Input
                  type="text"
                  placeholder="Enter your monthly salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  color="white"
                />
                <Text fontSize="lg" color="white">
                  Select Budgeting Formula:
                </Text>
                <Select
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  color="white"
                >
                  <option value="50-30-20">50-30-20 Formula</option>
                  <option value="60-20-20">60-20-20 Formula</option>
                  <option value="40-40-20">40-40-20 Formula</option>
                </Select>
                <Button colorScheme="blue" onClick={calculateBudget} width="100%">
                  Calculate Budget
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <Card bg="gray.800">
                <CardHeader>
                  <Heading size="lg" color="white">
                    Input Details
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text fontSize="lg" color="white">
                    Salary: ₹{salary}
                  </Text>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card bg="gray.800">
                <CardHeader>
                  <Heading size="lg" color="white">
                    Budget Distribution
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Box width="100%" height={300}>
                    <Pie
                      data={{
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
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            labels: { color: "white" },
                          },
                        },
                      }}
                    />
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        )}
      </Container>
      
    </>
  );
};

export default BudgetPlannerPage;
