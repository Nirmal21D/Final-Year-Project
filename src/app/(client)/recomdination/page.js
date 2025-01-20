"use client"; // Mark this file as a Client Component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Input,
} from "@chakra-ui/react"; // Import Chakra UI components

const RecommendationPage = () => {
  const router = useRouter(); // useRouter for navigation
  const [selectedPlan, setSelectedPlan] = useState(null); // State for selected plan
  const [salary, setSalary] = useState(""); // State to hold the salary input
  const [roi, setRoi] = useState(null); // State to hold the calculated ROI
  const [cagr, setCagr] = useState(null); // State to hold the calculated CAGR
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility

  // Simulate fetching the selected plan from router query
  useEffect(() => {
    const fetchSelectedPlan = async () => {
      // This simulates retrieving the selected plan via router query or external API
      const planFromQuery = {
        planName: "High-Yield Savings Plan",
        interestRate: 5.5, // Annual interest rate in percentage
        tenure: 24, // Tenure in months
      };
      setSelectedPlan(planFromQuery);
      setIsOpen(true); // Open the modal for the selected plan
    };

    fetchSelectedPlan();
  }, []);

  const handleCalculate = () => {
    if (selectedPlan) {
      const investmentAmount = parseFloat(salary); // Use salary as investment amount
      const returnAmount =
        investmentAmount +
        (investmentAmount * selectedPlan.interestRate * selectedPlan.tenure) /
          1200; // Calculate return amount
      setRoi(calculateROI(investmentAmount, returnAmount)); // Calculate ROI
      setCagr(
        calculateCAGR(investmentAmount, returnAmount, selectedPlan.tenure / 12)
      ); // Calculate CAGR
    }
  };

  const calculateROI = (investmentAmount, returnAmount) => {
    return ((returnAmount - investmentAmount) / investmentAmount) * 100; // ROI formula
  };

  const calculateCAGR = (initialValue, finalValue, years) => {
    return ((finalValue / initialValue) ** (1 / years) - 1) * 100; // CAGR formula
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        Recommendation Page
      </Text>
      <Input
        placeholder="Enter your salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        type="number"
        mb={4}
      />
      <Button onClick={handleCalculate} colorScheme="blue" mb={4}>
        Calculate ROI and CAGR
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recommended Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlan ? (
              <>
                <Text>
                  <strong>Plan Name:</strong> {selectedPlan.planName}
                </Text>
                <Text>
                  <strong>Interest Rate:</strong> {selectedPlan.interestRate}%
                </Text>
                <Text>
                  <strong>Tenure:</strong> {selectedPlan.tenure} months
                </Text>
                <Text>
                  <strong>Investment Amount:</strong> ${salary}
                </Text>
                {roi !== null && (
                  <Text mt={4}>
                    <strong>ROI:</strong> {roi.toFixed(2)}%
                  </Text>
                )}
                {cagr !== null && (
                  <Text>
                    <strong>CAGR:</strong> {cagr.toFixed(2)}%
                  </Text>
                )}
              </>
            ) : (
              <Text>No plan available.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RecommendationPage;
