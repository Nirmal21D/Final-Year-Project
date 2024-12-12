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

const Plancards = ({ header, summary, onClick }) => {
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
          <Heading size="md" noOfLines={2} wordBreak="break-word" >{header}</Heading>
        </CardHeader>
        <CardBody>
          <Text noOfLines={3} wordBreak="break-word">{summary}</Text>
        </CardBody>
        <CardFooter>
          <Button bg="#ebeff4" color="#0f1535" onClick={onClick}>
            View here
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Plancards;
