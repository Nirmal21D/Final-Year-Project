"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  VStack,
  HStack,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const EditPlan = () => {
  const { planId } = useParams();
  const [formData, setFormData] = useState({
    planName: "",
    interestRate: "",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanName: "",
    investmentCategory: "",
    investmentSubCategory: "",
    planType: "",
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const planRef = doc(db, "investmentplans", planId);
        const investmentDoc = await getDoc(planRef);
        
        if (investmentDoc.exists()) {
          setFormData({ id: investmentDoc.id, ...investmentDoc.data(), planType: "investment" });
          setTags(investmentDoc.data().tags || []);
        } else {
          const loanRef = doc(db, "loanplans", planId);
          const loanDoc = await getDoc(loanRef);
          
          if (loanDoc.exists()) {
            setFormData({ id: loanDoc.id, ...loanDoc.data(), planType: "loan" });
            setTags(loanDoc.data().tags || []);
          } else {
            toast({
              title: "Error",
              description: "Plan not found",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            router.push("/bankplans");
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch plan data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push("/bankplans");
      }
    };

    fetchPlanData();
  }, [planId, toast, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collectionName = formData.planType === "loan" ? "loanplans" : "investmentplans";
      await setDoc(doc(db, collectionName, planId), {
        ...formData,
        tags,
        updatedAt: new Date(),
      });
      toast({
        title: "Success",
        description: `${formData.planType === "loan" ? "Loan" : "Investment"} plan updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/bankplans");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        Edit {formData.planType === "loan" ? "Loan" : "Investment"} Plan
      </Heading>
      <Divider mb={4} />
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>{formData.planType === "loan" ? "Loan Name" : "Plan Name"}</FormLabel>
            <Input
              name={formData.planType === "loan" ? "loanName" : "planName"}
              value={formData.planType === "loan" ? formData.loanName : formData.planName}
              onChange={handleInputChange}
              placeholder={`Enter ${formData.planType === "loan" ? "loan" : "investment"} plan name`}
              variant="filled"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Interest Rate (%)</FormLabel>
            <Input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              min={0}
              placeholder="Enter interest rate"
              variant="filled"
            />
          </FormControl>

          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Minimum Amount</FormLabel>
              <Input
                type="number"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleInputChange}
                min={0}
                placeholder="Enter minimum amount"
                variant="filled"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Maximum Amount</FormLabel>
              <Input
                type="number"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleInputChange}
                min={0}
                placeholder="Enter maximum amount"
                variant="filled"
              />
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Tenure (months)</FormLabel>
            <Input
              type="number"
              name="tenure"
              value={formData.tenure}
              onChange={handleInputChange}
              min={1}
              placeholder="Enter tenure in months"
              variant="filled"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={`Enter ${formData.planType === "loan" ? "loan" : "investment"} plan description`}
              variant="filled"
            />
          </FormControl>

          {/* Tags Section */}
          <FormControl>
            <FormLabel>Tags (up to 5)</FormLabel>
            <Wrap spacing={2} mb={4}>
              {tags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag size="md" colorScheme="blue" borderRadius="full">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
            <HStack>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags"
                variant="filled"
              />
              <Button
                onClick={() => handleAddTag(tagInput)}
                isDisabled={tags.length >= 5 || !tagInput.trim()}
                colorScheme="teal"
              >
                Add
              </Button>
            </HStack>
          </FormControl>

          <Button type="submit" colorScheme="teal" mt={4}>
            Update {formData.planType === "loan" ? "Loan" : "Investment"} Plan
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditPlan; 
