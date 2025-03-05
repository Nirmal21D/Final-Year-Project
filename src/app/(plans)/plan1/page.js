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
import Headers from "@/components/Headers";
import { FiBookmark, FiSearch, FiFilter, FiChevronDown, FiChevronUp, FiAward, FiDollarSign, FiTrendingUp, FiShield, FiClock } from "react-icons/fi";

const Page = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [comparePlans, setComparePlans] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [recommendedPlans, setRecommendedPlans] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("interestRate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [bookmarkedPlans, setBookmarkedPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [riskRange, setRiskRange] = useState([1, 5]);
  const [interestRateRange, setInterestRateRange] = useState([0, 20]);
  const [investmentRange, setInvestmentRange] = useState([0, 500000]);
  const [tenureRange, setTenureRange] = useState([0, 120]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const router = useRouter();
  const toast = useToast();

  // Enhanced CAGR calculation with compound interest
  const calculateCAGR = (interestRate, tenureMonths) => {
    const years = tenureMonths / 12;
    const monthlyRate = interestRate / 12 / 100;
    const periods = tenureMonths;
    const finalValue = (1 + monthlyRate) ** periods;
    return (finalValue ** (1 / years) - 1) * 100;
  };

  // Enhanced risk calculation with weighted factors
  const calculateRisk = (interestRate, tenure, minAmount) => {
    const interestWeight = 0.4;
    const tenureWeight = 0.35;
    const investmentWeight = 0.25;

    const riskFromInterest =
      (interestRate > 15
        ? 5
        : interestRate > 12
        ? 4
        : interestRate > 9
        ? 3
        : interestRate > 6
        ? 2
        : 1) * interestWeight;
    const riskFromTenure =
      (tenure > 120
        ? 5
        : tenure > 60
        ? 4
        : tenure > 36
        ? 3
        : tenure > 12
        ? 2
        : 1) * tenureWeight;
    const riskFromInvestment =
      (minAmount > 500000
        ? 5
        : minAmount > 100000
        ? 4
        : minAmount > 50000
        ? 3
        : minAmount > 10000
        ? 2
        : 1) * investmentWeight;

    return (
      Math.round((riskFromInterest + riskFromTenure + riskFromInvestment) * 2) /
      2
    );
  };

  // Improved similarity calculation with more flexible matching
  const calculateSimilarity = (userTags, planTags) => {
    if (!userTags?.length || !planTags?.length) return 0;

    const weightedTags = {
      riskLevel: 2,
      investmentCategory: 2,
      investmentGoal: 1.5,
      default: 1,
    };

    // Convert tags to lowercase for case-insensitive matching
    const normalizedUserTags = userTags.map((tag) => tag.toLowerCase());
    const normalizedPlanTags = planTags.map((tag) => tag.toLowerCase());

    let weightedIntersection = 0;
    let weightedUnion = 0;

    const allTags = [
      ...new Set([...normalizedUserTags, ...normalizedPlanTags]),
    ];

    allTags.forEach((tag) => {
      const tagType = tag.split(":")[0];
      const weight = weightedTags[tagType] || weightedTags.default;

      if (
        normalizedUserTags.includes(tag) &&
        normalizedPlanTags.includes(tag)
      ) {
        weightedIntersection += weight;
      }
      if (
        normalizedUserTags.includes(tag) ||
        normalizedPlanTags.includes(tag)
      ) {
        weightedUnion += weight;
      }
    });

    // Add partial matching bonus
    const partialMatchBonus = normalizedUserTags.reduce((bonus, userTag) => {
      const hasPartialMatch = normalizedPlanTags.some(
        (planTag) => planTag.includes(userTag) || userTag.includes(planTag)
      );
      return bonus + (hasPartialMatch ? 0.1 : 0);
    }, 0);

    return weightedIntersection / weightedUnion + partialMatchBonus;
  };

  // Enhanced comparison logic with more detailed analysis
  const handleCompare = () => {
    if (comparePlans.length < 2) {
      toast({
        title: "Comparison Error",
        description: "Please select at least 2 plans to compare",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const compareAllPlans = comparePlans.map((plan) => {
      const calculateScore = (plan) => {
        if (!plan) return 0;

        const weights = {
          roi: 0.35,
          cagr: 0.25,
          risk: 0.2,
          tenure: 0.1,
          minAmount: 0.1,
        };

        const normalizedROI = plan.interestRate / 20;
        const normalizedCAGR = plan.cagr / 20;
        const normalizedRisk = (5 - plan.riskLevel) / 5;
        const normalizedTenure = Math.min(plan.tenure, 120) / 120;
        const normalizedInvestment =
          1 - Math.min(plan.minAmount || 0, 500000) / 500000;

        // Calculate individual scores for detailed breakdown
        const scores = {
          roi: normalizedROI * weights.roi,
          cagr: normalizedCAGR * weights.cagr,
          risk: normalizedRisk * weights.risk,
          tenure: normalizedTenure * weights.tenure,
          minAmount: normalizedInvestment * weights.minAmount,
        };

        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        return {
          totalScore,
          scores,
          weights
        };
      };

      const scoreData = calculateScore(plan);

      return {
        plan,
        totalScore: scoreData.totalScore,
        scores: scoreData.scores,
        weights: scoreData.weights
      };
    });

    compareAllPlans.sort((a, b) => b.totalScore - a.totalScore);

    // Add rank to each plan
    compareAllPlans.forEach((item, index) => {
      item.rank = index + 1;
    });

    const generateDetailedReasoning = (bestPlan, otherPlans) => {
      if (!bestPlan || !otherPlans) return [];
      const reasoning = [];

      // Overall summary
      reasoning.push(`${bestPlan.planName} is the recommended option with an overall score of ${(bestPlan.totalScore * 100).toFixed(1)}%.`);
      
      // Add specific advantages
      otherPlans.forEach((otherPlan) => {
        if (!otherPlan) return;
        const comparisons = [];

        if (bestPlan.interestRate > otherPlan.interestRate) {
          comparisons.push(
            `higher interest rate (${bestPlan.interestRate}% vs ${otherPlan.interestRate}%)`
          );
        }
        if (bestPlan.cagr > otherPlan.cagr) {
          comparisons.push(
            `better CAGR (${bestPlan.cagr.toFixed(2)}% vs ${otherPlan.cagr.toFixed(2)}%)`
          );
        }
        if (bestPlan.riskLevel < otherPlan.riskLevel) {
          comparisons.push(
            `lower risk (${bestPlan.riskLevel} vs ${otherPlan.riskLevel})`
          );
        }
        if (
          bestPlan.minAmount &&
          otherPlan.minAmount &&
          bestPlan.minAmount < otherPlan.minAmount
        ) {
          comparisons.push(
            `lower minimum investment (₹${bestPlan.minAmount.toLocaleString()} vs ₹${otherPlan.minAmount.toLocaleString()})`
          );
        }

        if (comparisons.length > 0) {
          reasoning.push(
            `Compared to ${otherPlan.planName}, it offers ${comparisons.join(", ")}`
          );
        }
      });
      
      // Add investment advice based on risk
      if (bestPlan.riskLevel <= 2) {
        reasoning.push("This is a conservative investment option, suitable for risk-averse investors or short-term goals.");
      } else if (bestPlan.riskLevel <= 3.5) {
        reasoning.push("This is a balanced investment option, suitable for moderate risk tolerance or medium-term goals.");
      } else {
        reasoning.push("This is an aggressive investment option, suitable for high risk tolerance or long-term goals.");
      }

      return reasoning;
    };

    const bestPlan = compareAllPlans[0]?.plan;
    const otherPlans = compareAllPlans
      .slice(1)
      .map((item) => item?.plan)
      .filter(Boolean);

    setComparisonResults({
      bestPlan,
      otherPlans,
      reasoning: generateDetailedReasoning(bestPlan, otherPlans),
      scores: compareAllPlans.map(({ plan, totalScore, scores }) => ({
        planName: plan?.planName,
        planId: plan?.id,
        totalScore: (totalScore * 100).toFixed(2),
        detailedScores: {
          roi: (scores.roi * 100).toFixed(2),
          cagr: (scores.cagr * 100).toFixed(2),
          risk: (scores.risk * 100).toFixed(2),
          tenure: (scores.tenure * 100).toFixed(2),
          minAmount: (scores.minAmount * 100).toFixed(2),
        }
      })),
      allPlans: compareAllPlans.map(item => item.plan),
    });
  };

  const handleSelectForCompare = (plan) => {
    if (comparePlans.includes(plan)) {
      setComparePlans((prev) => prev.filter((p) => p !== plan));
    } else if (comparePlans.length >= 4) {
      toast({
        title: "Selection Limit",
        description: "You can compare up to 4 plans at a time",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setComparePlans((prev) => [...prev, plan]);
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

  // Improved plan fetching with recommendations
  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        setLoading(true);
        const plansQuery = query(
          collection(db, "investmentplans"),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(plansQuery);

        let fetchedPlans = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const cagr = calculateCAGR(data.interestRate, data.tenure);
          const riskLevel = calculateRisk(
            data.interestRate,
            data.tenure,
            data.minAmount
          );

          return {
            id: doc.id,
            ...data,
            cagr,
            riskLevel,
          };
        });

        // Apply filters
        if (categoryFilter.length) {
          fetchedPlans = fetchedPlans.filter((plan) =>
            categoryFilter.includes(plan.investmentCategory)
          );
        }

        if (subCategoryFilter.length) {
          fetchedPlans = fetchedPlans.filter((plan) =>
            subCategoryFilter.includes(plan.investmentSubCategory)
          );
        }

        // Apply sorting
        fetchedPlans.sort((a, b) => {
          const multiplier = sortOrder === "desc" ? -1 : 1;
          return (a[sortBy] - b[sortBy]) * multiplier;
        });

        setPlans(fetchedPlans);

        // Update recommendations if user has interests
        if (userTags.length > 0) {
          const plansWithScores = fetchedPlans.map((plan) => ({
            ...plan,
            similarityScore: calculateSimilarity(userTags, plan.tags || []),
          }));

          let recommended = plansWithScores
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .filter((plan) => plan.similarityScore > 0.1) // Lowered threshold
            .slice(0, 5);

          // Fallback: If no recommendations based on interests, show top rated plans
          if (recommended.length === 0) {
            recommended = fetchedPlans
              .sort((a, b) => b.interestRate - a.interestRate)
              .slice(0, 5)
              .map((plan) => ({
                ...plan,
                similarityScore: 0,
                isDefaultRecommendation: true,
              }));
          }

          setRecommendedPlans(recommended);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error",
          description: "Failed to fetch investment plans",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchInvestmentPlans();
    }
  }, [user, categoryFilter, subCategoryFilter, sortBy, sortOrder, userTags]);

  // Improved user interests fetching
  useEffect(() => {
    const fetchUserInterests = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set default interests if none exist
            const interests = userData.interests || [
              "lowRisk",
              "mediumTerm",
              "regular-income",
            ];
            setUserTags(interests);
          }
        } catch (error) {
          console.error("Error fetching user interests:", error);
          toast({
            title: "Error",
            description: "Failed to fetch user preferences",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    fetchUserInterests();
  }, [user]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedPlans");
    if (savedBookmarks) {
      setBookmarkedPlans(JSON.parse(savedBookmarks));
    }
  }, []);

  const handleBookmark = (plan) => {
    setBookmarkedPlans((prev) => {
      const updatedBookmarks = prev.some((p) => p.id === plan.id)
        ? prev.filter((p) => p.id !== plan.id)
        : [...prev, plan];

      localStorage.setItem("bookmarkedPlans", JSON.stringify(updatedBookmarks));

      toast({
        title: prev.some((p) => p.id === plan.id)
          ? "Plan removed from booklist"
          : "Plan added to booklist",
        status: prev.some((p) => p.id === plan.id) ? "info" : "success",
        duration: 2000,
        isClosable: true,
      });

      return updatedBookmarks;
    });
  };

  // Add this useEffect to apply all filters and search
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      if (!plans.length) return;
      
      let result = [...plans];
      
      // Apply search term filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(
          plan => 
            plan.planName?.toLowerCase().includes(searchLower) ||
            plan.description?.toLowerCase().includes(searchLower) ||
            plan.investmentCategory?.toLowerCase().includes(searchLower) ||
            plan.investmentSubCategory?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply category filter
      if (categoryFilter.length) {
        result = result.filter(plan => 
          categoryFilter.includes(plan.investmentCategory)
        );
      }
      
      // Apply subcategory filter
      if (subCategoryFilter.length) {
        result = result.filter(plan => 
          subCategoryFilter.includes(plan.investmentSubCategory)
        );
      }
      
      // Apply risk range filter
      result = result.filter(
        plan => plan.riskLevel >= riskRange[0] && plan.riskLevel <= riskRange[1]
      );
      
      // Apply interest rate range filter
      result = result.filter(
        plan => plan.interestRate >= interestRateRange[0] && plan.interestRate <= interestRateRange[1]
      );
      
      // Apply minimum investment range filter
      result = result.filter(
        plan => (!plan.minAmount || 
          (plan.minAmount >= investmentRange[0] && 
           plan.minAmount <= investmentRange[1]))
      );
      
      // Apply tenure range filter (in months)
      result = result.filter(
        plan => plan.tenure >= tenureRange[0] && plan.tenure <= tenureRange[1]
      );
      
      // Apply sorting
      result.sort((a, b) => {
        const multiplier = sortOrder === "desc" ? -1 : 1;
        return (a[sortBy] - b[sortBy]) * multiplier;
      });
      
      setFilteredPlans(result);
      
      // Update recommendations if user has interests
      if (userTags.length > 0) {
        const plansWithScores = result.map((plan) => ({
          ...plan,
          similarityScore: calculateSimilarity(userTags, plan.tags || []),
        }));

        let recommended = plansWithScores
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .filter((plan) => plan.similarityScore > 0.1)
          .slice(0, 5);

        // Fallback if no recommendations match the criteria
        if (recommended.length === 0) {
          recommended = result
            .sort((a, b) => b.interestRate - a.interestRate)
            .slice(0, 5)
            .map((plan) => ({
              ...plan,
              similarityScore: 0,
              isDefaultRecommendation: true,
            }));
        }

        setRecommendedPlans(recommended);
      }
    };
    
    applyFiltersAndSearch();
  }, [
    plans, 
    searchTerm, 
    categoryFilter, 
    subCategoryFilter, 
    riskRange, 
    interestRateRange, 
    investmentRange, 
    tenureRange, 
    sortBy, 
    sortOrder, 
    userTags
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
        Please log in to view investment plans
      </Alert>
    );
  }

  return (
    <Box
      id="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bg="gray.50"
      minHeight="100vh"
    >
      <Box id="upper" position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
        <Flex justify="space-between" align="center" p={4}>
          <Box></Box>
          <Stack direction="row" spacing={4} align="center" mt="2">
            <IconButton
              icon={<FiBookmark size={24} color="white" />}
              onClick={() => router.push("/booklist")}
              colorScheme="blue"
              aria-label="Go to Booklist"
            />
          </Stack>
        </Flex>
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
            <Heading size="md" mb={4}>Filter Plans</Heading>
            
            {/* Search Bar */}
            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="#718096" />
              </InputLeftElement>
              <Input
                placeholder="Search plans..."
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
                  <option value="cagr">CAGR</option>
                  <option value="riskLevel">Risk Level</option>
                  <option value="minAmount">Minimum Investment</option>
                </Select>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  size="sm"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </Select>
              </Stack>
            </Box>
            
            {/* Categories Filter */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>Categories</Text>
              <CheckboxGroup
                value={categoryFilter}
                onChange={(values) => setCategoryFilter(values)}
              >
                <Stack direction="column" spacing={1}>
                  <Checkbox value="Bonds">Bonds</Checkbox>
                  <Checkbox value="MutualFunds">Mutual Funds</Checkbox>
                  <Checkbox value="FixedDeposits">Fixed Deposits</Checkbox>
                  <Checkbox value="GoldInvestments">Gold Investments</Checkbox>
                  <Checkbox value="ProvidentFunds">Provident Funds</Checkbox>
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
                  <Stack direction="column" spacing={1}>
                    {/* Your subcategory options */}
                  </Stack>
                </CheckboxGroup>
              </Box>
            )}
            
            {/* Risk Level Range */}
            <Box mb={4}>
              <FormLabel>Risk Level Range</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{riskRange[0]}</Text>
                <RangeSlider
                  aria-label={['min risk', 'max risk']}
                  min={1}
                  max={5}
                  step={0.5}
                  value={riskRange}
                  onChange={(val) => setRiskRange(val)}
                  colorScheme="blue"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold">{riskRange[1]}</Text>
              </Flex>
            </Box>
            
            {/* Interest Rate Range */}
            <Box mb={4}>
              <FormLabel>Interest Rate (%)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{interestRateRange[0]}</Text>
                <RangeSlider
                  aria-label={['min interest', 'max interest']}
                  min={0}
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
            
            {/* Minimum Investment Range */}
            <Box mb={4}>
              <FormLabel>Minimum Investment (₹)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold" fontSize="xs">₹{investmentRange[0].toLocaleString()}</Text>
                <RangeSlider
                  aria-label={['min investment', 'max investment']}
                  min={0}
                  max={500000}
                  step={5000}
                  value={investmentRange}
                  onChange={(val) => setInvestmentRange(val)}
                  colorScheme="purple"
                  flex="1"
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <Text ml={2} fontWeight="bold" fontSize="xs">₹{investmentRange[1].toLocaleString()}</Text>
              </Flex>
            </Box>
            
            {/* Tenure Range */}
            <Box mb={4}>
              <FormLabel>Tenure (Months)</FormLabel>
              <Flex align="center">
                <Text mr={2} fontWeight="bold">{tenureRange[0]}</Text>
                <RangeSlider
                  aria-label={['min tenure', 'max tenure']}
                  min={0}
                  max={120}
                  step={1}
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
            
            <Button 
              colorScheme="gray" 
              width="100%"
              onClick={() => {
                setRiskRange([1, 5]);
                setInterestRateRange([0, 20]);
                setInvestmentRange([0, 500000]);
                setTenureRange([0, 120]);
                setSearchTerm("");
                setCategoryFilter([]);
                setSubCategoryFilter([]);
              }}
              mb={2}
            >
              Reset All Filters
            </Button>
            
            <Text color="gray.600" fontSize="sm" textAlign="center">
              Showing {filteredPlans.length} of {plans.length} plans
            </Text>
          </Box>
        </Box>

        {/* Right Content Area */}
        <Box flex="1">
          {/* Recommended Plans Section */}
          {recommendedPlans.length > 0 && (
            <Box width="100%" mb={8}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="lg">Recommended for You</Heading>
                {recommendedPlans[0]?.isDefaultRecommendation && (
                  <Text fontSize="sm" color="gray.600">
                    Based on top-rated plans
                  </Text>
                )}
              </Flex>
              <Flex wrap="wrap" gap={4} justify="flex-start">
                {recommendedPlans.map((plan) => (
                  <Box
                    key={plan.id}
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
                    onClick={() => router.push(`/plan1/${plan.id}`)}
                    cursor="pointer"
                  >
                    {/* Recommendation Badge */}
                    <Box 
                      position="absolute" 
                      top={0} 
                      right={0} 
                      bg={plan.interestRate >= 12 ? "green.500" : "blue.500"}
                      color="white" 
                      px={3} 
                      py={1} 
                      borderBottomLeftRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {plan.interestRate >= 12 ? "HIGH YIELD" : "RECOMMENDED"}
                    </Box>
                    
                    <IconButton
                      icon={<FiBookmark />}
                      size="sm"
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme={
                        bookmarkedPlans.some((p) => p.id === plan.id)
                          ? "blue"
                          : "gray"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(plan);
                      }}
                      aria-label="Bookmark plan"
                    />
                    
                    <Heading size="md" color="#2C319F" mt={4}>
                      {plan.planName}
                    </Heading>
                    
                    <Box mt={2} bg="blue.50" p={2} borderRadius="md">
                      <Text fontSize="sm" noOfLines={2} color="gray.700">
                        {plan.description}
                      </Text>
                    </Box>
                    
                    <Grid templateColumns="1fr 1fr" gap={3} mt={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.500">INTEREST RATE</Text>
                        <Flex align="center">
                          <Text fontWeight="bold" fontSize="xl" color={plan.interestRate >= 12 ? "green.600" : plan.interestRate >= 9 ? "orange.500" : "blue.500"}>
                            {plan.interestRate}%
                          </Text>
                          {plan.interestRate >= 12 && <Icon as={FiTrendingUp} color="green.500" ml={1} />}
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">TENURE</Text>
                        <Flex align="center">
                          <Text fontWeight="bold" color="blue.600">
                            {plan.tenure <= 12 ? plan.tenure + " mo" : 
                             Math.floor(plan.tenure/12) + (plan.tenure % 12 > 0 ? `.${Math.floor((plan.tenure % 12)/12*10)}` : "") + " yr"}
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">MIN INVESTMENT</Text>
                        <Text fontWeight="bold">
                          ₹{(plan.minAmount || 10000).toLocaleString()}
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">CAGR</Text>
                        <Text fontWeight="bold" color="purple.600">
                          {plan.cagr?.toFixed(2)}%
                        </Text>
                      </Box>
                    </Grid>
                    
                    <Box mt={3} pt={3} borderTopWidth={1} borderColor="gray.100">
                      <Flex justify="space-between" align="center">
                        <Flex align="center">
                          <Text fontSize="xs" mr={1}>Risk Level:</Text>
                          <Tag
                            size="sm"
                            colorScheme={
                              plan.riskLevel <= 2 ? "green" : 
                              plan.riskLevel <= 3.5 ? "yellow" : "red"
                            }
                          >
                            {plan.riskLevel}
                          </Tag>
                        </Flex>
                        {!plan.isDefaultRecommendation && (
                          <Text fontWeight="semibold" color="green.600" fontSize="xs">
                            Match: {(plan.similarityScore * 100).toFixed(0)}%
                          </Text>
                        )}
                      </Flex>
                    </Box>
                    
                    <Flex mt={4} gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="solid"
                        flexGrow={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/plan1/${plan.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Button
                        size="sm"
                        colorScheme={comparePlans.includes(plan) ? "red" : "gray"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectForCompare(plan);
                        }}
                        flexGrow={0}
                      >
                        {comparePlans.includes(plan) ? "Remove" : "Compare"}
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}

          {/* Main Plans Grid */}
          <Box>
            <Heading size="lg" mb={4}>
              Explore All Plans {filteredPlans.length < plans.length && 
                <Badge ml={2} colorScheme="blue">{filteredPlans.length} of {plans.length}</Badge>}
            </Heading>
            <Flex
              wrap="wrap"
              justify="flex-start"
              gap={4}
              width="100%"
            >
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <Box
                    key={plan.id}
                    position="relative"
                    p={5}
                    borderWidth={1}
                    borderRadius="lg"
                    width={["100%", "calc(50% - 1rem)", "calc(33.33% - 1rem)"]}
                    bg="white"
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
                    cursor="pointer"
                    onClick={() => router.push(`/plan1/${plan.id}`)}
                    mb={4}
                  >
                    {plan.interestRate >= 12 && (
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
                        HIGH YIELD
                      </Box>
                    )}
                    
                    <IconButton
                      icon={<FiBookmark />}
                      size="sm"
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme={
                        bookmarkedPlans.some((p) => p.id === plan.id)
                          ? "blue"
                          : "gray"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(plan);
                      }}
                      aria-label="Bookmark plan"
                      zIndex={1}
                    />
                    
                    <Heading size="md" color="#2C319F" mt={4}>
                      {plan.planName}
                    </Heading>
                    
                    <Text fontSize="sm" mt={2} noOfLines={2} color="gray.600">
                      {plan.description}
                    </Text>
                    
                    <Grid templateColumns="1fr 1fr" gap={3} mt={4}>
                      <Box>
                        <Text fontSize="xs" color="gray.500">INTEREST RATE</Text>
                        <Flex align="center">
                          <Text 
                            fontWeight="bold" 
                            fontSize="lg"
                            color={plan.interestRate >= 12 ? "green.600" : plan.interestRate >= 9 ? "orange.500" : "blue.600"}
                          >
                            {plan.interestRate}%
                          </Text>
                        </Flex>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">TENURE</Text>
                        <Text fontWeight="bold" color="blue.600">
                          {plan.tenure <= 12 ? 
                            `${plan.tenure} months` : 
                            `${Math.floor(plan.tenure/12)} years${plan.tenure % 12 > 0 ? ` ${plan.tenure % 12} mo` : ''}`}
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">MIN INVESTMENT</Text>
                        <Text fontWeight="bold">
                          ₹{(plan.minAmount || 10000).toLocaleString()}
                        </Text>
                      </Box>
                      
                      <Box>
                        <Text fontSize="xs" color="gray.500">CAGR</Text>
                        <Text fontWeight="bold" color="purple.600">
                          {plan.cagr?.toFixed(2)}%
                        </Text>
                      </Box>
                    </Grid>
                    
                    <Flex mt={4} justify="space-between" pt={3} borderTopWidth={1} borderColor="gray.100">
                      <Flex align="center">
                        <Text fontSize="xs" mr={1}>Risk Level:</Text>
                        <Tag
                          size="sm"
                          colorScheme={
                            plan.riskLevel <= 2 ? "green" : 
                            plan.riskLevel <= 3.5 ? "yellow" : "red"
                          }
                        >
                          {plan.riskLevel}
                        </Tag>
                      </Flex>
                      <Wrap>
                        {plan.tags?.slice(0, 2).map((tag) => (
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
                          router.push(`/plan1/${plan.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Button
                        size="sm"
                        colorScheme={comparePlans.includes(plan) ? "red" : "gray"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectForCompare(plan);
                        }}
                      >
                        {comparePlans.includes(plan) ? "Remove" : "Compare"}
                      </Button>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Box width="100%" textAlign="center" py={10}>
                  <Text fontSize="xl" color="gray.500">No investment plans match your filters</Text>
                  <Button mt={4} onClick={() => {
                    setRiskRange([1, 5]);
                    setInterestRateRange([0, 20]);
                    setInvestmentRange([0, 500000]);
                    setTenureRange([0, 120]);
                    setSearchTerm("");
                    setCategoryFilter([]);
                    setSubCategoryFilter([]);
                  }}>
                    Reset All Filters
                  </Button>
                </Box>
              )}
            </Flex>
          </Box>

          {/* Comparison Button */}
          {comparePlans.length >= 2 && (
            <Box textAlign="center" my={8}>
              <Button
                colorScheme="green"
                size="lg"
                onClick={handleCompare}
              >
                Compare Selected Plans ({comparePlans.length})
              </Button>
            </Box>
          )}

          {/* Comparison Results */}
          {comparisonResults.bestPlan && (
            <Box
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="lg"
              width="100%"
              mb={8}
            >
              <Heading size="md" color="blue.600" mb={4}>
                Plan Comparison Results
              </Heading>
              
              {/* Top recommendation highlight */}
              <Box 
                p={4} 
                bg="green.50" 
                borderRadius="md" 
                mb={6}
                borderLeft="4px solid" 
                borderColor="green.500"
              >
                <Flex align="center" gap={3}>
                  <FiAward size="24px" color="#38A169" />
                  <Heading size="md">
                    Top Recommendation: {comparisonResults.bestPlan.planName}
                  </Heading>
                </Flex>
                <Text mt={2} color="green.700">
                  Overall Score: {comparisonResults.scores[0].totalScore}%
                </Text>
              </Box>
          
              {/* Score overview */}
              <Box mb={6}>
                <Heading size="sm" mb={4}>Performance Comparison</Heading>
                <Flex justify="space-between" wrap="wrap" gap={4}>
                  {comparisonResults.scores.map((score, index) => (
                    <Box 
                      key={score.planId} 
                      p={4} 
                      borderWidth={1}
                      borderRadius="md"
                      width={["100%", "48%", "30%"]}
                      bg={index === 0 ? "green.50" : "white"}
                      borderColor={index === 0 ? "green.200" : "gray.200"}
                    >
                      <Heading size="sm">{score.planName}</Heading>
                      <CircularProgress 
                        value={parseFloat(score.totalScore)} 
                        color={index === 0 ? "green.500" : "blue.500"} 
                        size="100px"
                        thickness="8px"
                        mt={3}
                      >
                        <CircularProgressLabel>{score.totalScore}%</CircularProgressLabel>
                      </CircularProgress>
                      
                      <Text mt={3} fontSize="sm" fontWeight="bold">
                        Rank: #{index + 1}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Box>
          
              {/* Detailed comparison tabs */}
              <Tabs colorScheme="blue" variant="enclosed">
                <TabList>
                  <Tab><FiTrendingUp style={{marginRight: '8px'}} /> Performance</Tab>
                  <Tab><FiShield style={{marginRight: '8px'}} /> Risk & Return</Tab>
                  <Tab><FiDollarSign style={{marginRight: '8px'}} /> Investment</Tab>
                  <Tab><FiClock style={{marginRight: '8px'}} /> Time Frame</Tab>
                </TabList>
                
                <TabPanels>
                  {/* Performance Tab */}
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Plan Name</Th>
                          <Th isNumeric>Interest Rate</Th>
                          <Th isNumeric>CAGR</Th>
                          <Th isNumeric>Performance Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {comparisonResults.allPlans.map((plan, index) => (
                          <Tr key={plan.id} bg={index === 0 ? "green.50" : undefined}>
                            <Td fontWeight={index === 0 ? "bold" : "normal"}>
                              {plan.planName} {index === 0 && <Badge colorScheme="green">Best</Badge>}
                            </Td>
                            <Td isNumeric fontWeight="bold" color="green.600">{plan.interestRate}%</Td>
                            <Td isNumeric>{plan.cagr?.toFixed(2)}%</Td>
                            <Td isNumeric>
                              {comparisonResults.scores[index].detailedScores.roi}%
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  
                  {/* Risk & Return Tab */}
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Plan Name</Th>
                          <Th>Risk Level</Th>
                          <Th isNumeric>Risk-Return Ratio</Th>
                          <Th isNumeric>Risk Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {comparisonResults.allPlans.map((plan, index) => (
                          <Tr key={plan.id} bg={index === 0 ? "green.50" : undefined}>
                            <Td fontWeight={index === 0 ? "bold" : "normal"}>
                              {plan.planName} {index === 0 && <Badge colorScheme="green">Best</Badge>}
                            </Td>
                            <Td>
                              <Tag
                                size="sm"
                                colorScheme={
                                  plan.riskLevel <= 2
                                    ? "green"
                                    : plan.riskLevel <= 3.5
                                    ? "yellow"
                                    : "red"
                                }
                              >
                                {plan.riskLevel}
                              </Tag>
                            </Td>
                            <Td isNumeric>{(plan.interestRate / plan.riskLevel).toFixed(2)}</Td>
                            <Td isNumeric>
                              {comparisonResults.scores[index].detailedScores.risk}%
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  
                  {/* Investment Tab */}
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Plan Name</Th>
                          <Th isNumeric>Minimum Investment</Th>
                          <Th isNumeric>Est. Returns on ₹10,000</Th>
                          <Th isNumeric>Investment Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {comparisonResults.allPlans.map((plan, index) => {
                          // Calculate estimated returns on ₹10,000
                          const investment = 10000;
                          const monthlyRate = plan.interestRate / 12 / 100;
                          const estReturns = investment * ((1 + monthlyRate) ** plan.tenure - 1);
                          
                          return (
                            <Tr key={plan.id} bg={index === 0 ? "green.50" : undefined}>
                              <Td fontWeight={index === 0 ? "bold" : "normal"}>
                                {plan.planName} {index === 0 && <Badge colorScheme="green">Best</Badge>}
                              </Td>
                              <Td isNumeric>
                                {plan.minAmount ? `₹${plan.minAmount.toLocaleString()}` : "N/A"}
                              </Td>
                              <Td isNumeric color="green.600" fontWeight="semibold">
                                ₹{estReturns.toFixed(0).toLocaleString()}
                              </Td>
                              <Td isNumeric>
                                {comparisonResults.scores[index].detailedScores.minAmount}%
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  
                  {/* Time Frame Tab */}
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Plan Name</Th>
                          <Th isNumeric>Tenure (Months)</Th>
                          <Th>Investment Horizon</Th>
                          <Th isNumeric>Time Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {comparisonResults.allPlans.map((plan, index) => (
                          <Tr key={plan.id} bg={index === 0 ? "green.50" : undefined}>
                            <Td fontWeight={index === 0 ? "bold" : "normal"}>
                              {plan.planName} {index === 0 && <Badge colorScheme="green">Best</Badge>}
                            </Td>
                            <Td isNumeric>{plan.tenure}</Td>
                            <Td>
                              {plan.tenure <= 12 ? "Short Term" : 
                               plan.tenure <= 36 ? "Medium Term" : "Long Term"}
                            </Td>
                            <Td isNumeric>
                              {comparisonResults.scores[index].detailedScores.tenure}%
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                </TabPanels>
              </Tabs>
          
              {/* Detailed Analysis Accordion */}
              <Accordion allowToggle mt={6}>
                <AccordionItem>
                  <h2>
                    <AccordionButton bg="blue.50" _hover={{ bg: "blue.100" }}>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        Detailed Analysis
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg="blue.50">
                    <Stack spacing={2}>
                      {comparisonResults.reasoning.map((reason, index) => (
                        <Text key={index} fontSize="sm">
                          • {reason}
                        </Text>
                      ))}
                    </Stack>
                    
                    <Box mt={6} p={4} bg="white" borderRadius="md">
                      <Heading size="xs" mb={3}>Investment Advice</Heading>
                      <Text fontSize="sm">
                        {comparisonResults.bestPlan.riskLevel <= 2 ? (
                          "This conservative option is best for preserving capital and generating stable returns. Ideal for short-term goals or risk-averse investors."
                        ) : comparisonResults.bestPlan.riskLevel <= 3.5 ? (
                          "This balanced option offers moderate growth potential with managed risk. Suitable for mid-term financial goals or investors with moderate risk tolerance."
                        ) : (
                          "This aggressive growth option aims for maximum returns with higher volatility. Better suited for long-term goals and investors who can tolerate significant market fluctuations."
                        )}
                      </Text>
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              
              {/* Action buttons */}
              <Flex mt={6} justify="space-between" wrap="wrap" gap={4}>
                <Button 
                  colorScheme="green" 
                  leftIcon={<FiAward />}
                  as="a" 
                  href={`/plan1/${comparisonResults.bestPlan.id}`}
                >
                  View Recommended Plan
                </Button>
                
                <Button 
                  colorScheme="gray" 
                  onClick={() => setComparePlans([])}
                >
                  Clear Comparison
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Page;
