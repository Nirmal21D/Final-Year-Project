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
} from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import SideNav from "/src/components/SideNav";
import SearchBox from "/src/components/SearchBar";

// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlannerPage = () => {
  const [salary, setSalary] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [dailyNeeds, setDailyNeeds] = useState(0);
  const [savings, setSavings] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const [formula, setFormula] = useState("50-30-20");

  // Subcategories for investments
  const [sip, setSip] = useState(0);
  const [mutualFunds, setMutualFunds] = useState(0);
  const [bonds, setBonds] = useState(0); // Changed from stocks to bonds
  const [realEstate, setRealEstate] = useState(0);
  const [gold, setGold] = useState(0);
  const [fixedDeposits, setFixedDeposits] = useState(0);

  const handleFormulaChange = (e) => {
    setFormula(e.target.value);
  };

  const calculateBudget = () => {
    let investPercentage = 0.3; // default 30% for investments
    let dailyNeedsPercentage = 0.5; // default 50% for daily needs
    let savingsPercentage = 0.2; // default 20% for savings

    if (formula === "60-20-20") {
      investPercentage = 0.2; // 20% for investment
      dailyNeedsPercentage = 0.6; // 60% for daily needs
      savingsPercentage = 0.2; // 20% for savings
    } else if (formula === "40-40-20") {
      investPercentage = 0.4; // 40% for investment
      dailyNeedsPercentage = 0.4; // 40% for daily needs
      savingsPercentage = 0.2; // 20% for savings
    }

    const investAmount = salary * investPercentage;
    const dailyNeedsAmount = salary * dailyNeedsPercentage;
    const savingsAmount = salary * savingsPercentage;

    setInvestment(investAmount);
    setDailyNeeds(dailyNeedsAmount);
    setSavings(savingsAmount);

    // Calculate subcategories of investment
    setSip(investAmount * 0.2); // 20% of investment in SIP
    setMutualFunds(investAmount * 0.15); // 15% of investment in mutual funds
    setBonds(investAmount * 0.15); // 15% of investment in bonds
    setRealEstate(investAmount * 0.25); // 25% of investment in real estate
    setGold(investAmount * 0.15); // 15% of investment in gold
    setFixedDeposits(investAmount * 0.1); // 10% of investment in fixed deposits

    setShowChart(true);
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
        label: "Budget Distribution",
        data: [
          sip,
          mutualFunds,
          bonds,
          realEstate,
          gold,
          fixedDeposits,
          dailyNeeds,
          savings,
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
        ], // Updated color palette
        hoverBackgroundColor: [
          "#3182CE",
          "#38A169",
          "#DD6B20",
          "#2C7A7B",
          "#D69E2E",
          "#6B46C1",
          "#2D3748",
          "#48BB78",
        ], // Darker tones for hover
      },
    ],
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={10}
        justifyItems="center"
        p={5}
        backgroundImage="url(/images/body-background.png)" // Set the image path
        backgroundPosition="center" // Adjust position of the background image
        backgroundRepeat="no-repeat" // Prevent the image from repeating
        backgroundSize="cover" // Ensure the image covers the entire background
        height="100vh" // Set height to full viewport
        width="100%" // Set width to 100%
        overflowY="auto" // Enable vertical scrolling
        css={{
          /* Styling for custom scrollbars */
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#48BB78", // Thumb color (green)
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#2F855A", // Darker green on hover
          },
          "&::-webkit-scrollbar-track": {
            background: "#1A202C", // Scrollbar track color (dark grey)
          },
        }}
      >
        {/* Sidebar and SearchBox */}
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
          <SearchBox />
        </Box>

        {/* Budget Planner Section */}
        <VStack spacing={8} p={10} alignItems="center">
          <Heading color="white">Budget Planner</Heading>

          <Box width="100%" maxWidth="400px">
            <Text fontSize="xl" mb={4} color="white">
              Enter your salary:
            </Text>
            <Input
              type="number"
              placeholder="Enter your monthly salary"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              mb={4}
              color="white"
              _placeholder={{ color: "white" }}
            />

            <Text fontSize="xl" mb={4} color="white">
              Select Budgeting Formula:
            </Text>
            <Select
              mb={4}
              value={formula}
              onChange={handleFormulaChange}
              color="white" 
              backgroundColor="transparent" 
              borderColor="white" 
              _hover={{ borderColor: "blue.300" }} 
              _focus={{
                borderColor: "white",
              }} 
              sx={{
                option: {
                  backgroundColor: "transparent", 
                  color: "black", 
                  _hover: { backgroundColor: "#EDF2F7" }, 
                },
              }}
            >
              <option
                value="50-30-20"
                style={{ backgroundColor: "white", color: "black" }}
              >
                50-30-20 Formula
              </option>
              <option
                value="60-20-20"
                style={{ backgroundColor: "white", color: "black" }}
              >
                60-20-20 Formula
              </option>
              <option
                value="40-40-20"
                style={{ backgroundColor: "white", color: "black" }}
              >
                40-40-20 Formula
              </option>
            </Select>

            <Button colorScheme="blue" onClick={calculateBudget}>
              Calculate Budget
            </Button>
          </Box>

          {showChart && (
            <>
              <Box width="100%" maxWidth="400px">
                <Text fontSize="lg" mt={4} color="white">
                  Your Budget Breakdown
                </Text>
                <Pie data={data} />
              </Box>

              {/* Display budget distribution */}
              <Box width="100%" maxWidth="400px" mt={6}>
                <Text fontSize="lg" color="white">
                  Total Investment: ₹{investment.toFixed(2)}
                </Text>
                <Text fontSize="lg" color="white">
                  Daily Needs: ₹{dailyNeeds.toFixed(2)}
                </Text>
                <Text fontSize="lg" color="white">
                  Savings: ₹{savings.toFixed(2)}
                </Text>
              </Box>

              {/* Display subcategories of investment */}
              <Box width="100%" maxWidth="400px" mt={6}>
                <Text fontSize="lg" color="white" mt={4}>
                  Investment Breakdown:
                </Text>
                <Text fontSize="md" color="white">
                  SIP: ₹{sip.toFixed(2)} (20% of Investment)
                </Text>
                <Text fontSize="md" color="white">
                  Mutual Funds: ₹{mutualFunds.toFixed(2)} (15% of Investment)
                </Text>
                <Text fontSize="md" color="white">
                  Bonds: ₹{bonds.toFixed(2)} (15% of Investment)
                </Text>
                <Text fontSize="md" color="white">
                  Real Estate: ₹{realEstate.toFixed(2)} (25% of Investment)
                </Text>
                <Text fontSize="md" color="white">
                  Gold: ₹{gold.toFixed(2)} (15% of Investment)
                </Text>
                <Text fontSize="md" color="white">
                  Fixed Deposits: ₹{fixedDeposits.toFixed(2)} (10% of
                  Investment)
                </Text>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default BudgetPlannerPage;
