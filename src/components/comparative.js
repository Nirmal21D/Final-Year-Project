"use client";
import React, { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Text,
  Checkbox,
  SimpleGrid,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Input,
} from "@chakra-ui/react";

const PlansComparison = () => {
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comparisonResult, setComparisonResult] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState(""); // State for the input amount
  const cancelRef = useRef();

  // Handle changes in plan selection
  const handleCheckboxChange = (header) => {
    setSelectedPlans((prev) =>
      prev.includes(header)
        ? prev.filter((plan) => plan !== header) // Remove if already selected
        : [...prev, header] // Add if not selected
    );
  };

  // Handle the "Compare" button click
  const handleCompare = () => {
    if (selectedPlans.length === 2 && investmentAmount > 0) {
      const selectedPlanDetails = plans.filter((plan) =>
        selectedPlans.includes(plan.header)
      );
      const calculatedROI = selectedPlanDetails.map((plan) => ({
        ...plan,
        roi: ((investmentAmount * plan.interestRate) / 100).toFixed(2),
      }));

      const betterPlan =
        parseFloat(calculatedROI[0].roi) > parseFloat(calculatedROI[1].roi)
          ? calculatedROI[0]
          : calculatedROI[1];

      setComparisonResult(
        `The better plan is ${betterPlan.header} with an interest rate of ${betterPlan.interestRate}% and an ROI of ₹${betterPlan.roi}.`
      );
    } else {
      setComparisonResult(
        investmentAmount > 0
          ? "Please select exactly two plans for comparison."
          : "Please enter a valid investment amount."
      );
    }
    setIsDialogOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const plans = [
    { header: "Plan A", summary: "This is Plan A summary.", interestRate: 4.5 },
    { header: "Plan B", summary: "This is Plan B summary.", interestRate: 5.0 },
    { header: "Plan C", summary: "This is Plan C summary.", interestRate: 3.8 },
    { header: "Plan D", summary: "This is Plan D summary.", interestRate: 4.0 },
  ];

  const PlanCard = ({ header, summary, interestRate }) => (
    <Card
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={300}
      bg="rgba(10, 14, 35, 0.49)"
      color="#ebeff4"
    >
      <CardHeader>
        <Heading size="md" noOfLines={2} wordBreak="break-word">
          {header}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text noOfLines={3} wordBreak="break-word">
          {summary}
        </Text>
        <Text mt={2} fontWeight="bold">
          Interest Rate: {interestRate}%
        </Text>
      </CardBody>
      <CardFooter display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Checkbox
          isChecked={selectedPlans.includes(header)}
          onChange={() => handleCheckboxChange(header)}
          colorScheme="teal"
        >
          Select for Comparing
        </Checkbox>
      </CardFooter>
    </Card>
  );

  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            header={plan.header}
            summary={plan.summary}
            interestRate={plan.interestRate}
          />
        ))}
      </SimpleGrid>
      <Box mt={4}>
        <Text mb={2} fontWeight="bold">
          Enter Investment Amount (₹):
        </Text>
        <Input
          type="number"
          placeholder="Enter amount"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          bg="white"
        />
      </Box>
      {selectedPlans.length === 2 && investmentAmount > 0 && (
        <Box
          position="fixed"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
        >
          <Button bg="teal" color="white" onClick={handleCompare}>
            Compare Selected Plans
          </Button>
        </Box>
      )}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            position="fixed"
            bottom="10px"
            right="10px"
            width="300px"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Compare Plans
            </AlertDialogHeader>
            <AlertDialogBody>{comparisonResult}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default PlansComparison;