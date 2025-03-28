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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Textarea,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Radio,
  RadioGroup,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormHelperText,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Divider,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  Badge,
  Tooltip,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Progress,
  Spinner,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, setDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FiInfo, FiPercent, FiDollarSign, FiClock, FiShield, FiAlertTriangle } from "react-icons/fi";

const AddPlanForm = () => {
  const [user, setUser] = useState(null);
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
    createdBy: "",
    loanCategory: "",
    riskLevel: 3, // Default risk level (1-5)
    cagr: "", // Calculated Annual Growth Rate
    flexibilityScore: 3, // Flexibility in terms (1-5)
    loanSubCategory: "", // More specific loan categorization
    tags: [], // Moving tags into formData
    taxBenefits: "No", // Tax benefits for investments
    taxBenefitDetails: "", // Details about tax benefits
    minimumTenure: "", // Minimum lock-in period
    earlyWithdrawalPenalty: "", // Penalty for early withdrawal
    guarantorRequired: "No", // Whether a guarantor is required
    collateralRequired: "No", // Whether collateral is required
    collateralPercentage: "", // Percentage of loan that must be secured
    documentationRequired: "", // List of required documents
    investmentFrequency: "onetime", // Frequency of investment (for SIPs etc.)
    paymentFrequency: "monthly", // Frequency of repayments
    isInsuranceRequired: "No", // Whether insurance is mandatory
    planStatus: "pending", // Status of the plan
    loanToValueRatio: "", // LTV ratio for secured loans
    eligibilityCriteria: "", // Additional eligibility criteria
    lockInPeriod: "", // Lock-in period for investments
    indemnityRequired: "No", // Indemnity requirements
    maturityCalculation: "compound", // simple or compound interest
    compoundingFrequency: "annually", // quarterly, monthly, etc.
    expectedReturns: "", // projected returns
    minimumSIPAmount: "", // for SIP investments
    redemptionPeriod: "", // time to get money after redemption request
    fundManager: "", // for mutual funds
    benchmarkIndex: "", // reference index for comparison
    pastPerformance: "", // historical performance data
    sectorFocus: [], // industry sectors the investment focuses on
    investmentObjective: "", // growth, income, balanced
    eligibleInvestors: "all", // retail, HNI, institutional
    exitLoad: "", // exit charges in percentage
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [fetchedTags, setFetchedTags] = useState([]);
  const [calculatedRisk, setCalculatedRisk] = useState(3);
  const [calculatedCAGR, setCalculatedCAGR] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const router = useRouter();
  const toast = useToast();

  // Subcategories for each investment category
  const subCategories = {
    Bonds: ["Government Bonds", "Corporate Bonds", "Municipal Bonds", "Treasury Bonds", "Zero Coupon Bonds", "Inflation-Indexed Bonds", "Convertible Bonds", "Sovereign Bonds"],
    
    MutualFunds: ["Equity Funds", "Debt Funds", "Balanced Funds", "Index Funds", "Liquid Funds", "ELSS Funds", "Sector Funds", "International Funds", "Dividend Yield Funds", "Value Funds", "Growth Funds", "Small Cap", "Mid Cap", "Large Cap", "Multi Cap"],
    
    FixedDeposits: ["Short-Term FD", "Long-Term FD", "Recurring Deposit", "Tax-Saving FD", "Senior Citizen FD", "Super Senior Citizen FD", "Flexi FD", "Corporate FD", "Bank FD", "Special Deposit Schemes"],
    
    GoldInvestments: ["Physical Gold", "Digital Gold", "Gold ETFs", "Sovereign Gold Bonds", "Gold Mutual Funds", "Gold Futures", "Gold Mining Stocks", "Gold Jewelry", "Gold Coins", "Gold Accumulation Plans"],
    
    ProvidentFunds: ["EPF", "PPF", "GPF", "VPF", "UPF", "EDLI", "NPS", "APY"],
    
    Stocks: ["Direct Equity", "IPO Investments", "Blue Chip Stocks", "Penny Stocks", "Growth Stocks", "Value Stocks", "Dividend Stocks", "Preferred Stocks"],
    
    RealEstate: ["REITs", "Commercial Property", "Residential Property", "Rental Property", "Land", "Vacation Homes", "Fractional Ownership", "Real Estate Crowdfunding"],
    
    Commodities: ["Precious Metals", "Industrial Metals", "Energy Resources", "Agricultural Products", "Commodity ETFs", "Commodity Futures", "Commodity Options"],
    
    InsurancePlans: ["ULIPs", "Endowment Plans", "Money-Back Plans", "Whole Life Plans", "Retirement Plans", "Child Plans", "Pension Plans", "Annuity Plans"],
    
    AlternativeInvestments: ["Private Equity", "Venture Capital", "Hedge Funds", "Structured Products", "Art & Collectibles", "Wine & Spirits", "Peer-to-Peer Lending", "Cryptocurrencies", "NFTs", "Carbon Credits"],
    
    TaxSaving: ["ELSS Mutual Funds", "PPF", "Tax-Saving FDs", "NPS", "ULIP", "Senior Citizens Savings Scheme", "Sukanya Samriddhi Yojana", "NSC"],
    
    ShortTermInstruments: ["Treasury Bills", "Commercial Papers", "Certificate of Deposits", "Money Market Funds", "Liquid Funds", "Ultra Short Term Funds", "Overnight Funds", "Arbitrage Funds"]
  };

  // Loan subcategories for each loan type
  const loanSubCategories = {
    personal: ["General Purpose", "Debt Consolidation", "Wedding", "Medical Emergency", "Travel", "Home Renovation", "Education", "Used Vehicle", "Festivities", "Consumer Durables", "Family Function", "Emergency Cash", "Professional Development"],
    
    home: ["New Property Purchase", "Resale Property", "Construction", "Renovation", "Land Purchase", "Home Extension", "Balance Transfer", "Top-up Loan", "Home Improvement", "Joint Home Loan", "NRI Home Loan", "Luxury Property", "Affordable Housing", "Plot Purchase & Construction"],
    
    education: ["Undergraduate", "Postgraduate", "Doctoral", "Professional Course", "Study Abroad", "Skill Development", "Research Programs", "Vocational Training", "Executive Education", "Online Courses", "School Education", "Competitive Exam Coaching", "Scholar Loans"],
    
    car: ["New Car", "Used Car", "Two Wheeler", "Commercial Vehicle", "Electric Vehicle", "Luxury Vehicle", "Vintage/Classic Car", "Fleet Financing", "Taxi Finance", "Leasing Options", "Vehicle Refinancing"],
    
    business: ["Working Capital", "Equipment Purchase", "Expansion", "Startup", "Invoice Financing", "Merchant Cash Advance", "Commercial Property", "Franchise Financing", "Supply Chain Financing", "Trade Finance", "Contract Financing", "Agriculture Business", "MSME Loans", "Term Loans"],
    
    agriculture: ["Crop Loans", "Farm Mechanization", "Land Development", "Irrigation Systems", "Allied Activities", "Plantation Crops", "Warehouse Construction", "Cold Storage", "Rural Development", "Horticulture", "Dairy Farming", "Poultry Farming", "Fisheries"],
    
    mortgage: ["Fixed-Rate Mortgage", "Adjustable-Rate Mortgage", "Jumbo Loans", "Bridge Loans", "Reverse Mortgage", "Second Mortgage", "Commercial Mortgage", "Construction-to-Permanent", "Interest-Only Mortgage"],
    
    gold: ["Gold Jewelry Loan", "Gold Coin/Bar Loan", "Gold Overdraft", "Agricultural Gold Loan", "Business Gold Loan", "Personal Gold Loan", "Doorstep Gold Loan"],
    
    micro: ["Group Lending", "Individual Microloans", "Joint Liability", "Self-Help Groups", "Income Generation", "Women Empowerment", "Rural Microfinance", "Urban Microfinance"],
    
    green: ["Solar Panel Financing", "Electric Vehicle", "Energy Efficiency Projects", "Sustainable Agriculture", "Green Building", "Clean Water Projects", "Renewable Energy", "Eco-Tourism Ventures"],
    
    overdraft: ["Salary Overdraft", "Business Overdraft", "Secured Overdraft", "Current Account Overdraft", "Cash Credit", "Working Capital Demand Loan", "Temporary Overdraft", "Flexible Credit Line"]
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

  // Calculate Risk Level for investment plans
  useEffect(() => {
    if (formData.planType === "investment") {
      // Higher interest often comes with higher risk
      const interestRiskFactor = parseFloat(formData.interestRate) / 5; // 0-4 scale (20% interest rate would be highest risk)
      
      // Shorter tenure may indicate lower risk
      const tenureFactor = parseFloat(formData.tenure) / 120; // 0-1 scale (120 months is highest)
      
      // Higher minimum amount may suggest higher barrier/risk
      const minAmountFactor = parseFloat(formData.minAmount) > 50000 ? 0.5 : 0.2;
      
      // Category risk factors
      const categoryRiskFactors = {
        FixedDeposits: 1.2,
        ProvidentFunds: 1.5,
        Bonds: 2.2,
        GoldInvestments: 2.8,
        MutualFunds: 3.5,
      };
      
      const categoryFactor = categoryRiskFactors[formData.investmentCategory] || 2.5;
      
      // Calculate weighted risk score (1-5 scale)
      let riskScore = (
        interestRiskFactor * 0.4 +
        tenureFactor * 0.2 +
        minAmountFactor * 0.1 +
        categoryFactor * 0.3
      );
      
      // Clamp between 1-5
      riskScore = Math.max(1, Math.min(5, riskScore));
      setCalculatedRisk(parseFloat(riskScore.toFixed(1)));
      
      // Update form data
      setFormData(prev => ({...prev, riskLevel: riskScore.toFixed(1)}));
    }
  }, [formData.interestRate, formData.tenure, formData.minAmount, formData.investmentCategory, formData.planType]);

  // Calculate CAGR for investment plans
  useEffect(() => {
    if (formData.planType === "investment" && formData.interestRate && formData.tenure) {
      const interestRate = parseFloat(formData.interestRate) / 100;
      const tenureYears = parseFloat(formData.tenure) / 12;
      
      // CAGR calculation: (1 + r)^t - 1
      const cagr = ((Math.pow(1 + interestRate, tenureYears) - 1) * 100).toFixed(2);
      setCalculatedCAGR(cagr);
      
      // Update form data
      setFormData(prev => ({...prev, cagr}));
    }
  }, [formData.interestRate, formData.tenure, formData.planType]);

  const calculateReturnProjections = () => {
    if (!formData.minAmount || !formData.interestRate || !formData.tenure) {
      return { maturityValue: 0, totalInterest: 0 };
    }

    const principal = parseFloat(formData.minAmount);
    const rate = parseFloat(formData.interestRate) / 100;
    const tenureYears = parseFloat(formData.tenure) / 12;
    
    let maturityValue = 0;
    
    if (formData.maturityCalculation === "simple") {
      // Simple interest calculation
      maturityValue = principal * (1 + (rate * tenureYears));
    } else {
      // Compound interest calculation
      const compoundingPeriodsPerYear = {
        annually: 1,
        semiannually: 2,
        quarterly: 4,
        monthly: 12,
        daily: 365
      }[formData.compoundingFrequency];
      
      const n = compoundingPeriodsPerYear * tenureYears;
      const r = rate / compoundingPeriodsPerYear;
      
      maturityValue = principal * Math.pow(1 + r, n);
    }
    
    const totalInterest = maturityValue - principal;
    
    return {
      maturityValue: maturityValue.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  };

  useEffect(() => {
    if (formData.planType === "investment" && 
        formData.interestRate && 
        formData.minAmount && 
        formData.tenure) {
      const { maturityValue, totalInterest } = calculateReturnProjections();
      setFormData(prev => ({
        ...prev,
        expectedReturns: maturityValue
      }));
    }
  }, [
    formData.interestRate, 
    formData.tenure, 
    formData.minAmount, 
    formData.maturityCalculation, 
    formData.compoundingFrequency, 
    formData.planType
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "investmentCategory" && { investmentSubCategory: "" }),
      ...(name === "loanType" && { loanSubCategory: "" }),
    }));
  };

  const handleRangeChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleAddTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setFormData(prev => ({...prev, tags: [...tags, tag]}));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setFormData(prev => ({...prev, tags: updatedTags}));
  };

  // Update the validateForm function with additional investment validations

const validateForm = () => {
  let isValid = true;
  let errorMessage = '';
  const missingFields = [];

  // Basic Details validation
  if (formData.planType === "loan") {
    if (!formData.loanName) missingFields.push("Loan Name");
    if (!formData.loanType) missingFields.push("Loan Type");
    if (!formData.loanSubCategory) missingFields.push("Loan Subcategory");
    if (!formData.purpose) missingFields.push("Purpose");
  } else {
    if (!formData.planName) missingFields.push("Plan Name");
    if (!formData.investmentCategory) missingFields.push("Investment Category");
    if (!formData.investmentSubCategory) missingFields.push("Investment Subcategory");
  }
  if (!formData.description) missingFields.push("Description");

  // Financial Details validation
  if (!formData.interestRate) missingFields.push("Interest Rate");
  if (!formData.minAmount) missingFields.push("Minimum Amount");
  if (!formData.maxAmount) missingFields.push("Maximum Amount");
  if (!formData.tenure) missingFields.push("Tenure");

  // Processing Fee validation for loans
  if (formData.planType === "loan") {
    if (formData.processingFeeType === "fixed" && !formData.processingFeeAmount) {
      missingFields.push("Processing Fee Amount");
    }
    if (formData.processingFeeType === "percentage" && !formData.processingFeePercentage) {
      missingFields.push("Processing Fee Percentage");
    }
  }

  // Additional Details validation
  if (!formData.documentationRequired) missingFields.push("Documentation Required");

  // Loan-specific validations
  if (formData.planType === "loan") {
    if (!formData.minMonthlyIncome) missingFields.push("Minimum Monthly Income");
    if (!formData.minAge) missingFields.push("Minimum Age");
    if (!formData.maxAge) missingFields.push("Maximum Age");
    if (!formData.employmentType) missingFields.push("Employment Type");
    if (!formData.cibilScore) missingFields.push("CIBIL Score");
  }

  // Investment-specific validations
  if (formData.planType === "investment") {
    // Required fields for investments
    if (!formData.investmentFrequency) missingFields.push("Investment Frequency");
    
    // Validation for mutual funds
    if (formData.investmentCategory === "MutualFunds") {
      if (!formData.fundManager) missingFields.push("Fund Manager");
      if (!formData.benchmarkIndex) missingFields.push("Benchmark Index");
    }
    
    // Validate investment objective
    if (!formData.investmentObjective) missingFields.push("Investment Objective");
    
    // Validate maturity calculation
    if (formData.maturityCalculation === "compound" && !formData.compoundingFrequency) {
      missingFields.push("Compounding Frequency");
    }
    
    // Validate redemption period for investments
    if (formData.planType === "investment" && !formData.redemptionPeriod) {
      missingFields.push("Redemption Period");
    }
  }

  // Validate amounts
  if (parseFloat(formData.minAmount) > parseFloat(formData.maxAmount)) {
    errorMessage = "Minimum amount cannot be greater than maximum amount";
    isValid = false;
  }

  // Set error message if fields are missing
  if (missingFields.length > 0) {
    errorMessage = `Please fill in the following required fields: ${missingFields.join(", ")}`;
    isValid = false;
  }

  // Log validation results for debugging
  console.log("Validation Results:", {
    isValid,
    errorMessage,
    missingFields,
    formData
  });

  return { isValid, errorMessage };
};
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const { isValid, errorMessage } = validateForm();
  
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
      setIsSubmitting(false);
      return;
    }
  
    try {
      const planId = uuidv4();
      const collectionName = formData.planType === "loan" ? "loanplans" : "investmentplans";
      
      // Prepare data for saving
      const planData = {
        ...formData,
        tags: tags,
        planId,
        createdBy: user.uid,
        status: "pending",
        isVerified: false,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        
        // Convert string numbers to actual numbers for proper sorting and filtering
        interestRate: parseFloat(formData.interestRate) || 0,
        minAmount: parseFloat(formData.minAmount) || 0,
        maxAmount: parseFloat(formData.maxAmount) || 0,
        tenure: parseInt(formData.tenure) || 0,
        
        // Add additional calculated fields
        cagr: formData.planType === "investment" ? parseFloat(calculatedCAGR) : null,
        riskLevel: formData.planType === "investment" ? parseFloat(calculatedRisk) : null,
      };
  
      if (formData.planType === "loan") {
        await setDoc(doc(collection(db, collectionName), planId), {
          ...planData,
          loanCategory: formData.loanType,
          investmentCategory: "",
          investmentSubCategory: "",
          processingFeeAmount: parseFloat(formData.processingFeeAmount) || 0,
          processingFeePercentage: parseFloat(formData.processingFeePercentage) || 0,
          minMonthlyIncome: parseFloat(formData.minMonthlyIncome) || 0,
          cibilScore: parseFloat(formData.cibilScore) || 0,
          prepaymentCharges: parseFloat(formData.prepaymentCharges) || 0,
        });
      } else {
        await setDoc(doc(collection(db, collectionName), planId), {
          ...planData,
          investmentCategory: formData.investmentCategory,
          investmentSubCategory: formData.investmentSubCategory,
          loanCategory: "",
          loanSubCategory: "",
        });
      }
      
      // Save tags separately for future use
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
      
      // Reset form
      setFormData({
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
        createdBy: "",
        loanCategory: "",
        riskLevel: 3,
        cagr: "",
        flexibilityScore: 3,
        loanSubCategory: "",
        taxBenefits: "No",
        taxBenefitDetails: "",
        minimumTenure: "",
        earlyWithdrawalPenalty: "",
        guarantorRequired: "No",
        collateralRequired: "No",
        collateralPercentage: "",
        documentationRequired: "",
        investmentFrequency: "onetime",
        paymentFrequency: "monthly",
        isInsuranceRequired: "No",
        planStatus: "pending",
        loanToValueRatio: "",
        eligibilityCriteria: "",
        lockInPeriod: "",
        indemnityRequired: "No",
        maturityCalculation: "compound",
        compoundingFrequency: "annually",
        expectedReturns: "",
        minimumSIPAmount: "",
        redemptionPeriod: "",
        fundManager: "",
        benchmarkIndex: "",
        pastPerformance: "",
        sectorFocus: [],
        investmentObjective: "",
        eligibleInvestors: "all",
        exitLoad: "",
      });
      setTags([]);
      setActiveTabIndex(0);
    } catch (error) {
      console.error("Error adding plan:", error);
      toast({
        title: "Error",
        description: "Could not add plan. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!user) return (
    <Flex justify="center" align="center" h="100vh">
      <Spinner size="xl" color="blue.500" />
      <Text ml={4} fontSize="xl">Loading...</Text>
    </Flex>
  );

  return (
    <Flex direction="column" align="center" p={14}>
      <VStack
        spacing={6}
        w="100%"
        maxW="900px"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading color="#2C319F" size="lg">
          Add New Financial Plan
        </Heading>
        <Text color="gray.600">Welcome, {user.email}</Text>

        <Box as="form" w="100%" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Plan Type Selection */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Plan Type</FormLabel>
              <Select
                name="planType"
                value={formData.planType}
                onChange={handleInputChange}
                placeholder="Select Plan Type"
                bg="white"
                borderColor="gray.300"
                size="lg"
              >
                <option value="loan">Loan</option>
                <option value="investment">Investment</option>
              </Select>
            </FormControl>

            {formData.planType && (
              <Tabs 
                colorScheme="blue" 
                index={activeTabIndex} 
                onChange={(index) => setActiveTabIndex(index)}
                variant="enclosed-colored"
              >
                <TabList>
                  <Tab>Basic Details</Tab>
                  <Tab>Financial Details</Tab>
                  <Tab>Additional Details</Tab>
                  {formData.planType === "loan" && (
                    <Tab>Eligibility Criteria</Tab>
                  )}
                </TabList>

                <TabPanels>
                  {/* Basic Details Tab */}
                  <TabPanel>
                    <VStack spacing={5} align="start">
                      {/* Plan Name */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">
                          {formData.planType === "loan" ? "Loan Name" : "Investment Plan Name"}
                        </FormLabel>
                        <Input
                          name={formData.planType === "loan" ? "loanName" : "planName"}
                          value={formData.planType === "loan" ? formData.loanName : formData.planName}
                          onChange={handleInputChange}
                          bg="white"
                          borderColor="gray.300"
                          placeholder={formData.planType === "loan" ? "e.g., Smart Home Loan" : "e.g., Premium Growth Fund"}
                        />
                      </FormControl>

                      {/* Categories */}
                      {formData.planType === "investment" && (
                        <>
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Investment Category</FormLabel>
                            <Select
                              name="investmentCategory"
                              value={formData.investmentCategory}
                              onChange={handleInputChange}
                              placeholder="Select Category"
                              bg="white"
                              borderColor="gray.300"
                            >
                              <option value="Bonds">Bonds</option>
                              <option value="MutualFunds">Mutual Funds</option>
                              <option value="FixedDeposits">Fixed Deposits</option>
                              <option value="GoldInvestments">Gold Investments</option>
                              <option value="ProvidentFunds">Provident Funds</option>
                              <option value="Stocks">Stocks & Shares</option>
                              <option value="RealEstate">Real Estate Investments</option>
                              <option value="Commodities">Commodity Investments</option>
                              <option value="InsurancePlans">Insurance Investment Plans</option>
                              <option value="AlternativeInvestments">Alternative Investments</option>
                              <option value="TaxSaving">Tax-Saving Instruments</option>
                              <option value="ShortTermInstruments">Short-Term Instruments</option>
                            </Select>
                          </FormControl>

                          {formData.investmentCategory && (
                            <FormControl isRequired>
                              <FormLabel fontWeight="bold">Subcategory</FormLabel>
                              <Select
                                name="investmentSubCategory"
                                value={formData.investmentSubCategory}
                                onChange={handleInputChange}
                                placeholder="Select Subcategory"
                                bg="white"
                                borderColor="gray.300"
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
                            <FormLabel fontWeight="bold">Loan Type</FormLabel>
                            <Select
                              name="loanType"
                              value={formData.loanType}
                              onChange={handleInputChange}
                              placeholder="Select Loan Type"
                              bg="white"
                              borderColor="gray.300"
                            >
                              <option value="HomeLoans">Home Loan</option>
                              <option value="PersonalLoans">Personal Loan</option>
                              <option value="BusinessLoans">Business Loan</option>
                              <option value="EducationLoans">Education Loan</option>
                              <option value="CarLoans">Car Loan</option>
                              <option value="AgricultureLoans">Agriculture Loan</option>
                              <option value="MortgageLoans">Mortgage Loan</option>
                              <option value="GoldLoans">Gold Loan</option>
                              <option value="MicroFinance">Microfinance Loan</option>
                              <option value="GreenLoans">Green/Sustainability Loan</option>
                              <option value="OverdraftLoans">Overdraft & Credit Line</option>
                            </Select>
                          </FormControl>

                          {formData.loanType && (
                            <FormControl isRequired>
                              <FormLabel fontWeight="bold">Loan Subcategory</FormLabel>
                              <Select
                                name="loanSubCategory"
                                value={formData.loanSubCategory}
                                onChange={handleInputChange}
                                placeholder="Select Subcategory"
                                bg="white"
                                borderColor="gray.300"
                              >
                                {loanSubCategories[formData.loanType?.toLowerCase().replace("loans", "")]?.map(
                                  (subCategory) => (
                                    <option key={subCategory} value={subCategory}>
                                      {subCategory}
                                    </option>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          )}

                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Purpose</FormLabel>
                            <Input
                              name="purpose"
                              value={formData.purpose}
                              onChange={handleInputChange}
                              placeholder="e.g., Home purchase, Vehicle, Business expansion"
                              bg="white"
                              borderColor="gray.300"
                            />
                          </FormControl>
                        </>
                      )}
                      
                      {/* Description */}
                      <FormControl isRequired>
                        <FormLabel fontWeight="bold">Description</FormLabel>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          bg="white"
                          borderColor="gray.300"
                          placeholder="A brief summary about the loan/investment"
                          rows={4}
                        />
                      </FormControl>
                      
                      {/* Tags Section */}
                      <FormControl>
                        <FormLabel fontWeight="bold">Tags (up to 5)</FormLabel>
                        <HStack mb={2}>
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add tags"
                            borderColor="gray.300"
                          />
                          <Button
                            onClick={() => handleAddTag(tagInput)}
                            isDisabled={tags.length >= 5 || !tagInput}
                            colorScheme="blue"
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
                        <Text mb={2} fontWeight="bold">Suggested Tags:</Text>
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

                      <Button colorScheme="blue" onClick={() => setActiveTabIndex(1)}>
                        Next: Financial Details
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Financial Details Tab */}
                  <TabPanel>
                    <VStack spacing={5} align="start">
                      <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} gap={4} width="100%">
                        {/* Interest Rate */}
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Interest Rate (%)</FormLabel>
                          <NumberInput 
                            min={0} 
                            max={100} 
                            step={0.1} 
                            bg="white"
                            defaultValue={formData.interestRate}
                          >
                            <NumberInputField
                              name="interestRate"
                              value={formData.interestRate}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        {/* Interest Rate Type */}
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Interest Rate Type</FormLabel>
                          <RadioGroup 
                            name="interestRateType" 
                            value={formData.interestRateType} 
                            onChange={(value) => handleInputChange({ target: { name: 'interestRateType', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="fixed">Fixed</Radio>
                              <Radio value="floating">Floating</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>

                        {/* Min Amount */}
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">
                            {formData.planType === "loan" ? "Minimum Loan Amount" : "Minimum Investment"}
                          </FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="minAmount"
                              value={formData.minAmount}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        {/* Max Amount */}
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">
                            {formData.planType === "loan" ? "Maximum Loan Amount" : "Maximum Investment"}
                          </FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="maxAmount"
                              value={formData.maxAmount}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        {/* Tenure */}
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Tenure (months)</FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="tenure"
                              value={formData.tenure}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </Grid>

                      {/* Processing Fee */}
                      {formData.planType === "loan" && (
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Processing Fee</FormLabel>
                          <RadioGroup 
                            name="processingFeeType" 
                            value={formData.processingFeeType} 
                            onChange={(value) => handleInputChange({ target: { name: 'processingFeeType', value }})}
                          >
                            <Stack direction="row" mb={2}>
                              <Radio value="fixed">Fixed Amount</Radio>
                              <Radio value="percentage">Percentage</Radio>
                            </Stack>
                          </RadioGroup>
                          {formData.processingFeeType === 'fixed' ? (
                            <NumberInput min={0} bg="white">
                              <NumberInputField
                                name="processingFeeAmount"
                                value={formData.processingFeeAmount}
                                onChange={handleInputChange}
                                placeholder="Enter fixed amount"
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          ) : (
                            <NumberInput min={0} max={100} bg="white">
                              <NumberInputField
                                name="processingFeePercentage"
                                value={formData.processingFeePercentage}
                                onChange={handleInputChange}
                                placeholder="Enter percentage"
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        </FormControl>
                      )}

                      {formData.planType === "investment" && (
                        <>
                          <Divider my={4} />
                          <Heading size="md" mb={4}>Investment-Specific Details</Heading>
                          
                          <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} gap={4} width="100%">
                            {/* Maturity Calculation */}
                            <FormControl>
                              <FormLabel fontWeight="bold">Interest Calculation</FormLabel>
                              <RadioGroup 
                                name="maturityCalculation" 
                                value={formData.maturityCalculation} 
                                onChange={(value) => handleInputChange({ target: { name: 'maturityCalculation', value }})}
                              >
                                <Stack direction="row">
                                  <Radio value="simple">Simple Interest</Radio>
                                  <Radio value="compound">Compound Interest</Radio>
                                </Stack>
                              </RadioGroup>
                            </FormControl>
                  
                            {/* Compounding Frequency */}
                            {formData.maturityCalculation === "compound" && (
                              <FormControl>
                                <FormLabel fontWeight="bold">Compounding Frequency</FormLabel>
                                <Select
                                  name="compoundingFrequency"
                                  value={formData.compoundingFrequency}
                                  onChange={handleInputChange}
                                  bg="white"
                                  borderColor="gray.300"
                                >
                                  <option value="annually">Annually</option>
                                  <option value="semiannually">Semi-annually</option>
                                  <option value="quarterly">Quarterly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="daily">Daily</option>
                                </Select>
                              </FormControl>
                            )}
                            
                            {/* Projected Returns */}
                            <FormControl>
                              <FormLabel fontWeight="bold">Projected Maturity Value</FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="₹" />
                                <Input 
                                  value={formData.expectedReturns} 
                                  isReadOnly 
                                  bg="gray.50"
                                />
                              </InputGroup>
                              <FormHelperText>
                                Based on min investment amount and interest rate
                              </FormHelperText>
                            </FormControl>
                            
                            {/* Minimum SIP Amount */}
                            <FormControl>
                              <FormLabel fontWeight="bold">Minimum SIP Amount</FormLabel>
                              <NumberInput min={0} bg="white">
                                <NumberInputField
                                  name="minimumSIPAmount"
                                  value={formData.minimumSIPAmount}
                                  onChange={handleInputChange}
                                  borderColor="gray.300"
                                  placeholder="For systematic investments"
                                />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>Monthly systematic investment plan amount</FormHelperText>
                            </FormControl>
                          </Grid>
                  
                          <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} gap={4} width="100%" mt={4}>
                            {/* Redemption Period */}
                            <FormControl>
                              <FormLabel fontWeight="bold">Redemption Period (Days)</FormLabel>
                              <NumberInput min={0} bg="white">
                                <NumberInputField
                                  name="redemptionPeriod"
                                  value={formData.redemptionPeriod}
                                  onChange={handleInputChange}
                                  borderColor="gray.300"
                                />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>Time to process redemption requests</FormHelperText>
                            </FormControl>
                            
                            {/* Exit Load */}
                            <FormControl>
                              <FormLabel fontWeight="bold">Exit Load (%)</FormLabel>
                              <NumberInput min={0} max={100} step={0.01} bg="white">
                                <NumberInputField
                                  name="exitLoad"
                                  value={formData.exitLoad}
                                  onChange={handleInputChange}
                                  borderColor="gray.300"
                                />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>Charges for early redemption</FormHelperText>
                            </FormControl>
                          </Grid>
                          
                          <Box mt={4}>
                            <FormControl>
                              <FormLabel fontWeight="bold">Investment Objective</FormLabel>
                              <Select
                                name="investmentObjective"
                                value={formData.investmentObjective}
                                onChange={handleInputChange}
                                bg="white"
                                borderColor="gray.300"
                              >
                                <option value="growth">Growth</option>
                                <option value="income">Income</option>
                                <option value="balanced">Balanced</option>
                                <option value="taxSaving">Tax Saving</option>
                                <option value="capital">Capital Preservation</option>
                              </Select>
                              <FormHelperText>Primary goal of this investment plan</FormHelperText>
                            </FormControl>
                          </Box>
                          
                          <Box mt={4}>
                            <FormControl>
                              <FormLabel fontWeight="bold">Eligible Investors</FormLabel>
                              <Select
                                name="eligibleInvestors"
                                value={formData.eligibleInvestors}
                                onChange={handleInputChange}
                                bg="white"
                                borderColor="gray.300"
                              >
                                <option value="all">All Investors</option>
                                <option value="retail">Retail Investors Only</option>
                                <option value="hni">High Net Worth Individuals</option>
                                <option value="institutional">Institutional Investors</option>
                                <option value="nri">NRI Investors</option>
                              </Select>
                            </FormControl>
                          </Box>
                          
                          {/* For mutual fund specific fields */}
                          {formData.investmentCategory === "MutualFunds" && (
                            <>
                              <Grid templateColumns={{base: "1fr", md: "1fr 1fr"}} gap={4} width="100%" mt={4}>
                                <FormControl>
                                  <FormLabel fontWeight="bold">Fund Manager</FormLabel>
                                  <Input
                                    name="fundManager"
                                    value={formData.fundManager}
                                    onChange={handleInputChange}
                                    bg="white"
                                    borderColor="gray.300"
                                    placeholder="Name of fund manager"
                                  />
                                </FormControl>
                                
                                <FormControl>
                                  <FormLabel fontWeight="bold">Benchmark Index</FormLabel>
                                  <Input
                                    name="benchmarkIndex"
                                    value={formData.benchmarkIndex}
                                    onChange={handleInputChange}
                                    bg="white"
                                    borderColor="gray.300"
                                    placeholder="e.g., NIFTY 50, BSE SENSEX"
                                  />
                                </FormControl>
                              </Grid>
                              
                              <FormControl mt={4}>
                                <FormLabel fontWeight="bold">Past Performance</FormLabel>
                                <Textarea
                                  name="pastPerformance"
                                  value={formData.pastPerformance}
                                  onChange={handleInputChange}
                                  bg="white"
                                  borderColor="gray.300"
                                  placeholder="e.g., 12% (1Y), 9.5% (3Y), 8.2% (5Y)"
                                  rows={2}
                                />
                                <FormHelperText>Historical returns over different time periods</FormHelperText>
                              </FormControl>
                            </>
                          )}
                          
                          {/* Sector Focus */}
                          <FormControl mt={4}>
                            <FormLabel fontWeight="bold">Sector Focus</FormLabel>
                            <VStack align="start">
                              <Wrap>
                                {["Technology", "Healthcare", "Financial", "Consumer", "Energy", "Industrial", "Utilities", "Real Estate"].map(sector => (
                                  <WrapItem key={sector}>
                                    <Tag 
                                      size="md" 
                                      variant={formData.sectorFocus.includes(sector) ? "solid" : "outline"}
                                      colorScheme="blue"
                                      onClick={() => {
                                        const updatedSectors = formData.sectorFocus.includes(sector) 
                                          ? formData.sectorFocus.filter(s => s !== sector)
                                          : [...formData.sectorFocus, sector];
                                        setFormData(prev => ({...prev, sectorFocus: updatedSectors}));
                                      }}
                                      cursor="pointer"
                                    >
                                      {sector}
                                    </Tag>
                                  </WrapItem>
                                ))}
                              </Wrap>
                              <FormHelperText>Click to select sectors (for equity investments)</FormHelperText>
                            </VStack>
                          </FormControl>
                        </>
                      )}

                      <Button colorScheme="blue" onClick={() => setActiveTabIndex(2)}>
                        Next: Additional Details
                      </Button>
                    </VStack>
                  </TabPanel>

                  {/* Additional Details Tab */}
                  <TabPanel>
                    <VStack spacing={5} align="start">
                      {/* Risk Level */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Risk Level</FormLabel>
                          <Slider
                            name="riskLevel"
                            value={formData.riskLevel}
                            onChange={(value) => handleRangeChange("riskLevel", value)}
                            min={1}
                            max={5}
                            step={0.1}
                            colorScheme="red"
                          >
                            <SliderTrack>
                              <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb boxSize={6}>
                              <Box color="tomato" as={FiAlertTriangle} />
                            </SliderThumb>
                          </Slider>
                          <FormHelperText>Calculated Risk Level: {calculatedRisk}</FormHelperText>
                        </FormControl>
                      )}

                      {/* Flexibility Score */}
                      <FormControl>
                        <FormLabel fontWeight="bold">Flexibility Score</FormLabel>
                        <Slider
                          name="flexibilityScore"
                          value={formData.flexibilityScore}
                          onChange={(value) => handleRangeChange("flexibilityScore", value)}
                          min={1}
                          max={5}
                          step={0.1}
                          colorScheme="green"
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb boxSize={6}>
                            <Box color="green.500" as={FiShield} />
                          </SliderThumb>
                        </Slider>
                        <FormHelperText>Flexibility in terms (1-5)</FormHelperText>
                      </FormControl>

                      {/* Tax Benefits */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Tax Benefits</FormLabel>
                          <RadioGroup 
                            name="taxBenefits" 
                            value={formData.taxBenefits} 
                            onChange={(value) => handleInputChange({ target: { name: 'taxBenefits', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="Yes">Yes</Radio>
                              <Radio value="No">No</Radio>
                            </Stack>
                          </RadioGroup>
                          {formData.taxBenefits === "Yes" && (
                            <Textarea
                              name="taxBenefitDetails"
                              value={formData.taxBenefitDetails}
                              onChange={handleInputChange}
                              bg="white"
                              borderColor="gray.300"
                              placeholder="Provide details about tax benefits"
                              rows={3}
                            />
                          )}
                        </FormControl>
                      )}

                      {/* Minimum Tenure */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Minimum Tenure (months)</FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="minimumTenure"
                              value={formData.minimumTenure}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      )}

                      {/* Early Withdrawal Penalty */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Early Withdrawal Penalty (%)</FormLabel>
                          <NumberInput min={0} max={100} bg="white">
                            <NumberInputField
                              name="earlyWithdrawalPenalty"
                              value={formData.earlyWithdrawalPenalty}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      )}

                      {/* Guarantor Required */}
                      {formData.planType === "loan" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Guarantor Required</FormLabel>
                          <RadioGroup 
                            name="guarantorRequired" 
                            value={formData.guarantorRequired} 
                            onChange={(value) => handleInputChange({ target: { name: 'guarantorRequired', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="Yes">Yes</Radio>
                              <Radio value="No">No</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      )}

                      {/* Collateral Required */}
                      {formData.planType === "loan" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Collateral Required</FormLabel>
                          <RadioGroup 
                            name="collateralRequired" 
                            value={formData.collateralRequired} 
                            onChange={(value) => handleInputChange({ target: { name: 'collateralRequired', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="Yes">Yes</Radio>
                              <Radio value="No">No</Radio>
                            </Stack>
                          </RadioGroup>
                          {formData.collateralRequired === "Yes" && (
                            <NumberInput min={0} max={100} bg="white">
                              <NumberInputField
                                name="collateralPercentage"
                                value={formData.collateralPercentage}
                                onChange={handleInputChange}
                                placeholder="Enter percentage"
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        </FormControl>
                      )}

                      {/* Documentation Required */}
                      <FormControl>
                        <FormLabel fontWeight="bold">Documentation Required</FormLabel>
                        <Textarea
                          name="documentationRequired"
                          value={formData.documentationRequired}
                          onChange={handleInputChange}
                          bg="white"
                          borderColor="gray.300"
                          placeholder="List of required documents"
                          rows={3}
                        />
                      </FormControl>

                      {/* Investment Frequency */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Investment Frequency</FormLabel>
                          <Select
                            name="investmentFrequency"
                            value={formData.investmentFrequency}
                            onChange={handleInputChange}
                            bg="white"
                            borderColor="gray.300"
                          >
                            <option value="onetime">One-time</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                          </Select>
                        </FormControl>
                      )}

                      {/* Payment Frequency */}
                      {formData.planType === "loan" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Payment Frequency</FormLabel>
                          <Select
                            name="paymentFrequency"
                            value={formData.paymentFrequency}
                            onChange={handleInputChange}
                            bg="white"
                            borderColor="gray.300"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                          </Select>
                        </FormControl>
                      )}

                      {/* Insurance Required */}
                      {formData.planType === "loan" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Insurance Required</FormLabel>
                          <RadioGroup 
                            name="isInsuranceRequired" 
                            value={formData.isInsuranceRequired} 
                            onChange={(value) => handleInputChange({ target: { name: 'isInsuranceRequired', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="Yes">Yes</Radio>
                              <Radio value="No">No</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      )}

                      {/* Lock-in Period */}
                      {formData.planType === "investment" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Lock-in Period (months)</FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="lockInPeriod"
                              value={formData.lockInPeriod}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      )}

                      {/* Indemnity Required */}
                      {formData.planType === "loan" && (
                        <FormControl>
                          <FormLabel fontWeight="bold">Indemnity Required</FormLabel>
                          <RadioGroup 
                            name="indemnityRequired" 
                            value={formData.indemnityRequired} 
                            onChange={(value) => handleInputChange({ target: { name: 'indemnityRequired', value }})}
                          >
                            <Stack direction="row">
                              <Radio value="Yes">Yes</Radio>
                              <Radio value="No">No</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      )}

                      {formData.planType === "investment" && (
                        <Box mt={6} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                          <Heading size="sm" mb={4}>Investment Performance Preview</Heading>
                          
                          <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                            <Box>
                              <Text fontWeight="bold" mb={2}>Projected Investment Growth</Text>
                              <VStack align="start" spacing={1}>
                                <HStack justify="space-between" w="100%">
                                  <Text>Initial Investment:</Text>
                                  <Text fontWeight="bold">₹{parseFloat(formData.minAmount || 0).toLocaleString()}</Text>
                                </HStack>
                                <HStack justify="space-between" w="100%">
                                  <Text>Interest Rate:</Text>
                                  <Text fontWeight="bold">{formData.interestRate}%</Text>
                                </HStack>
                                <HStack justify="space-between" w="100%">
                                  <Text>Tenure:</Text>
                                  <Text fontWeight="bold">{formData.tenure} months</Text>
                                </HStack>
                                <Divider my={1} />
                                <HStack justify="space-between" w="100%">
                                  <Text>Expected Returns:</Text>
                                  <Text fontWeight="bold" color="green.600">
                                    ₹{formData.expectedReturns ? parseFloat(formData.expectedReturns).toLocaleString() : "0"}
                                  </Text>
                                </HStack>
                                <HStack justify="space-between" w="100%">
                                  <Text>Estimated Gain:</Text>
                                  <Text fontWeight="bold" color="green.600">
                                    ₹{formData.expectedReturns && formData.minAmount 
                                      ? (parseFloat(formData.expectedReturns) - parseFloat(formData.minAmount)).toLocaleString() 
                                      : "0"}
                                  </Text>
                                </HStack>
                              </VStack>
                            </Box>
                            
                            <Box>
                              <Text fontWeight="bold" mb={2}>Investment Risk Assessment</Text>
                              <VStack align="start" spacing={3} width="100%">
                                <Box width="100%">
                                  <Text mb={1}>Risk Level: <Badge colorScheme={
                                    calculatedRisk < 2 ? "green" : 
                                    calculatedRisk < 3 ? "blue" : 
                                    calculatedRisk < 4 ? "yellow" : 
                                    "red"
                                  }>
                                    {calculatedRisk < 2 ? "Low Risk" :
                                    calculatedRisk < 3 ? "Moderate Risk" :
                                    calculatedRisk < 4 ? "Medium Risk" :
                                    "High Risk"}
                                  </Badge></Text>
                                  <Progress 
                                    value={calculatedRisk * 20} 
                                    colorScheme={
                                      calculatedRisk < 2 ? "green" : 
                                      calculatedRisk < 3 ? "blue" : 
                                      calculatedRisk < 4 ? "yellow" : 
                                      "red"
                                    } 
                                    size="sm" 
                                  />
                                  <Text fontSize="xs" mt={1}>Score: {calculatedRisk}/5</Text>
                                </Box>
                                
                                <Box width="100%">
                                  <Text mb={1}>Flexibility: <Badge colorScheme={
                                    formData.flexibilityScore < 2 ? "red" : 
                                    formData.flexibilityScore < 3 ? "orange" : 
                                    formData.flexibilityScore < 4 ? "blue" : 
                                    "green"
                                  }>
                                    {formData.flexibilityScore < 2 ? "Very Rigid" :
                                    formData.flexibilityScore < 3 ? "Rigid" :
                                    formData.flexibilityScore < 4 ? "Flexible" :
                                    "Very Flexible"}
                                  </Badge></Text>
                                  <Progress 
                                    value={formData.flexibilityScore * 20} 
                                    colorScheme={
                                      formData.flexibilityScore < 2 ? "red" : 
                                      formData.flexibilityScore < 3 ? "orange" : 
                                      formData.flexibilityScore < 4 ? "blue" : 
                                      "green"
                                    } 
                                    size="sm" 
                                  />
                                  <Text fontSize="xs" mt={1}>Score: {formData.flexibilityScore}/5</Text>
                                </Box>
                              </VStack>
                            </Box>
                          </SimpleGrid>
                          
                          <Alert status="info" mt={4} borderRadius="md">
                            <AlertIcon />
                            <Box fontSize="sm">
                              <AlertTitle>Investment Summary</AlertTitle>
                              <AlertDescription>
                                This {formData.investmentCategory || "investment"} plan offers 
                                {formData.interestRate}% {formData.interestRateType} interest rate 
                                with a {formData.minimumTenure || formData.tenure} month minimum tenure. 
                                {formData.taxBenefits === "Yes" ? " It provides tax benefits under the Income Tax Act." : ""}
                              </AlertDescription>
                            </Box>
                          </Alert>
                        </Box>
                      )}

                      {formData.planType === "loan" ? (
                        <Button colorScheme="blue" onClick={() => setActiveTabIndex(3)}>
                          Next: Eligibility Criteria
                        </Button>
                      ) : (
                        <Button 
                          colorScheme="blue" 
                          type="submit" 
                          isLoading={isSubmitting}
                          onClick={handleSubmit}
                        >
                          Submit Investment Plan
                        </Button>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Eligibility Criteria Tab */}
                  {formData.planType === "loan" && (
                    <TabPanel>
                      <VStack spacing={5} align="start">
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Minimum Monthly Income</FormLabel>
                          <NumberInput min={0} bg="white">
                            <NumberInputField
                              name="minMonthlyIncome"
                              value={formData.minMonthlyIncome}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <HStack w="100%">
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Minimum Age</FormLabel>
                            <NumberInput min={18} max={100} bg="white">
                              <NumberInputField
                                name="minAge"
                                value={formData.minAge}
                                onChange={handleInputChange}
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontWeight="bold">Maximum Age</FormLabel>
                            <NumberInput min={18} max={100} bg="white">
                              <NumberInputField
                                name="maxAge"
                                value={formData.maxAge}
                                onChange={handleInputChange}
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        </HStack>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Employment Type</FormLabel>
                          <Select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleInputChange}
                            placeholder="Select Employment Type"
                            bg="white"
                            borderColor="gray.300"
                          >
                            <option value="salaried">Salaried</option>
                            <option value="self-employed">Self-Employed</option>
                            <option value="business">Business Owner</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Minimum CIBIL Score</FormLabel>
                          <NumberInput min={300} max={900} bg="white">
                            <NumberInputField
                              name="cibilScore"
                              value={formData.cibilScore}
                              onChange={handleInputChange}
                              borderColor="gray.300"
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Repayment Schedule</FormLabel>
                          <Select
                            name="repaymentSchedule"
                            value={formData.repaymentSchedule}
                            onChange={handleInputChange}
                            bg="white"
                            borderColor="gray.300"
                          >
                            <option value="monthly">Monthly EMI</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold">Prepayment Options</FormLabel>
                          <RadioGroup 
                            name="prepaymentAllowed" 
                            value={formData.prepaymentAllowed} 
                            onChange={(value) => handleInputChange({ target: { name: 'prepaymentAllowed', value }})}
                          >
                            <Stack direction="row" mb={2}>
                              <Radio value="yes">Allowed</Radio>
                              <Radio value="no">Not Allowed</Radio>
                            </Stack>
                          </RadioGroup>
                          {formData.prepaymentAllowed === 'yes' && (
                            <NumberInput min={0} bg="white">
                              <NumberInputField
                                name="prepaymentCharges"
                                value={formData.prepaymentCharges}
                                onChange={handleInputChange}
                                placeholder="Prepayment Charges (%)"
                                borderColor="gray.300"
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        </FormControl>

                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                          Submit Plan
                        </Button>
                      </VStack>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            )}
          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default AddPlanForm;