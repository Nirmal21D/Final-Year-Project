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
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
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
    purpose: "",
    interestRateType: "fixed",
    interestRateMin: "",
    interestRateMax: "",
    processingFeeType: "percentage",
    processingFeeValue: "",
    minimumMonthlyIncome: "",
    minAge: "",
    maxAge: "",
    employmentType: "",
    cibilScore: "",
    repaymentSchedule: "monthly",
    prepaymentAllowed: "yes",
    prepaymentCharges: "",
    additionalConditions: "",
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);

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

  useEffect(() => {
    const fetchTags = async () => {
      const tagsCollection = await getDocs(collection(db, "tags"));
      const tagsList = tagsCollection.docs.map(doc => doc.data().tag);
      setFetchedTags(tagsList);
    };
    fetchTags();
  }, []);

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
      
      // Store tags in a separate collection
      for (const tag of tags) {
        await setDoc(doc(collection(db, "tags"), tag), { tag });
      }
      
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
        purpose: "",
        interestRateType: "fixed",
        interestRateMin: "",
        interestRateMax: "",
        processingFeeType: "percentage",
        processingFeeValue: "",
        minimumMonthlyIncome: "",
        minAge: "",
        maxAge: "",
        employmentType: "",
        cibilScore: "",
        repaymentSchedule: "monthly",
        prepaymentAllowed: "yes",
        prepaymentCharges: "",
        additionalConditions: "",
      });
      setTags([]); // Reset tags after submission
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
                    <option value="education">Education Loan</option>
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
                    placeholder="e.g., Smart Personal Loan"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Purpose</FormLabel>
                  <Input
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g., Home purchase, Vehicle, Business expansion"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Interest Rate Type</FormLabel>
                  <Select
                    name="interestRateType"
                    value={formData.interestRateType}
                    onChange={handleInputChange}
                    bg="white"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="floating">Floating</option>
                  </Select>
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Min Interest Rate (%)</FormLabel>
                    <NumberInput min={0} max={100} bg="white">
                      <NumberInputField
                        name="interestRateMin"
                        value={formData.interestRateMin}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Max Interest Rate (%)</FormLabel>
                    <NumberInput min={0} max={100} bg="white">
                      <NumberInputField
                        name="interestRateMax"
                        value={formData.interestRateMax}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Processing Fee Type</FormLabel>
                  <Select
                    name="processingFeeType"
                    value={formData.processingFeeType}
                    onChange={handleInputChange}
                    bg="white"
                  >
                    <option value="percentage">Percentage of Loan Amount</option>
                    <option value="fixed">Fixed Amount</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    Processing Fee {formData.processingFeeType === "percentage" ? "(%)" : "(₹)"}
                  </FormLabel>
                  <NumberInput min={0} bg="white">
                    <NumberInputField
                      name="processingFeeValue"
                      value={formData.processingFeeValue}
                      onChange={handleInputChange}
                    />
                  </NumberInput>
                </FormControl>

                <Heading size="sm" mt={4}>Eligibility Criteria</Heading>
                
                <FormControl isRequired>
                  <FormLabel>Minimum Monthly Income (₹)</FormLabel>
                  <NumberInput min={0} bg="white">
                    <NumberInputField
                      name="minimumMonthlyIncome"
                      value={formData.minimumMonthlyIncome}
                      onChange={handleInputChange}
                    />
                  </NumberInput>
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Minimum Age</FormLabel>
                    <NumberInput min={18} max={100} bg="white">
                      <NumberInputField
                        name="minAge"
                        value={formData.minAge}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Maximum Age</FormLabel>
                    <NumberInput min={18} max={100} bg="white">
                      <NumberInputField
                        name="maxAge"
                        value={formData.maxAge}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Employment Type</FormLabel>
                  <Select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    bg="white"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="professional">Professional</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Minimum CIBIL Score</FormLabel>
                  <NumberInput min={300} max={900} bg="white">
                    <NumberInputField
                      name="cibilScore"
                      value={formData.cibilScore}
                      onChange={handleInputChange}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Repayment Schedule</FormLabel>
                  <Select
                    name="repaymentSchedule"
                    value={formData.repaymentSchedule}
                    onChange={handleInputChange}
                    bg="white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Prepayment Allowed</FormLabel>
                  <Select
                    name="prepaymentAllowed"
                    value={formData.prepaymentAllowed}
                    onChange={handleInputChange}
                    bg="white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </FormControl>

                {formData.prepaymentAllowed === "yes" && (
                  <FormControl>
                    <FormLabel>Prepayment Charges (%)</FormLabel>
                    <NumberInput min={0} max={100} bg="white">
                      <NumberInputField
                        name="prepaymentCharges"
                        value={formData.prepaymentCharges}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Additional Conditions</FormLabel>
                  <Textarea
                    name="additionalConditions"
                    value={formData.additionalConditions}
                    onChange={handleInputChange}
                    placeholder="Enter any additional eligibility criteria or conditions"
                    bg="white"
                  />
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
                  isDisabled={tags.length >= 5 || !tagInput}
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

              {/* Display fetched tags */}
              <Text mb={2} fontWeight="bold">Fetched Tags:</Text>
              <Wrap spacing={2}>
                {fetchedTags.map((tag) => (
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