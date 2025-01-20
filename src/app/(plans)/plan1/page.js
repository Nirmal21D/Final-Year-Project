"use client";

import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "@/firebase";

import Headers from "@/components/Headers";
import Plancards from "@/components/Plancards";

const Page = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [comparePlans, setComparePlans] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);

  const router = useRouter();

  // Helper function to calculate CAGR
  const calculateCAGR = (interestRate, tenureMonths) => {
    const years = tenureMonths / 12;
    const principal = 1; // Normalized principal
    const finalValue = principal * (1 + interestRate * years); // Approximate final value using simple interest
    return ((finalValue / principal) ** (1 / years) - 1) * 100; // Convert to percentage
  };

  // Helper function to calculate Risk
  const calculateRisk = (interestRate, tenure, minimumInvestment) => {
    // Risk calculation logic
    const riskFromInterest = interestRate > 10 ? 3 : interestRate > 5 ? 2 : 1; // Higher interest rate, higher risk
    const riskFromTenure = tenure > 60 ? 3 : tenure > 36 ? 2 : 1; // Longer tenure, higher risk
    const riskFromInvestment = minimumInvestment > 100000 ? 3 : minimumInvestment > 50000 ? 2 : 1; // Higher investment, higher risk

    // Combine the risks into a single score (higher score means higher risk)
    const totalRisk = riskFromInterest + riskFromTenure + riskFromInvestment;

    return totalRisk;
  };

  // Compare plans logic with ROI, CAGR, and other factors
  const handleCompare = () => {
    if (comparePlans.length >= 2) {
      const compareAllPlans = comparePlans.map((plan) => {
        const calculateScore = (plan) => {
          const roiWeight = 0.5; // ROI has 50% weight
          const cagrWeight = 0.4; // CAGR has 40% weight
          const tenureWeight = 0.1; // Tenure has 10% weight (shorter tenure is better)

          const roiScore = plan.interestRate * roiWeight;
          const cagrScore = plan.cagr * cagrWeight;
          const tenureScore = (1 / plan.tenure) * tenureWeight;

          return roiScore + cagrScore + tenureScore;
        };

        return {
          plan,
          score: calculateScore(plan),
        };
      });

      compareAllPlans.sort((a, b) => b.score - a.score);

      // Generate reasoning for the best plan
      const generateReasoning = (bestPlan, otherPlans) => {
        const reasoning = [];
        otherPlans.forEach((otherPlan) => {
          if (bestPlan.interestRate > otherPlan.interestRate) {
            reasoning.push(`${bestPlan.planName} has a higher interest rate than ${otherPlan.planName}.`);
          }
          if (bestPlan.cagr > otherPlan.cagr) {
            reasoning.push(`${bestPlan.planName} has a higher CAGR than ${otherPlan.planName}.`);
          }
          if (bestPlan.tenure < otherPlan.tenure) {
            reasoning.push(`${bestPlan.planName} has a shorter tenure than ${otherPlan.planName}.`);
          }
          if (bestPlan.riskLevel < otherPlan.riskLevel) {
            reasoning.push(`${bestPlan.planName} has a lower risk level than ${otherPlan.planName}.`);
          }
          if (bestPlan.minimumInvestment < otherPlan.minimumInvestment) {
            reasoning.push(`${bestPlan.planName} has a lower minimum investment requirement than ${otherPlan.planName}.`);
          }
        });

        return reasoning;
      };

      const bestPlan = compareAllPlans[0].plan;
      const otherPlans = compareAllPlans.slice(1).map((item) => item.plan);

      const reasoning = generateReasoning(bestPlan, otherPlans);

      setComparisonResults({
        bestPlan,
        otherPlans,
        reasoning,
      });
    }
  };

  // Select plans for comparison
  const handleSelectForCompare = (plan) => {
    if (comparePlans.includes(plan)) {
      setComparePlans((prev) => prev.filter((p) => p !== plan));
    } else {
      setComparePlans((prev) => [...prev, plan]);
    }
  };

  // Auth listener to protect the page
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch investment plans with calculated CAGR and Risk
  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        const plansQuery = query(collection(db, "investmentplans"));
        const querySnapshot = await getDocs(plansQuery);

        const fetchedPlans = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Calculate CAGR if not already provided
          const cagr = data.cagr ?? calculateCAGR(data.interestRate / 100, data.tenure);

          // Calculate risk using the new helper function
          const riskLevel = calculateRisk(data.interestRate, data.tenure, data.minimumInvestment);

          return {
            id: doc.id,
            ...data,
            cagr, // Add calculated CAGR
            riskLevel, // Add calculated risk level
          };
        });

        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    if (user) {
      fetchInvestmentPlans();
    }
  }, [user]);

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box
      id="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bg="gray.50"
      minHeight="100vh"
      p={5}
    >
      <Headers />
      <Flex wrap="wrap" justifyContent="center" mt={5}>
        {plans.map((plan) => (
          <Box key={plan.id} m={2}>
            <Plancards
              header={plan.planName}
              summary={plan.description}
              investmentCategory={plan.investmentCategory}
              investmentSubCategory={plan.investmentSubCategory}
            />
            <Button
              colorScheme={comparePlans.includes(plan) ? "red" : "blue"}
              mt={2}
              onClick={() => handleSelectForCompare(plan)}
            >
              {comparePlans.includes(plan) ? "Remove" : "Compare"}
            </Button>
          </Box>
        ))}
      </Flex>

      {comparePlans.length >= 2 && (
        <Button colorScheme="green" mt={4} onClick={handleCompare}>
          Compare Plans
        </Button>
      )}

      {comparisonResults.bestPlan && (
        <Box
          mt={5}
          p={5}
          bg="white"
          borderRadius="md"
          shadow="md"
          width="80%"
          maxW="1200px"
        >
          <Text fontSize="lg" fontWeight="bold" color="blue.500">
            Comparison of Selected Plans
          </Text>

          <Table variant="simple" mt={4}>
            <Thead>
              <Tr>
                <Th>Plan Detail</Th>
                {comparisonResults.otherPlans.map((plan) => (
                  <Th key={plan.id}>{plan.planName}</Th>
                ))}
                <Th>{comparisonResults.bestPlan.planName}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Interest Rate</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.interestRate}%</Td>
                ))}
                <Td>{comparisonResults.bestPlan.interestRate}%</Td>
              </Tr>
              <Tr>
                <Td>CAGR</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.cagr.toFixed(2)}%</Td>
                ))}
                <Td>{comparisonResults.bestPlan.cagr.toFixed(2)}%</Td>
              </Tr>
              <Tr>
                <Td>Tenure (Months)</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.tenure}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.tenure}</Td>
              </Tr>
              <Tr>
                <Td>Category</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.investmentCategory}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.investmentCategory}</Td>
              </Tr>
              <Tr>
                <Td>Subcategory</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.investmentSubCategory}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.investmentSubCategory}</Td>
              </Tr>
              <Tr>
                <Td>Risk Level</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.riskLevel}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.riskLevel}</Td>
              </Tr>
              <Tr>
                <Td>Minimum Investment</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.minimumInvestment}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.minimumInvestment}</Td>
              </Tr>
              <Tr>
                <Td>Description</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.description}</Td>
                ))}
                <Td>{comparisonResults.bestPlan.description}</Td>
              </Tr>
            </Tbody>
          </Table>

          <Box mt={5} p={4} borderRadius="md" bg="green.100">
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              Why This Plan is Better
            </Text>
            <Text mt={2}>
              {comparisonResults.bestPlan.planName} outperforms the other selected plans in the following areas:
            </Text>
            <ul>
              {comparisonResults.reasoning.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Page;
