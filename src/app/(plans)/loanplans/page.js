"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Checkbox,
  CheckboxGroup,
  Heading,
  Wrap,
  Tag,
  Select,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormLabel,
  Badge,
  Collapse,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  CircularProgress,
  CircularProgressLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  NumberInput,
  NumberInputField,
  Grid,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { FiBookmark, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiAward, FiDollarSign, FiTrendingUp, FiPercent, FiClock, FiShield } from "react-icons/fi";
import Headers from "@/components/Headers";



const LoanEligibility = () => {
  return (
    <Box 
      p={6} 
      bg="white" 
      borderRadius="lg" 
      shadow="lg" 
      mb={8}
    >
      <Heading size="md" mb={4} color="blue.700">Loan Eligibility Guidelines</Heading>
      
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                General Eligibility Criteria
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack spacing={2}>
              <Text>• Age: 21-65 years</Text>
              <Text>• Citizenship: Indian resident</Text>
              <Text>• Credit Score: 700+ for best rates</Text>
              <Text>• Income Stability: Minimum 1 year in current job/business</Text>
              <Text>• Debt-to-Income Ratio: Below 50%</Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                Home Loan Requirements
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack spacing={2}>
              <Text>• Minimum Annual Income: ₹3,00,000</Text>
              <Text>• Maximum Loan-to-Value Ratio: 80-90%</Text>
              <Text>• Property Documentation: Clear title deeds required</Text>
              <Text>• Employment Stability: 2+ years preferred</Text>
              <Text>• Maximum Age at Loan Maturity: 70 years</Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                Personal Loan Requirements
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack spacing={2}>
              <Text>• Minimum Annual Income: ₹2,50,000</Text>
              <Text>• Credit Score: 750+ recommended</Text>
              <Text>• Employment: Salaried or self-employed</Text>
              <Text>• Income-to-EMI Ratio: Maximum 50%</Text>
              <Text>• Existing Relationship: Preferred but not mandatory</Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                Business Loan Requirements
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Stack spacing={2}>
              <Text>• Business Age: Minimum 2 years of operation</Text>
              <Text>• Annual Turnover: Minimum ₹10,00,000</Text>
              <Text>• Financial Documentation: ITR for last 2 years</Text>
              <Text>• Business Registration: Must be properly registered</Text>
              <Text>• Profitability: Business should show consistent profits</Text>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

const Page = () => {
  const [loans, setLoans] = useState([]);
  const [user, setUser] = useState(null);
  const [compareLoans, setCompareLoans] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [recommendedLoans, setRecommendedLoans] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("interestRate");
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending for interest rate (lower is better)
  const [bookmarkedLoans, setBookmarkedLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [creditScoreRange, setCreditScoreRange] = useState([550, 850]);
  const [interestRateRange, setInterestRateRange] = useState([5, 20]);
  const [loanAmountRange, setLoanAmountRange] = useState([100000, 5000000]);
  const [tenureRange, setTenureRange] = useState([12, 360]); // Loan tenures in months
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [processingFeeRange, setProcessingFeeRange] = useState([0, 5]); // Processing fee percentage

  const router = useRouter();
  const toast = useToast();

  // Updated EMI calculation function
  const calculateEMI = (principal, interestRate, tenureMonths) => {
    // Use the loan's minAmount as principal or fall back to a default value
    const loanPrincipal = principal || 100000;
    
    // Safety check for parameters
    if (!interestRate || !tenureMonths || interestRate <= 0 || tenureMonths <= 0) {
      return 0;
    }
    
    // Calculate monthly rate
    const monthlyRate = interestRate / 12 / 100;
    
    // EMI calculation formula
    const emi = loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    // Safety check for valid result
    return isNaN(emi) || !isFinite(emi) ? 0 : emi;
  };

  // Calculate total interest payable
  const calculateTotalInterest = (principal, emi, tenureMonths) => {
    return (emi * tenureMonths) - principal;
  };

  // Calculate loan affordability score (higher is better for borrower)
  const calculateAffordability = (interestRate, processingFee, prepaymentPenalty, flexibilityScore) => {
    const interestWeight = 0.5;
    const processingWeight = 0.2;
    const prepaymentWeight = 0.2;
    const flexibilityWeight = 0.1;
    
    // Lower interest rate means higher affordability (invert the scale)
    const interestScore = ((20 - interestRate) / 15) * 5; // Scale to 0-5
    
    // Lower processing fee means higher affordability
    const processingScore = ((5 - processingFee) / 5) * 5; // Scale to 0-5
    
    // Lower prepayment penalty means higher affordability
    const prepaymentScore = ((5 - prepaymentPenalty) / 5) * 5; // Scale to 0-5
    
    // Weighted average
    return (
      interestScore * interestWeight +
      processingScore * processingWeight +
      prepaymentScore * prepaymentWeight +
      flexibilityScore * flexibilityWeight
    );
  };

  // Calculate loan match score based on user preferences
  const calculateLoanMatchScore = (userPrefs, loanTags) => {
    if (!userPrefs?.length || !loanTags?.length) return 0;

    // Weighting for different preference types
    const weightedPrefs = {
      loanType: 2,
      loanAmount: 1.5,
      interestType: 1.5,
      tenure: 1,
      default: 1,
    };

    // Normalize to lowercase for matching
    const normalizedUserPrefs = userPrefs.map(pref => pref.toLowerCase());
    const normalizedLoanTags = loanTags.map(tag => tag.toLowerCase());

    let weightedIntersection = 0;
    let weightedUnion = 0;

    const allTags = [...new Set([...normalizedUserPrefs, ...normalizedLoanTags])];

    allTags.forEach(tag => {
      const tagType = tag.split(":")[0];
      const weight = weightedPrefs[tagType] || weightedPrefs.default;

      if (normalizedUserPrefs.includes(tag) && normalizedLoanTags.includes(tag)) {
        weightedIntersection += weight;
      }
      
      if (normalizedUserPrefs.includes(tag) || normalizedLoanTags.includes(tag)) {
        weightedUnion += weight;
      }
    });

    // Match score as weighted Jaccard similarity
    return weightedIntersection / weightedUnion;
  };

  // Compare loans to find best options
  const handleCompare = () => {
    if (compareLoans.length < 2) {
      toast({
        title: "Comparison Error",
        description: "Please select at least 2 loans to compare",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Calculate scores for each loan (lower is better for loans)
    const compareAllLoans = compareLoans.map(loan => {
      const calculateScore = (loan) => {
        if (!loan) return 0;

        // For loans, lower values are better for many metrics
        const weights = {
          interestRate: 0.4,
          processingFee: 0.2,
          prepaymentPenalty: 0.15,
          flexibility: 0.15,
          creditRequirement: 0.1,
        };

        // Normalize scores (0-1, where 1 is best)
        const normalizedInterestRate = (20 - loan.interestRate) / 15;
        const normalizedProcessing = (5 - (loan.processingFeeAmount|| 1)) / 5;
        const normalizedPrepayment = (5 - (loan.prepaymentPenalty || 1)) / 5;
        const normalizedFlexibility = (loan.flexibilityScore || 3) / 5;
        const normalizedCredit = (loan.minCreditScore ? (loan.minCreditScore - 550) / 300 : 0.5);

        // Individual scores
        const scores = {
          interestRate: normalizedInterestRate * weights.interestRate,
          processingFee: normalizedProcessing * weights.processingFee,
          prepaymentPenalty: normalizedPrepayment * weights.prepaymentPenalty,
          flexibility: normalizedFlexibility * weights.flexibility,
          creditRequirement: normalizedCredit * weights.creditRequirement
        };

        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        return {
          totalScore,
          scores,
          weights
        };
      };

      const scoreData = calculateScore(loan);

      return {
        loan,
        totalScore: scoreData.totalScore,
        scores: scoreData.scores,
        weights: scoreData.weights
      };
    });

    // Sort by total score (higher is better)
    compareAllLoans.sort((a, b) => b.totalScore - a.totalScore);

    // Add rank
    compareAllLoans.forEach((item, index) => {
      item.rank = index + 1;
    });

    // Generate explanation of comparison
    const generateDetailedReasoning = (bestLoan, otherLoans) => {
      if (!bestLoan || !otherLoans) return [];
      const reasoning = [];

      // Overall summary
      reasoning.push(`${bestLoan.loanName} is the recommended loan option with an overall score of ${(bestLoan.totalScore * 100).toFixed(1)}%.`);
      
      // Compare with other loans
      otherLoans.forEach((otherLoan) => {
        if (!otherLoan) return;
        const comparisons = [];

        if (bestLoan.interestRate < otherLoan.interestRate) {
          comparisons.push(
            `lower interest rate (${bestLoan.interestRate}% vs ${otherLoan.interestRate}%)`
          );
        }
        if (bestLoan.processingFeeAmount< otherLoan.processingFee) {
          comparisons.push(
            `lower processing fee (${bestLoan.processingFee}% vs ${otherLoan.processingFee}%)`
          );
        }
        if (bestLoan.prepaymentPenalty < otherLoan.prepaymentPenalty) {
          comparisons.push(
            `lower prepayment penalty (${bestLoan.prepaymentPenalty}% vs ${otherLoan.prepaymentPenalty}%)`
          );
        }

        if (comparisons.length > 0) {
          reasoning.push(
            `Compared to ${otherLoan.loanName}, it offers ${comparisons.join(", ")}`
          );
        }
      });
      
      // Payment details
      const sampleAmount = bestLoan.minAmount || 100000;
      const emi = calculateEMI(sampleAmount, bestLoan.interestRate, bestLoan.tenure);
      const totalInterest = calculateTotalInterest(sampleAmount, emi, bestLoan.tenure);
      
      reasoning.push(`For a sample loan of ₹${(sampleAmount/100000).toFixed(1)} lakhs over ${bestLoan.tenure} months, the EMI would be approximately ₹${Math.round(emi).toLocaleString()} with total interest of ₹${Math.round(totalInterest).toLocaleString()}.`);
      
      // Add loan-specific advice
      if (bestLoan.loanCategory === "HomeLoans") {
        reasoning.push("This home loan offers competitive rates. Consider negotiating for lower processing fees if you have a good credit score.");
      } else if (bestLoan.loanCategory === "PersonalLoans") {
        reasoning.push("This personal loan has reasonable terms. Remember that personal loans typically carry higher interest rates due to being unsecured.");
      }

      return reasoning;
    };

    const bestLoan = compareAllLoans[0]?.loan;
    const otherLoans = compareAllLoans
      .slice(1)
      .map((item) => item?.loan)
      .filter(Boolean);

    setComparisonResults({
      bestLoan,
      otherLoans,
      reasoning: generateDetailedReasoning(bestLoan, otherLoans),
      scores: compareAllLoans.map(({ loan, totalScore, scores }) => ({
        loanName: loan?.loanName,
        planId: loan?.id,
        totalScore: (totalScore * 100).toFixed(2),
        detailedScores: {
          interestRate: (scores.interestRate * 100).toFixed(2),
          processingFee: (scores.processingFeeAmount* 100).toFixed(2),
          prepaymentPenalty: (scores.prepaymentPenalty * 100).toFixed(2),
          flexibility: (scores.flexibility * 100).toFixed(2),
          creditRequirement: (scores.creditRequirement * 100).toFixed(2),
        }
      })),
      allLoans: compareAllLoans.map(item => item.loan),
    });
  };

  const handleSelectForCompare = (loan) => {
    if (compareLoans.includes(loan)) {
      setCompareLoans((prev) => prev.filter((l) => l !== loan));
    } else if (compareLoans.length >= 4) {
      toast({
        title: "Selection Limit",
        description: "You can compare up to 4 loans at a time",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setCompareLoans((prev) => [...prev, loan]);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch loan plans
  useEffect(() => {
    const fetchLoanPlans = async () => {
      try {
        setLoading(true);
        const loansQuery = query(
          collection(db, "loanplans"),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(loansQuery);

        let fetchedLoans = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          
          // Calculate affordability score
          const affordabilityScore = calculateAffordability(
            data.interestRate || 10,
            data.processingFeeAmount|| 1,
            data.prepaymentPenalty || 2,
            data.flexibilityScore || 3
          );

          // Use the loan's minimum amount for EMI calculation instead of fixed 1,000,000
          const sampleEMI = calculateEMI(
            data.minAmount || 100000, 
            data.interestRate || 10, 
            data.tenure || 60
          );
          
          return {
            id: doc.id,
            ...data,
            affordabilityScore,
            sampleEMI
          };
        });

        const loansWithScores = fetchedLoans.map((loan) => ({
          ...loan,
          matchScore: calculateLoanMatchScore(userPreferences, loan.tags || []),
        }));

        let recommended = loansWithScores
          .sort((a, b) => b.matchScore - a.matchScore)
          .filter((loan) => loan.matchScore > 0.1)
          .slice(0, 5);

        // Fallback: If no recommendations match preferences, show lowest interest rate loans
        if (recommended.length === 0) {
          recommended = fetchedLoans
            .sort((a, b) => a.interestRate - b.interestRate) // For loans, lower interest is better
            .slice(0, 5)
            .map((loan) => ({
              ...loan,
              matchScore: 0,
              isDefaultRecommendation: true,
            }));
        }

        setRecommendedLoans(recommended);
        setLoans(fetchedLoans);
      } catch (error) {
        console.error("Error fetching loans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch loan plans",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLoanPlans();
    }
  }, [user, userPreferences]);

  // Fetch user preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set default preferences if none exist
            const preferences = userData.interests || [
              "loanType:homeLoan",
              "interestType:fixed",
              "tenure:long-term",
            ];
            setUserPreferences(preferences);
          }
        } catch (error) {
          console.error("Error fetching user preferences:", error);
        }
      }
    };

    fetchUserPreferences();
  }, [user]);

  // Load bookmarked loans
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedLoanPlans");
    if (savedBookmarks) {
      setBookmarkedLoans(JSON.parse(savedBookmarks));
    }
  }, []);

  // Handle bookmarking
  const handleBookmark = (loan) => {
    setBookmarkedLoans((prev) => {
      const updatedBookmarks = prev.some((l) => l.id === loan.id)
        ? prev.filter((l) => l.id !== loan.id)
        : [...prev, loan];

      localStorage.setItem("bookmarkedLoanPlans", JSON.stringify(updatedBookmarks));

      toast({
        title: prev.some((l) => l.id === loan.id)
          ? "Loan removed from bookmarks"
          : "Loan added to bookmarks",
        status: prev.some((l) => l.id === loan.id) ? "info" : "success",
        duration: 2000,
        isClosable: true,
      });

      return updatedBookmarks;
    });
  };

  const isBookmarked = (loanId) => {
    return bookmarkedLoans.some((loan) => loan.id === loanId);
  };

  // Fix the filter application logic
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      if (!loans.length) {
        console.log("No loans to filter");
        return;
      }
      
      console.log(`Starting filtering with ${loans.length} loans`);
      let result = [...loans];
      let filtersApplied = false;
      
      // Apply search term filter
      if (searchTerm.trim()) {
        filtersApplied = true;
        const searchLower = searchTerm.toLowerCase();
        const beforeCount = result.length;
        result = result.filter(
          loan => 
            loan.loanName?.toLowerCase().includes(searchLower) ||
            loan.description?.toLowerCase().includes(searchLower) ||
            loan.loanCategory?.toLowerCase().includes(searchLower) ||
            loan.loanSubCategory?.toLowerCase().includes(searchLower)
        );
        console.log(`Search filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply category filter
      if (categoryFilter.length) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(loan => 
          categoryFilter.includes(loan.loanCategory)
        );
        console.log(`Category filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply subcategory filter
      if (subCategoryFilter.length) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(loan => 
          subCategoryFilter.includes(loan.loanSubCategory)
        );
        console.log(`Subcategory filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply credit score range filter - ensure default values don't filter anything
      if (creditScoreRange[0] > 550 || creditScoreRange[1] < 850) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(
          loan => (!loan.minCreditScore || 
            (loan.minCreditScore >= creditScoreRange[0] && 
             loan.minCreditScore <= creditScoreRange[1]))
        );
        console.log(`Credit score filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply interest rate range filter
      if (interestRateRange[0] > 5 || interestRateRange[1] < 20) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(
          loan => loan.interestRate >= interestRateRange[0] && loan.interestRate <= interestRateRange[1]
        );
        console.log(`Interest rate filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply loan amount range filter
      if (loanAmountRange[0] > 100000 || loanAmountRange[1] < 5000000) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(
          loan => (loan.maxAmount >= loanAmountRange[0] || !loan.maxAmount) && 
                 (loan.minAmount <= loanAmountRange[1] || !loan.minAmount)
        );
        console.log(`Loan amount filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Apply tenure range filter
      if (tenureRange[0] > 12 || tenureRange[1] < 360) {
        filtersApplied = true;
        const beforeCount = result.length;
        result = result.filter(
          loan => loan.tenure >= tenureRange[0] && loan.tenure <= tenureRange[1]
        );
        console.log(`Tenure filter applied: ${beforeCount} → ${result.length} loans`);
      }
      
      // Always apply sorting
      result.sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        
        // For interest rate, lower is better for loans
        if (sortBy === "interestRate") {
          return (a[sortBy] - b[sortBy]) * (sortOrder === "asc" ? 1 : -1);
        }
        
        // For affordability score, higher is better
        if (sortBy === "affordabilityScore") {
          return (b[sortBy] - a[sortBy]) * (sortOrder === "desc" ? 1 : -1);
        }
        
        return (a[sortBy] - b[sortBy]) * multiplier;
      });
      
      console.log(`Final filtered result: ${result.length} loans${filtersApplied ? " (filters applied)" : ""}`);
      setFilteredLoans(result);
    };
    
    applyFiltersAndSearch();
  }, [
    loans, 
    searchTerm, 
    categoryFilter, 
    subCategoryFilter, 
    creditScoreRange, 
    interestRateRange, 
    loanAmountRange, 
    tenureRange, 
    processingFeeRange,
    sortBy, 
    sortOrder
  ]);

  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Please log in to view loan plans
      </Alert>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bg="gray.50"
      minHeight="100vh"
    >
      <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      {/* Main Content Area with Sidebar Layout */}
      <Flex 
        width="100%" 
        maxW="1400px" 
        mt="20vh" 
        px={4} 
        gap={6}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* Left Sidebar - Filters */}
        <Box 
          width={{ base: "100%", md: "300px" }} 
          flexShrink={0}
          position={{ base: "static", md: "sticky" }}
          top="20vh"
          alignSelf="flex-start"
        >
          <Box
            bg="white"
            p={5}
            borderRadius="md"
            shadow="md"
            mb={4}
          >
            <Heading size="md" mb={4}>Filter Loan Plans</Heading>
            
            {/* Search Bar */}
            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="#718096" />
              </InputLeftElement>
              <Input
                placeholder="Search loan plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderColor="gray.300"
              />
            </InputGroup>
            
            {/* Sort Options */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>Sort By:</Text>
              <Stack spacing={2}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  size="sm"
                >
                  <option value="interestRate">Interest Rate</option>
                  <option value="processingFee">Processing Fee</option>
                  <option value="affordabilityScore">Affordability Score</option>
                  <option value="tenure">Tenure</option>
                  <option value="minLoanAmount">Minimum Loan Amount</option>
                </Select>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  size="sm"
                >
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </Select>
              </Stack>
            </Box>
            
            {/* Loan Categories Filter */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>Loan Categories</Text>
              <CheckboxGroup
                value={categoryFilter}
                onChange={(values) => {
                  setCategoryFilter(values);
                  setSubCategoryFilter([]); // Reset subcategory when category changes
                }}
              >
                <Stack direction="column" spacing={1}>
                  <Checkbox value="HomeLoans">Home Loans</Checkbox>
                  <Checkbox value="PersonalLoans">Personal Loans</Checkbox>
                  <Checkbox value="EducationLoans">Education Loans</Checkbox>
                  <Checkbox value="CarLoans">Car Loans</Checkbox>
                  <Checkbox value="BusinessLoans">Business Loans</Checkbox>
                  <Checkbox value="AgricultureLoans">Agriculture Loans</Checkbox>
                  <Checkbox value="MortgageLoans">Mortgage Loans</Checkbox>
                  <Checkbox value="GoldLoans">Gold Loans</Checkbox>
                  <Checkbox value="MicroFinance">Microfinance Loans</Checkbox>
                  <Checkbox value="GreenLoans">Green/Sustainability Loans</Checkbox>
                  <Checkbox value="OverdraftLoans">Overdraft & Credit Line</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Box>

            {/* SubCategories Section */}
            {categoryFilter.length > 0 && (
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>Subcategories</Text>
                <CheckboxGroup
                  value={subCategoryFilter}
                  onChange={(values) => setSubCategoryFilter(values)}
                >
                  <Stack direction="column" spacing={1} maxH="200px" overflowY="auto">
                    {categoryFilter.includes("HomeLoans") && (
                      <>
                        {["New Property Purchase", "Resale Property", "Construction", "Renovation", "Land Purchase", 
                          "Home Extension", "Balance Transfer", "Top-up Loan", "Home Improvement", "Joint Home Loan", 
                          "NRI Home Loan", "Luxury Property", "Affordable Housing", "Plot Purchase & Construction"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("PersonalLoans") && (
                      <>
                        {["General Purpose", "Debt Consolidation", "Wedding", "Medical Emergency", "Travel", 
                          "Home Renovation", "Education", "Used Vehicle", "Festivities", "Consumer Durables", 
                          "Family Function", "Emergency Cash", "Professional Development"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("EducationLoans") && (
                      <>
                        {["Undergraduate", "Postgraduate", "Doctoral", "Professional Course", "Study Abroad", 
                          "Skill Development", "Research Programs", "Vocational Training", "Executive Education", 
                          "Online Courses", "School Education", "Competitive Exam Coaching", "Scholar Loans"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("CarLoans") && (
                      <>
                        {["New Car", "Used Car", "Two Wheeler", "Commercial Vehicle", "Electric Vehicle", 
                          "Luxury Vehicle", "Vintage/Classic Car", "Fleet Financing", "Taxi Finance", 
                          "Leasing Options", "Vehicle Refinancing"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("BusinessLoans") && (
                      <>
                        {["Working Capital", "Equipment Purchase", "Expansion", "Startup", "Invoice Financing", 
                          "Merchant Cash Advance", "Commercial Property", "Franchise Financing", "Supply Chain Financing", 
                          "Trade Finance", "Contract Financing", "Agriculture Business", "MSME Loans", "Term Loans"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("AgricultureLoans") && (
                      <>
                        {["Crop Loans", "Farm Mechanization", "Land Development", "Irrigation Systems", "Allied Activities", 
                          "Plantation Crops", "Warehouse Construction", "Cold Storage", "Rural Development", "Horticulture", 
                          "Dairy Farming", "Poultry Farming", "Fisheries"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("MortgageLoans") && (
                      <>
                        {["Fixed-Rate Mortgage", "Adjustable-Rate Mortgage", "Jumbo Loans", "Bridge Loans", "Reverse Mortgage", 
                          "Second Mortgage", "Commercial Mortgage", "Construction-to-Permanent", "Interest-Only Mortgage"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("GoldLoans") && (
                      <>
                        {["Gold Jewelry Loan", "Gold Coin/Bar Loan", "Gold Overdraft", "Agricultural Gold Loan", 
                          "Business Gold Loan", "Personal Gold Loan", "Doorstep Gold Loan"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("MicroFinance") && (
                      <>
                        {["Group Lending", "Individual Microloans", "Joint Liability", "Self-Help Groups", "Income Generation", 
                          "Women Empowerment", "Rural Microfinance", "Urban Microfinance"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("GreenLoans") && (
                      <>
                        {["Solar Panel Financing", "Electric Vehicle", "Energy Efficiency Projects", "Sustainable Agriculture", 
                          "Green Building", "Clean Water Projects", "Renewable Energy", "Eco-Tourism Ventures"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                    {categoryFilter.includes("OverdraftLoans") && (
                      <>
                        {["Salary Overdraft", "Business Overdraft", "Secured Overdraft", "Current Account Overdraft", 
                          "Cash Credit", "Working Capital Demand Loan", "Temporary Overdraft", "Flexible Credit Line"].map(sub => (
                          <Checkbox key={sub} value={sub}>{sub}</Checkbox>
                        ))}
                      </>
                    )}
                  </Stack>
                </CheckboxGroup>
              </Box>
            )}
            
            {/* Credit Score Range */}
            <Box mb={4}>
              <FormLabel>Credit Score</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{creditScoreRange[0]}</Text>
                <RangeSlider
                  aria-label={['min credit', 'max credit']}
                  min={550}
                  max={850}
                  step={10}
                  value={creditScoreRange}
                  onChange={(val) => setCreditScoreRange(val)}
                  colorScheme="blue"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold">{creditScoreRange[1]}</Text>
              </Flex>
            </Box>
            
            {/* Interest Rate Range */}
            <Box mb={4}>
              <FormLabel>Interest Rate (%)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{interestRateRange[0]}</Text>
                <RangeSlider
                  aria-label={['min interest', 'max interest']}
                  min={5}
                  max={20}
                  step={0.5}
                  value={interestRateRange}
                  onChange={(val) => setInterestRateRange(val)}
                  colorScheme="green"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold">{interestRateRange[1]}</Text>
              </Flex>
            </Box>
            
            {/* Loan Amount Range */}
            <Box mb={4}>
              <FormLabel>Loan Amount (₹)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold" fontSize="xs">₹{loanAmountRange[0].toLocaleString()}</Text>
                <RangeSlider
                  aria-label={['min loan', 'max loan']}
                  min={0}
                  max={5000000}
                  step={50000}
                  value={loanAmountRange}
                  onChange={(val) => setLoanAmountRange(val)}
                  colorScheme="purple"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold" fontSize="xs">₹{loanAmountRange[1].toLocaleString()}</Text>
              </Flex>
            </Box>
            
            {/* Tenure Range */}
            <Box mb={4}>
              <FormLabel>Tenure (months)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{tenureRange[0]}</Text>
                <RangeSlider
                  aria-label={['min tenure', 'max tenure']}
                  min={0}
                  max={360}
                  step={12}
                  value={tenureRange}
                  onChange={(val) => setTenureRange(val)}
                  colorScheme="orange"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold">{tenureRange[1]}</Text>
              </Flex>
            </Box>
            
            {/* Advanced Filters Toggle */}
            <Button
              size="sm"
              variant="outline"
              leftIcon={showAdvancedFilters ? <FiChevronUp /> : <FiChevronDown />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              mb={4}
            >
              {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
            </Button>
            
            {/* Advanced Filters */}
            <Collapse in={showAdvancedFilters} animateOpacity>
              <Box p={4} bg="gray.100" borderRadius="md">
                {/* Add any additional advanced filters here */}
                <Text fontWeight="bold" mb={2}>Advanced Filters</Text>
                <Divider mb={4} />
                {/* Example: Filter by Plan Name */}
                <FormLabel>Plan Name</FormLabel>
                <Input
                  placeholder="Enter plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  mb={4}
                />
              </Box>
            </Collapse>

            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<FiFilter />}
              onClick={() => {
                setCategoryFilter([]);
                setSubCategoryFilter([]);
                setSearchTerm("");
                setCreditScoreRange([550, 850]);
                setInterestRateRange([5, 20]);
                setLoanAmountRange([100000, 5000000]);
                setTenureRange([12, 360]);
                setProcessingFeeRange([0, 5]);
                setSortBy("interestRate");
                setSortOrder("asc");
                setShowAdvancedFilters(false);
                // Reset to all loans
                setFilteredLoans(loans);
                
                toast({
                  title: "Filters Reset",
                  description: "All filters have been cleared",
                  status: "info",
                  duration: 2000,
                  isClosable: true,
                });
              }}
              mb={4}
              ml={2}
            >
              Reset All Filters
            </Button>
          </Box>
        </Box>

        {/* Right Content Area - Loan Plans */}
        <Box flex="1">
          {/* Recommended Plans Section */}
          {recommendedLoans.length > 0 && (
            <Box mb={8}>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FiAward} color="gold" mr={2} />
                Recommended for You
                <Badge ml={3} colorScheme="green" fontSize="xs">PERSONALIZED</Badge>
              </Heading>
              <Flex wrap="wrap" gap={4} justify="center">
                {recommendedLoans.map((loan) => (
                  <Box
                    key={loan.id}
                    p={5}
                    borderWidth={1}
                    borderRadius="lg"
                    width={["100%", "calc(50% - 1rem)", "calc(33.33% - 1rem)"]}
                    bg="white"
                    boxShadow="lg"
                    transition="all 0.2s"
                    _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                    position="relative"
                    overflow="hidden"
                    onClick={() => router.push(`/loanplans/${loan.id}`)}
                    cursor="pointer"
                  >
                    {/* Recommendation Badge */}
                    <Box 
                      position="absolute" 
                      top={0} 
                      right={0} 
                      bg={loan.interestRate <= 8 ? "green.500" : "blue.500"}
                      color="white" 
                      px={3} 
                      py={1} 
                      borderBottomLeftRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {loan.interestRate <= 8 ? "BEST RATE" : "RECOMMENDED"}
                    </Box>
                    
                    <IconButton
                      icon={<FiBookmark />}
                      size="sm"
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme={isBookmarked(loan.id) ? "blue" : "gray"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(loan);
                      }}
                      aria-label="Bookmark loan"
                    />
                    
                    <Heading size="md" color="#2C319F" mt={4}>
                      {loan.loanName}
                    </Heading>
                    
                    <Box mt={2} bg="blue.50" p={2} borderRadius="md">
                      <Text fontSize="sm" noOfLines={2} color="gray.700">
                        {loan.description}
                      </Text>
                    </Box>
                    
                    <Grid templateColumns="1fr 1fr" gap={3} mt={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.500">INTEREST RATE</Text>
                        <Flex align="center">
                          <Text fontWeight="bold" fontSize="xl" color={loan.interestRate <= 9 ? "green.600" : loan.interestRate <= 12 ? "orange.500" : "red.500"}>
                            {loan.interestRate}%
                          </Text>
                          {loan.interestRate <= 8 && <Icon as={FiTrendingUp} color="green.500" ml={1} />}
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">LOAN TERM</Text>
                        <Flex align="center">
                          <Text fontWeight="bold" color="blue.600">
                            {loan.tenure <= 12 ? loan.tenure + " mo" : 
                             Math.floor(loan.tenure/12) + (loan.tenure % 12 > 0 ? `.${Math.floor((loan.tenure % 12)/12*10)}` : "") + " yr"}
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">LOAN AMOUNT</Text>
                        <Text fontWeight="bold">
                          ₹{(loan.minAmount || 50000).toLocaleString()}+
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">MONTHLY EMI</Text>
                        <Text fontWeight="bold" color="blue.600">
                          ₹{Math.round(loan.sampleEMI).toLocaleString()}/mo
                        </Text>
                      </Box>
                    </Grid>
                    
                    <Box mt={3} pt={3} borderTopWidth={1} borderColor="gray.100">
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Icon as={FiShield} color="green.500" mr={1} />
                          <Text fontWeight="semibold" color="green.600">
                            Match: {((loan.matchScore || 0) * 100).toFixed(0)}%
                          </Text>
                        </Flex>
                        <Tag size="sm" colorScheme={
                          loan.loanCategory === "HomeLoans" ? "blue" : 
                          loan.loanCategory === "PersonalLoans" ? "green" : 
                          loan.loanCategory === "BusinessLoans" ? "purple" : 
                          "gray"
                        }>
                          {loan.loanCategory?.replace("Loans", "")}
                        </Tag>
                      </Flex>
                    </Box>
                    
                    <Flex mt={4} gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="solid" // Changed to solid for better visibility
                        flexGrow={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/loanplans/${loan.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Button
                        size="sm"
                        colorScheme={compareLoans.includes(loan) ? "red" : "gray"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectForCompare(loan);
                        }}
                        flexGrow={0}
                      >
                        {compareLoans.includes(loan)
                          ? "Remove"
                          : "Compare"}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          {/* Explore All Plans Section - Enhanced */}
          <Box>
            <Heading size="md" mb={4} display="flex" alignItems="center">
              <Icon as={FiSearch} mr={2} />
              Explore All Loan Plans
              <Text ml={2} color="gray.500" fontSize="sm" fontWeight="normal">
                ({filteredLoans.length} results)
              </Text>
            </Heading>

            {filteredLoans.length === 0 ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                No loans match your current filters. Try adjusting your filter criteria.
              </Alert>
            ) : (
              <Flex wrap="wrap" justify="center" gap={4}>
                {filteredLoans.map((loan) => (
                  <Box
                    key={loan.id}
                    p={5}
                    borderWidth={1}
                    borderRadius="lg"
                    width={["100%", "calc(50% - 1rem)", "calc(33.33% - 1rem)"]}
                    bg="white"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                    position="relative"
                    cursor="pointer"
                    onClick={() => router.push(`/loanplans/${loan.id}`)}
                  >
                    {loan.interestRate <= 8 && (
                      <Box 
                        position="absolute" 
                        top={0} 
                        right={0} 
                        bg="green.500" 
                        color="white" 
                        px={3} 
                        py={1} 
                        borderBottomLeftRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        LOW RATE
                      </Box>
                    )}
                    
                    <IconButton
                      icon={<FiBookmark />}
                      size="sm"
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme={isBookmarked(loan.id) ? "blue" : "gray"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(loan);
                      }}
                      aria-label="Bookmark loan"
                      zIndex={1}
                    />
                    
                    <Heading size="md" color="#2C319F" mt={4}>
                      {loan.loanName}
                    </Heading>
                    
                    <Text fontSize="sm" mt={2} noOfLines={2} color="gray.600">
                      {loan.description}
                    </Text>
                    
                    <Grid templateColumns="1fr 1fr" gap={3} mt={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.500">INTEREST RATE</Text>
                        <Flex align="center">
                          <Text 
                            fontWeight="bold" 
                            fontSize="lg"
                            color={loan.interestRate <= 9 ? "green.600" : loan.interestRate <= 12 ? "orange.500" : "red.500"}
                          >
                            {loan.interestRate}%
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">TENURE</Text>
                        <Text fontWeight="bold" color="blue.600">
                          {loan.tenure <= 12 ? 
                            `${loan.tenure} months` : 
                            `${Math.floor(loan.tenure/12)} years${loan.tenure % 12 > 0 ? ` ${loan.tenure % 12} mo` : ''}`}
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">MAX LOAN AMOUNT</Text>
                        <Text fontWeight="bold">
                          ₹{(loan.maxAmount || 1000000).toLocaleString()}
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">MONTHLY EMI</Text>
                        <Text fontWeight="bold" color="blue.600">
                          ₹{Math.round(loan.sampleEMI).toLocaleString()}/mo
                        </Text>
                      </Box>
                    </Grid>
                    
                    <Flex mt={4} justify="space-between" pt={3} borderTopWidth={1} borderColor="gray.100">
                      <Flex align="center">
                        <Text fontSize="xs" mr={1}>Affordability:</Text>
                        <CircularProgress value={loan.affordabilityScore * 20} size="20px" color="green.400" thickness="10px">
                          <CircularProgressLabel fontSize="8px">{Math.round(loan.affordabilityScore)}</CircularProgressLabel>
                        </CircularProgress>
                      </Flex>
                      <Wrap>
                        {loan.tags?.slice(0, 2).map((tag) => (
                          <Tag key={tag} size="sm" colorScheme="blue" fontSize="xs">
                            {tag}
                          </Tag>
                        ))}
                      </Wrap>
                    </Flex>
                    
                    <Flex mt={4} gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="solid"
                        flexGrow={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/loanplans/${loan.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Button
                        size="sm"
                        colorScheme={compareLoans.includes(loan) ? "red" : "gray"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectForCompare(loan);
                        }}
                      >
                        {compareLoans.includes(loan)
                          ? "Remove"
                          : "Compare"}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>

          {/* Compare Button */}
          {compareLoans.length >= 2 && (
            <Button colorScheme="green" mt={6} size="lg" onClick={handleCompare}>
              Compare Selected Loans ({compareLoans.length})
            </Button>
          )}

          {/* Comparison Results */}
          {comparisonResults.bestLoan && (
            <Box
              mt={8}
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="lg"
              width="100%"
              maxW="1200px"
            >
              <Heading size="md" color="blue.600" mb={4}>
                Loan Comparison Results
              </Heading>

              {/* Updated comparison table without processing fee references */}
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th>Loan Detail</Th>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Th key={loan.id}>{loan.loanName}</Th>
                    ))}
                    <Th bg="green.50">{comparisonResults.bestLoan.loanName}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Interest Rate</Td>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Td key={loan.id}>{loan.interestRate}%</Td>
                    ))}
                    <Td bg="green.50">
                      {comparisonResults.bestLoan.interestRate}%
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Monthly EMI</Td>
                    {comparisonResults.otherLoans.map((loan) => {
                      // Use each loan's minimum amount for EMI calculation
                      const emi = calculateEMI(loan.minAmount || 100000, loan.interestRate, loan.tenure);
                      return (
                        <Td key={loan.id}>₹{Math.round(emi).toLocaleString()}</Td>
                      );
                    })}
                    <Td bg="green.50">
                      ₹{Math.round(calculateEMI(comparisonResults.bestLoan.minAmount || 100000, comparisonResults.bestLoan.interestRate, comparisonResults.bestLoan.tenure)).toLocaleString()}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Prepayment Penalty</Td>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Td key={loan.id}>
                        <Tag
                          colorScheme={
                            loan.prepaymentPenalty <= 2
                              ? "green"
                              : loan.prepaymentPenalty <= 4
                              ? "yellow"
                              : "red"
                          }
                        >
                          {loan.prepaymentPenalty || "0"}%
                        </Tag>
                      </Td>
                    ))}
                    <Td bg="green.50">
                      <Tag
                        colorScheme={
                          comparisonResults.bestLoan.prepaymentPenalty <= 2
                            ? "green"
                            : comparisonResults.bestLoan.prepaymentPenalty <= 4
                            ? "yellow"
                            : "red"
                        }
                      >
                        {comparisonResults.bestLoan.prepaymentPenalty || "0"}%
                      </Tag>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Loan Amount Range</Td>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Td key={loan.id}>
                        ₹{loan.minAmount?.toLocaleString() || "50,000"} - ₹{loan.maxAmount?.toLocaleString() || "25,00,000"}
                      </Td>
                    ))}
                    <Td bg="green.50">
                      ₹{comparisonResults.bestLoan.minAmount?.toLocaleString() || "50,000"} - 
                      ₹{comparisonResults.bestLoan.maxAmount?.toLocaleString() || "25,00,000"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Tenure</Td>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Td key={loan.id}>
                        {loan.tenure} months
                        {loan.tenure >= 12 ? ` (${Math.floor(loan.tenure/12)} years)` : ""}
                      </Td>
                    ))}
                    <Td bg="green.50">
                      {comparisonResults.bestLoan.tenure} months
                      {comparisonResults.bestLoan.tenure >= 12 ? ` (${Math.floor(comparisonResults.bestLoan.tenure/12)} years)` : ""}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Category</Td>
                    {comparisonResults.otherLoans.map((loan) => (
                      <Td key={loan.id}>{loan.loanCategory?.replace("Loans", " Loan")}</Td>
                    ))}
                    <Td bg="green.50">{comparisonResults.bestLoan.loanCategory?.replace("Loans", " Loan")}</Td>
                  </Tr>
                  <Tr>
                    <Td>Comparison Score</Td>
                    {comparisonResults.scores.slice(1).map((score) => (
                      <Td key={score.loanName}>{score.totalScore}%</Td>
                    ))}
                    <Td bg="green.50">{comparisonResults.scores[0].totalScore}%</Td>
                  </Tr>
                </Tbody>
              </Table>

              <Box mt={6} p={4} borderRadius="md" bg="blue.50">
                <Heading size="sm" color="blue.700" mb={3}>
                  Detailed Analysis
                </Heading>
                <Stack spacing={2}>
                  {comparisonResults.reasoning.map((reason, index) => (
                    <Text key={index} fontSize="sm">
                      • {reason}
                    </Text>
                  ))}
                </Stack>
              </Box>
            </Box>
          )}

        

          {/* Loan Eligibility Section */}
          <Box mt={8} width="100%" maxW="1200px">
            <LoanEligibility />
          </Box>

          {/* Additional Loan Resources Section */}
          <Box mt={8} p={6} bg="white" borderRadius="lg" shadow="lg" width="100%" maxW="1200px" mb={10}>
            <Heading size="md" mb={5} color="blue.700">Understanding Loan Options</Heading>
            
            <Tabs isFitted variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Types of Loans</Tab>
                <Tab>Interest Rates</Tab>
                <Tab>Documentation</Tab>
                <Tab>Financial Planning</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <Heading size="sm" mb={2}>Secured Loans</Heading>
                      <Text fontSize="sm">
                        Secured by collateral like property or vehicles. Generally offers lower interest rates due to reduced lender risk.
                      </Text>
                    </Box>
                    
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <Heading size="sm" mb={2}>Unsecured Loans</Heading>
                      <Text fontSize="sm">
                        No collateral required, but typically have higher interest rates. Approval based primarily on creditworthiness.
                      </Text>
                    </Box>
                    
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <Heading size="sm" mb={2}>Fixed vs. Variable Rate</Heading>
                      <Text fontSize="sm">
                        Fixed rates remain constant throughout the loan term, while variable rates may fluctuate with market conditions.
                      </Text>
                    </Box>
                  </Grid>
                </TabPanel>
                
                <TabPanel>
                  <Box>
                    <Heading size="sm" mb={3}>Understanding Interest Rates</Heading>
                    <Text mb={4}>
                      Interest rates on loans are determined by several factors including:
                    </Text>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Credit Score Impact</Text>
                        <Text fontSize="sm">Higher scores qualify for lower rates, potentially saving thousands over the loan term.</Text>
                      </Box>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Loan-to-Value Ratio</Text>
                        <Text fontSize="sm">Lower LTV ratios (higher down payments) typically result in better interest rates.</Text>
                      </Box>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Loan Term Effects</Text>
                        <Text fontSize="sm">Shorter terms often have lower rates but higher monthly payments.</Text>
                      </Box>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Market Conditions</Text>
                        <Text fontSize="sm">Economic factors and central bank policies affect base rates for all loans.</Text>
                      </Box>
                    </Grid>
                  </Box>
                </TabPanel>
                
                <TabPanel>
                  <Stack spacing={4}>
                    <Text>Common documents required for loan applications:</Text>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Identity & Address Proof</Text>
                        <Text fontSize="sm">• Aadhaar Card</Text>
                        <Text fontSize="sm">• PAN Card</Text>
                        <Text fontSize="sm">• Passport / Voter ID</Text>
                        <Text fontSize="sm">• Utility Bills</Text>
                      </Box>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <Text fontWeight="medium">Income Documentation</Text>
                        <Text fontSize="sm">• Salary Slips (3-6 months)</Text>
                        <Text fontSize="sm">• Form 16</Text>
                        <Text fontSize="sm">• Income Tax Returns (1-3 years)</Text>
                        <Text fontSize="sm">• Bank Statements (6-12 months)</Text>
                      </Box>
                    </Grid>
                  </Stack>
                </TabPanel>
                
                <TabPanel>
                  <Box>
                    <Text mb={4}>Smart financial planning ensures your loan works with your budget:</Text>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                      <Box p={4} borderRadius="md" bg="blue.50">
                        <Heading size="sm" mb={2}>50/30/20 Rule</Heading>
                        <Text fontSize="sm">
                          Spend 50% on needs (including loan EMIs), 30% on wants, and 20% on savings and investments.
                        </Text>
                      </Box>
                      <Box p={4} borderRadius="md" bg="blue.50">
                        <Heading size="sm" mb={2}>EMI Guidelines</Heading>
                        <Text fontSize="sm">
                          Total EMIs should ideally not exceed 40% of your monthly take-home income.
                        </Text>
                      </Box>
                      <Box p={4} borderRadius="md" bg="blue.50">
                        <Heading size="sm" mb={2}>Emergency Fund</Heading>
                        <Text fontSize="sm">
                          Maintain 3-6 months of expenses (including EMIs) as emergency reserves.
                        </Text>
                      </Box>
                    </Grid>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Footer information */}
          <Box width="100%" bg="gray.100" p={6} mt={8}>
            <Container maxW="container.xl">
              <Text textAlign="center" fontSize="sm" color="gray.600">
                All loan offers are subject to credit approval, eligibility criteria, and terms and conditions. 
                Interest rates may vary based on market conditions and individual credit profiles. 
                Please review all loan documentation carefully before accepting any loan offer.
              </Text>
            </Container>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
