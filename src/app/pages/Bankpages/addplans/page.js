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
} from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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
        console.log("Form submitted:", formData);
        toast({
          title: "Form submitted",
          description: "The plan details have been added to the database.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Reset form after successful submission
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
        console.log("Form submitted:", formData);
        toast({
          title: "Form submitted",
          description: "The plan details have been added to the database.",
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
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading>Bank Panel</Heading>
        <Text>Welcome, {user.email}</Text>

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
              <>
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

                <FormControl isRequired>
                  <FormLabel>Loan Name</FormLabel>
                  <Input
                    name="loanName"
                    value={formData.loanName}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel>Plan Name</FormLabel>
                  <Input
                    name="planName"
                    value={formData.planName}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            )}

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
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Submit Plan
            </Button>
          </VStack>
        </form>

        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default page;
