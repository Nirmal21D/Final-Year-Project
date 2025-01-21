"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
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
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const AddPlanForm = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    planType: "",
    planName: "",
    interestRate: "",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanType: "",
    loanName: "",
    investmentCategory: "",
    investmentSubCategory: "",
    createdBy: "", // Added createdBy field
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const router = useRouter();
  const toast = useToast();

  // Subcategories for each investment category
  const subCategories = {
    Bonds: ["Government Bonds", "Corporate Bonds", "Municipal Bonds"],
    MutualFunds: ["Equity Funds", "Debt Funds", "Balanced Funds"],
    FixedDeposits: ["Short-Term FD", "Long-Term FD", "Recurring Deposit"],
    GoldInvestments: ["Physical Gold", "Digital Gold", "Gold ETFs", "Sovereign Gold Bonds"],
    ProvidentFunds: ["EPF", "PPF", "GPF"],
  };

  // Predefined tags for financial products
  const suggestedTags = [
    "High Risk", "Low Risk", "Medium Risk",
    "Short Term", "Long Term",
    "Tax Saving", "High Returns",
    "Senior Citizen", "Youth",
    "Beginner Friendly", "Fixed Income",
    "Regular Income", "Wealth Creation",
    "Retirement", "Education",
    "Real Estate", "Technology",
    "Healthcare", "Green Energy"
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "investmentCategory" && { investmentSubCategory: "" }),
    }));
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.minAmount) > parseFloat(formData.maxAmount)) {
      toast({
        title: "Validation Error",
        description: "Minimum amount cannot be greater than maximum amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const planId = uuidv4();
      const collectionName = formData.planType === "loan" ? "loanplans" : "investmentplans";
      
      const planData = {
        ...formData,
        tags,
        planId,
        createdBy: user.uid, // Ensure createdBy is set to user.uid
        status: "pending",
        isVerified: false,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      await setDoc(doc(collection(db, collectionName), planId), planData);
      
      toast({
        title: "Success",
        description: "Plan added successfully! Awaiting admin verification.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setFormData({
        planType: "",
        planName: "",
        interestRate: "",
        maxAmount: "",
        minAmount: "",
        tenure: "",
        description: "",
        loanType: "",
        loanName: "",
        investmentCategory: "",
        investmentSubCategory: "",
        createdBy: "", // Reset createdBy field
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add plan. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) return <Box>Loading...</Box>;

  return (
    <Flex direction="column" align="center" p={14}>
      <VStack
        spacing={6}
        w="100%"
        maxW="800px"
        bg="gray.200"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading color="teal.500" size="lg">
          Add New Plan
        </Heading>
        <Text color="gray.600">Welcome, {user.email}</Text>
        <Box as="form" w="100%" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Plan Type</FormLabel>
              <Select
                name="planType"
                value={formData.planType}
                onChange={handleInputChange}
                placeholder="Select Plan Type"
                bg="white"
              >
                <option value="loan">Loan</option>
                <option value="investment">Investment</option>
              </Select>
            </FormControl>

            {formData.planType === "investment" && (
              <>
                <FormControl isRequired>
                  <FormLabel>Plan Name</FormLabel>
                  <Input
                    name="planName"
                    value={formData.planName}
                    onChange={handleInputChange}
                    bg="white"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="investmentCategory"
                    value={formData.investmentCategory}
                    onChange={handleInputChange}
                    placeholder="Select Category"
                    bg="white"
                  >
                    <option value="Bonds">Bonds</option>
                    <option value="MutualFunds">Mutual Funds</option>
                    <option value="FixedDeposits">Fixed Deposits</option>
                    <option value="GoldInvestments">Gold Investments</option>
                    <option value="ProvidentFunds">Provident Funds</option>
                  </Select>
                </FormControl>
                {formData.investmentCategory && (
                  <FormControl isRequired>
                    <FormLabel>Subcategory</FormLabel>
                    <Select
                      name="investmentSubCategory"
                      value={formData.investmentSubCategory}
                      onChange={handleInputChange}
                      placeholder="Select Subcategory"
                      bg="white"
                    >
                      {subCategories[formData.investmentCategory]?.map(
                        (subCategory) => (
                          <option key={subCategory} value={subCategory}>
                            {subCategory}
                          </option>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              </>
            )}

            {formData.planType === "loan" && (
              <>
                <FormControl isRequired>
                  <FormLabel>Loan Name</FormLabel>
                  <Input
                    name="loanName"
                    value={formData.loanName}
                    onChange={handleInputChange}
                    bg="white"
                    borderRadius="md"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Loan Type</FormLabel>
                  <Select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    placeholder="Select Loan Type"
                    bg="white"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="home">Home Loan</option>
                  </Select>
                </FormControl>
              </>
            )}

            <FormControl isRequired>
              <FormLabel>Interest Rate (%)</FormLabel>
              <NumberInput min={0} max={100} step={0.1} bg="white">
                <NumberInputField
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                />
              </NumberInput>
            </FormControl>
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Minimum Amount</FormLabel>
                <NumberInput min={0} bg="white">
                  <NumberInputField
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                  />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Maximum Amount</FormLabel>
                <NumberInput min={0} bg="white">
                  <NumberInputField
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                  />
                </NumberInput>
              </FormControl>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Tenure (months)</FormLabel>
              <NumberInput min={0} bg="white">
                <NumberInputField
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                bg="white"
              />
            </FormControl>

            {/* Tags Section */}
            <FormControl>
              <FormLabel>Tags (up to 5)</FormLabel>
              <HStack mb={2}>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                />
                <Button
                  onClick={() => handleAddTag(tagInput)}
                  isDisabled={tags.length >= 5 || !tagInput.trim()}
                >
                  Add
                </Button>
              </HStack>
              
              {/* Display selected tags */}
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

              {/* Suggested tags */}
              <Text mb={2} fontWeight="bold">Suggested Tags:</Text>
              <Wrap spacing={2}>
                {suggestedTags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="md"
                      colorScheme="gray"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => handleAddTag(tag)}
                      _hover={{ bg: "blue.100" }}
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full" mt={4}>
              Submit Plan
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default AddPlanForm;