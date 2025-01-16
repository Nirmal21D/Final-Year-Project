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
} from "@chakra-ui/react";

const Plancards = ({ header, summary, onClick, onCheckboxChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (onCheckboxChange) {
      onCheckboxChange(header, checked); // Notify parent with header and status
    }
  };

  return (
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
      </CardBody>
      <CardFooter display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button bg="#ebeff4" color="#0f1535" onClick={onClick}>
          View here
        </Button>
        <Checkbox
          isChecked={isChecked}
          onChange={handleCheckboxChange}
          colorScheme="teal"
        >
          Select for Comparing
        </Checkbox>
      </CardFooter>
    </Card>
  );
};

export default Plancards;