"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import BankSidenav from "@/app/bankComponents/BankSidenav";
import Navbar from "@/app/bankComponents/Navbar";

const page = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    planId: "",
    planType: "",
    planName: "",
    interestRate: "",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanType: "",
    loanName: "",
  });
  const router = useRouter();
  const toast = useToast();

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return <Box>Loading...</Box>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        planName,
        interestRate,
        maxAmount,
        minAmount,
        tenure,
        description,
        loanType,
        loanName,
      } = formData;
      const planId = uuidv4();
      if (formData.planType === "loan") {
        const planDocRef = doc(collection(db, "loanplans"), planId);
        await setDoc(planDocRef, {
          planId,
          interestRate,
          maxAmount,
          minAmount,
          tenure,
          description,
          loanType,
          loanName,
          createdBy: user.uid,
        });
        toast({
          title: "Form submitted",
          description: "The loan plan details have been added to the database.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          planId: "",
          planType: "",
          planName: "",
          interestRate: 0,
          maxAmount: 0,
          minAmount: 0,
          tenure: 0,
          description: "",
          loanType: "",
          loanName: "",
        });
      } else if (formData.planType === "investment") {
        const planDocRef = doc(collection(db, "plans"), planId);
        await setDoc(planDocRef, {
          planId,
          planName,
          interestRate,
          maxAmount,
          minAmount,
          tenure,
          description,
          createdBy: user.uid,
        });
        toast({
          title: "Form submitted",
          description:
            "The investment plan details have been added to the database.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          planId: "",
          planType: "",
          planName: "",
          interestRate: "",
          maxAmount: 0,
          minAmount: 0,
          tenure: 0,
          description: "",
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error",
        description: "Failed to submit the plan. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={10}
        justifyItems="center"
        p={5}
        backgroundImage="url(/images/body-background.png)"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        minHeight="100vh"
        width="auto"
        overflow="hidden"
        color="white"
      >
        <Box display="flex" gap={30} justifyItems="center">
          <BankSidenav />
          <Navbar />
        </Box>
        <Box p={8}>
          <VStack my={5} align="stretch">
            <Heading>Plan Information</Heading>
            <Text>Welcome, {user.email}</Text>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                width={600}
                bgGradient="linear(to-l, rgba(10, 14, 35, 0.49) 76.65%, rgba(10, 14, 35, 0.49))"
                p={10}
                borderRadius="3xl"
              >
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Plan Type</FormLabel>
                      <Select
                        name="planType"
                        value={formData.planType}
                        onChange={handleInputChange}
                        placeholder="Select plan type"
                      >
                        <option value="loan">Loan</option>
                        <option value="investment">Investment</option>
                      </Select>
                    </FormControl>

                    {formData.planType === "loan" ? (
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Loan Type</FormLabel>
                            <Select
                              name="loanType"
                              value={formData.loanType}
                              onChange={handleInputChange}
                              placeholder="Select loan type"
                            >
                              <option value="personal">Personal Loan</option>
                              <option value="home">Home Loan</option>
                              <option value="auto">Auto Loan</option>
                              <option value="business">Business Loan</option>
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl isRequired>
                            <FormLabel>Loan Name</FormLabel>
                            <Input
                              name="loanName"
                              value={formData.loanName}
                              onChange={handleInputChange}
                            />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    ) : (
                      <FormControl isRequired>
                        <FormLabel>Plan Name</FormLabel>
                        <Input
                          name="planName"
                          value={formData.planName}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    )}
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Maximum Amount</FormLabel>
                          <NumberInput min={0}>
                            <NumberInputField
                              name="maxAmount"
                              value={formData.maxAmount}
                              onChange={handleInputChange}
                            />
                          </NumberInput>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Minimum Amount</FormLabel>
                          <NumberInput min={0}>
                            <NumberInputField
                              name="minAmount"
                              value={formData.minAmount}
                              onChange={handleInputChange}
                            />
                          </NumberInput>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Interest Rate (%)</FormLabel>
                          <NumberInput min={0} max={100}>
                            <NumberInputField
                              name="interestRate"
                              value={formData.interestRate}
                              onChange={handleInputChange}
                            />
                          </NumberInput>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Tenure (in months)</FormLabel>
                          <NumberInput min={1}>
                            <NumberInputField
                              name="tenure"
                              value={formData.tenure}
                              onChange={handleInputChange}
                            />
                          </NumberInput>
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl isRequired>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                    <HStack spacing={4}>
                      <Button type="submit" colorScheme="blue" width="100%">
                        Submit
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              </Box>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default page;
