"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Text,
  Checkbox,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Plancards = ({
  header,
  summary,
  interestRate,
  investmentCategory,
  investmentSubCategory,
  maxAmount,
  minAmount,
  tenure,
  planId,
  onCheckboxChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (onCheckboxChange) {
      onCheckboxChange(header, checked); // Notify parent with header and status
    }
  };

  const handleViewDetails = () => {
    router.push(`/plan1/${planId}`);
  };

  return (
    <Card
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      width="400px"
      height="500px"
      bg="rgba(10, 14, 35, 0.7)"
      color="#ebeff4"
      boxShadow="lg"
      borderRadius="md"
      p={4}
    >
      <CardHeader>
        <Heading size="lg" noOfLines={2} wordBreak="break-word">
          {header}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text noOfLines={4} wordBreak="break-word" mb={2}>
          {summary}
        </Text>
        <Text fontSize="sm" color="gray.300">
          Interest Rate: {interestRate}%
        </Text>
        <Text fontSize="sm" color="gray.300">
          Category: {investmentCategory}
        </Text>
        <Text fontSize="sm" color="gray.300">
          Subcategory: {investmentSubCategory}
        </Text>
        <Text fontSize="sm" color="gray.300">
          Max Amount: ₹{maxAmount}
        </Text>
        <Text fontSize="sm" color="gray.300">
          Min Amount: ₹{minAmount}
        </Text>
        <Text fontSize="sm" color="gray.300">
          Tenure: {tenure} months
        </Text>
      </CardBody>
      <CardFooter>
        <Stack spacing={3} align="center">
          <Button bg="#ebeff4" color="#0f1535" onClick={handleViewDetails} _hover={{ bg: "#d1d9e6" }}>
            View Details
          </Button>
          <Checkbox
            isChecked={isChecked}
            onChange={handleCheckboxChange}
            colorScheme="teal"
          >
            Select for Comparison
          </Checkbox>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default Plancards;