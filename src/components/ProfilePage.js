"use client";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
 
  const [username, setUsername] = useState("");
  const [fundsHistory, setFundsHistory] = useState(["funds"]);
  const toast = useToast();

  const saveProfile = () => {
    toast({
      title: "Profile Updated.",
      description: "Your profile information has been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const renderHorizontalInput = (label, value, onChange, type = "text") => (
    <Flex mb={4} width="100%" alignItems="center">
      <Text width="40%" fontWeight="bold" mr={4}>
        {label}
      </Text>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="transparent"
        color="white"
        size="lg"
        flex="1"
      />
    </Flex>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="rgba(117, 122, 140,0.299)"
      color="white"
      borderRadius="xl"
      shadow="md"
      width="100%"
      maxWidth="600px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Profile Page
      </Text>

      {renderHorizontalInput("Email", email, setEmail, "email")}
      {renderHorizontalInput("Password", passwd, setPasswd, "password")}
      {renderHorizontalInput("Phone", phone, setPhone, "number")}
      {renderHorizontalInput("Salary", salary, setSalary)}
      
      {renderHorizontalInput("Username", username, setUsername)}

      <Box mb={4} width="100%">
        <Text fontSize="lg" mb={2}>
          History:
        </Text>
        <Box
          bg="transparent"
          borderRadius="md"
          p={4}
          color="gray.800"
          maxHeight="100px"
          overflowY="auto"
        >
          {fundsHistory.map((fund, index) => (
            <Text key={index}>{fund}</Text>
          ))}
        </Box>
      </Box>

      <Button
        color="#ebeff4"
        bgGradient="linear(to-r, #0075ff ,  #9f7aea)"
        onClick={saveProfile}
        width="100%"
        mb={4}
      >
        Save Profile
      </Button>
    </Box>
  );
};

export default ProfilePage;
