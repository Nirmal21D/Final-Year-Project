"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Heading,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";

const Plancards = ({ header, summary }) => {
  return (
    <>
      <Card
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={300}
        bg="rgba(10, 14, 35, 0.49)"
        color="#ebeff4"
      >
        <CardHeader>
          <Heading size="md">{header}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{summary}</Text>
        </CardBody>
        <CardFooter>
          <Button bg="#ebeff4" color="#0f1535">
            View here
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Plancards;
