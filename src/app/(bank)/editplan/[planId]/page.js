"use client";
import BankHeaders from "@/bankComponents/BankHeaders";
import BankSidenav from "@/bankComponents/BankSidenav";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
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
  Select,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const EditPlan = () => {
  const { planId } = useParams();
  const [formData, setFormData] = useState({
    planType: "",
    planName: "",
    interestRate: "",
    interestRateType: "fixed",
    maxAmount: "",
    minAmount: "",
    tenure: "",
    description: "",
    loanType: "",
    loanName: "",
    purpose: "",
    processingFeeType: "fixed",
    processingFeeAmount: "",
    processingFeePercentage: "",
    minMonthlyIncome: "",
    minAge: "",
    maxAge: "",
    employmentType: "",
    cibilScore: "",
    repaymentSchedule: "monthly",
    prepaymentAllowed: "yes",
    prepaymentCharges: "",
    otherConditions: "",
    investmentCategory: "",
    investmentSubCategory: "",
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const toast = useToast();
  const router = useRouter();

  const subCategories = {
    Bonds: ["Government Bonds", "Corporate Bonds", "Municipal Bonds"],
    MutualFunds: ["Equity Funds", "Debt Funds", "Balanced Funds"],
    FixedDeposits: ["Short-Term FD", "Long-Term FD", "Recurring Deposit"],
    GoldInvestments: [
      "Physical Gold",
      "Digital Gold",
      "Gold ETFs",
      "Sovereign Gold Bonds",
    ],
    ProvidentFunds: ["EPF", "PPF", "GPF"],
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRef = collection(db, "tags");
        const tagsSnapshot = await getDocs(tagsRef);
        const tagsList = tagsSnapshot.docs.map((doc) => doc.data().tag);
        setAvailableTags(tagsList);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const fetchPlanData = async () => {
      try {
        const planRef = doc(db, "investmentplans", planId);
        const investmentDoc = await getDoc(planRef);

        if (investmentDoc.exists()) {
          setFormData({
            id: investmentDoc.id,
            ...investmentDoc.data(),
            planType: "investment",
          });
          setTags(investmentDoc.data().tags || []);
        } else {
          const loanRef = doc(db, "loanplans", planId);
          const loanDoc = await getDoc(loanRef);

          if (loanDoc.exists()) {
            setFormData({
              id: loanDoc.id,
              ...loanDoc.data(),
              planType: "loan",
            });
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

    fetchTags();
    fetchPlanData();
  }, [planId, toast, router]);

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
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
      const collectionName =
        formData.planType === "loan" ? "loanplans" : "investmentplans";
      const planData = {
        ...formData,
        tags,
        lastUpdated: new Date(),
      };

      if (formData.planType === "loan") {
        await setDoc(doc(db, collectionName, planId), {
          ...planData,
          loanCategory: formData.loanType,
          investmentCategory: "",
          investmentSubCategory: "",
        });
      } else {
        await setDoc(doc(db, collectionName, planId), planData);
      }

      toast({
        title: "Success",
        description: `${
          formData.planType === "loan" ? "Loan" : "Investment"
        } plan updated successfully`,
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
    <>
      <Flex h="100vh">
        {/* Sidebar */}
        <Box w="20%" bg="gray.800" color="white" p={4} pos={"fixed"} h={"full"}>
          <BankSidenav />
        </Box>

        {/* Main Content */}
        <Box
          w="80%"
          bg="gray.50"
          display="flex"
          flexDirection="column"
          ml="281"
        >
          {/* Fixed Header */}
          <Box position="fixed" width="80%" zIndex={1000}>
            <BankHeaders />
          </Box>
          <Box p={24} bg="gray.50" borderRadius="md" boxShadow="md">
            <Heading as="h2" size="lg" mb={4}>
              Edit {formData.planType === "loan" ? "Loan" : "Investment"} Plan
            </Heading>
            <Divider mb={4} />
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                {formData.planType === "investment" && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Plan Name</FormLabel>
                      <Input
                        name="planName"
                        value={formData.planName}
                        onChange={handleInputChange}
                        variant="filled"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Category</FormLabel>
                      <Select
                        name="investmentCategory"
                        value={formData.investmentCategory}
                        onChange={handleInputChange}
                        variant="filled"
                      >
                        <option value="Bonds">Bonds</option>
                        <option value="MutualFunds">Mutual Funds</option>
                        <option value="FixedDeposits">Fixed Deposits</option>
                        <option value="GoldInvestments">
                          Gold Investments
                        </option>
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
                          variant="filled"
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
                        variant="filled"
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
                        variant="filled"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Purpose</FormLabel>
                      <Input
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        variant="filled"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Interest Rate Type</FormLabel>
                      <RadioGroup
                        name="interestRateType"
                        value={formData.interestRateType}
                        onChange={(value) =>
                          handleInputChange({
                            target: { name: "interestRateType", value },
                          })
                        }
                      >
                        <Stack direction="row">
                          <Radio value="fixed">Fixed</Radio>
                          <Radio value="floating">Floating</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Processing Fee</FormLabel>
                      <RadioGroup
                        name="processingFeeType"
                        value={formData.processingFeeType}
                        onChange={(value) =>
                          handleInputChange({
                            target: { name: "processingFeeType", value },
                          })
                        }
                      >
                        <Stack direction="row" mb={2}>
                          <Radio value="fixed">Fixed Amount</Radio>
                          <Radio value="percentage">Percentage</Radio>
                        </Stack>
                      </RadioGroup>
                      {formData.processingFeeType === "fixed" ? (
                        <NumberInput min={0} variant="filled">
                          <NumberInputField
                            name="processingFeeAmount"
                            value={formData.processingFeeAmount}
                            onChange={handleInputChange}
                          />
                        </NumberInput>
                      ) : (
                        <NumberInput min={0} max={100} variant="filled">
                          <NumberInputField
                            name="processingFeePercentage"
                            value={formData.processingFeePercentage}
                            onChange={handleInputChange}
                          />
                        </NumberInput>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Eligibility Criteria</FormLabel>
                      <VStack spacing={2}>
                        <NumberInput min={0} variant="filled">
                          <NumberInputField
                            name="minMonthlyIncome"
                            value={formData.minMonthlyIncome}
                            onChange={handleInputChange}
                            placeholder="Minimum Monthly Income"
                          />
                        </NumberInput>
                        <HStack w="100%">
                          <NumberInput min={18} max={100} variant="filled">
                            <NumberInputField
                              name="minAge"
                              value={formData.minAge}
                              onChange={handleInputChange}
                              placeholder="Min Age"
                            />
                          </NumberInput>
                          <NumberInput min={18} max={100} variant="filled">
                            <NumberInputField
                              name="maxAge"
                              value={formData.maxAge}
                              onChange={handleInputChange}
                              placeholder="Max Age"
                            />
                          </NumberInput>
                        </HStack>
                        <Select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          variant="filled"
                        >
                          <option value="salaried">Salaried</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="business">Business Owner</option>
                        </Select>
                        <NumberInput min={300} max={900} variant="filled">
                          <NumberInputField
                            name="cibilScore"
                            value={formData.cibilScore}
                            onChange={handleInputChange}
                            placeholder="Minimum CIBIL Score"
                          />
                        </NumberInput>
                      </VStack>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Repayment Schedule</FormLabel>
                      <Select
                        name="repaymentSchedule"
                        value={formData.repaymentSchedule}
                        onChange={handleInputChange}
                        variant="filled"
                      >
                        <option value="monthly">Monthly EMI</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Prepayment Options</FormLabel>
                      <RadioGroup
                        name="prepaymentAllowed"
                        value={formData.prepaymentAllowed}
                        onChange={(value) =>
                          handleInputChange({
                            target: { name: "prepaymentAllowed", value },
                          })
                        }
                      >
                        <Stack direction="row" mb={2}>
                          <Radio value="yes">Allowed</Radio>
                          <Radio value="no">Not Allowed</Radio>
                        </Stack>
                      </RadioGroup>
                      {formData.prepaymentAllowed === "yes" && (
                        <NumberInput min={0} variant="filled">
                          <NumberInputField
                            name="prepaymentCharges"
                            value={formData.prepaymentCharges}
                            onChange={handleInputChange}
                            placeholder="Prepayment Charges (%)"
                          />
                        </NumberInput>
                      )}
                    </FormControl>
                  </>
                )}

                <FormControl isRequired>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <NumberInput min={0} max={100} step={0.1} variant="filled">
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
                    <NumberInput min={0} variant="filled">
                      <NumberInputField
                        name="minAmount"
                        value={formData.minAmount}
                        onChange={handleInputChange}
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Maximum Amount</FormLabel>
                    <NumberInput min={0} variant="filled">
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
                  <NumberInput min={0} variant="filled">
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
                    variant="filled"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Other Conditions</FormLabel>
                  <Textarea
                    name="otherConditions"
                    value={formData.otherConditions}
                    onChange={handleInputChange}
                    variant="filled"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tags (up to 5)</FormLabel>
                  <Wrap spacing={2} mb={4}>
                    {tags.map((tag) => (
                      <WrapItem key={tag}>
                        <Tag size="md" colorScheme="blue" borderRadius="full">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  <HStack>
                    <Menu>
                      <MenuButton
                        as={Button}
                        colorScheme="teal"
                        isDisabled={tags.length >= 5}
                      >
                        Select Tag
                      </MenuButton>
                      <MenuList>
                        {availableTags.map((tag) => (
                          <MenuItem key={tag} onClick={() => handleAddTag(tag)}>
                            {tag}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Or add custom tag"
                      variant="filled"
                    />
                    <Button
                      onClick={() => handleAddTag(tagInput)}
                      isDisabled={tags.length >= 5 || !tagInput.trim()}
                      colorScheme="teal"
                    >
                      Add Custom
                    </Button>
                  </HStack>
                </FormControl>
                <HStack alignItems={"center"} justifyContent={"center"}>
                  <Button type="submit" colorScheme="teal" mt={4}>
                    Update{" "}
                    {formData.planType === "loan" ? "Loan" : "Investment"} Plan
                  </Button>
                  <Button
                    colorScheme="teal"
                    mt={4}
                    onClick={() => router.push("/bankplans")}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default EditPlan;
