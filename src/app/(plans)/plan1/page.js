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
import { FiBookmark } from "react-icons/fi";

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
  const calculateRisk = (interestRate, tenure, minimumInvestment) => {
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
      (minimumInvestment > 500000
        ? 5
        : minimumInvestment > 100000
        ? 4
        : minimumInvestment > 50000
        ? 3
        : minimumInvestment > 10000
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

  // Enhanced comparison logic
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
          minimumInvestment: 0.1,
        };

        const normalizedROI = plan.interestRate / 20;
        const normalizedCAGR = plan.cagr / 20;
        const normalizedRisk = (5 - plan.riskLevel) / 5;
        const normalizedTenure = Math.min(plan.tenure, 120) / 120;
        const normalizedInvestment =
          1 - Math.min(plan.minimumInvestment || 0, 500000) / 500000;

        return (
          normalizedROI * weights.roi +
          normalizedCAGR * weights.cagr +
          normalizedRisk * weights.risk +
          normalizedTenure * weights.tenure +
          normalizedInvestment * weights.minimumInvestment
        );
      };

      return {
        plan,
        score: calculateScore(plan),
      };
    });

    compareAllPlans.sort((a, b) => b.score - a.score);

    const generateDetailedReasoning = (bestPlan, otherPlans) => {
      if (!bestPlan || !otherPlans) return [];
      const reasoning = [];

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
            `better CAGR (${bestPlan.cagr.toFixed(
              2
            )}% vs ${otherPlan.cagr.toFixed(2)}%)`
          );
        }
        if (bestPlan.riskLevel < otherPlan.riskLevel) {
          comparisons.push(
            `lower risk (${bestPlan.riskLevel} vs ${otherPlan.riskLevel})`
          );
        }
        if (
          bestPlan.minimumInvestment &&
          otherPlan.minimumInvestment &&
          bestPlan.minimumInvestment < otherPlan.minimumInvestment
        ) {
          comparisons.push(
            `lower minimum investment (₹${bestPlan.minimumInvestment.toLocaleString()} vs ₹${otherPlan.minimumInvestment.toLocaleString()})`
          );
        }

        if (comparisons.length > 0) {
          reasoning.push(
            `Compared to ${otherPlan.planName}, it offers ${comparisons.join(
              ", "
            )}`
          );
        }
      });

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
      scores: compareAllPlans.map(({ plan, score }) => ({
        planName: plan?.planName,
        score: (score * 100).toFixed(2),
      })),
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
            data.minimumInvestment
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

      <Stack spacing={4} width="100%" maxW="1200px" mt="20vh">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box flex="1">
            <Text fontWeight="bold" color="#2C319F" mb={2}>
              Categories:
            </Text>
            <CheckboxGroup value={categoryFilter} onChange={setCategoryFilter}>
              <Stack direction={["column", "row"]} spacing={[2, 4]}>
                <Checkbox value="Bonds">Bonds</Checkbox>
                <Checkbox value="MutualFunds">Mutual Funds</Checkbox>
                <Checkbox value="FixedDeposits">Fixed Deposits</Checkbox>
                <Checkbox value="GoldInvestments">Gold Investments</Checkbox>
                <Checkbox value="ProvidentFunds">Provident Funds</Checkbox>
              </Stack>
            </CheckboxGroup>
          </Box>

          <Box>
            <Stack direction="row" spacing={4}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="interestRate">Interest Rate</option>
                <option value="cagr">CAGR</option>
                <option value="riskLevel">Risk Level</option>
                <option value="minimumInvestment">Minimum Investment</option>
              </Select>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </Select>
            </Stack>
          </Box>
        </Flex>

        {/* SubCategories Section */}
        {categoryFilter.length > 0 && (
          <Box>
            <Text fontWeight="bold" color="#2C319F" mb={2}>
              Subcategories:
            </Text>
            <CheckboxGroup
              value={subCategoryFilter}
              onChange={setSubCategoryFilter}
            >
              <Stack direction={["column", "row"]} spacing={[2, 4]} wrap="wrap">
                {/* ... Previous subcategories code remains the same ... */}
              </Stack>
            </CheckboxGroup>
          </Box>
        )}
      </Stack>

      {/* Improved Recommended Plans Section */}
      {recommendedPlans.length > 0 && (
        <Box width="100%" maxW="1200px" mb={8} mt={8}>
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
                position="relative"
                width={["100%", "calc(50% - 8px)", "calc(33.333% - 11px)"]}
                height={"50vh"}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                bg="white"
                boxShadow="lg"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
              >
                <IconButton
                  icon={<FiBookmark size={24} />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  colorScheme={
                    bookmarkedPlans.some((p) => p.id === plan.id)
                      ? "blue"
                      : "gray"
                  }
                  onClick={() => handleBookmark(plan)}
                  aria-label={
                    bookmarkedPlans.some((p) => p.id === plan.id)
                      ? "Remove from Booklist"
                      : "Add to Booklist"
                  }
                />

                <Box as="a" href={`/plan1/${plan.id}`} display="block" mt={8}>
                  <Heading size="sm" color="#2C319F" noOfLines={2}>
                    {plan.planName}
                  </Heading>
                  <Text mt={2} noOfLines={2} color="gray.700">
                    {plan.description}
                  </Text>
                  <Stack spacing={2} mt={3}>
                    <Text fontWeight="bold" color="green.600">
                      Interest Rate: {plan.interestRate}%
                    </Text>
                    <Text color="orange.600">
                      CAGR: {plan.cagr.toFixed(2)}%
                    </Text>
                    <Text color="purple.600">Risk Level: {plan.riskLevel}</Text>
                    {!plan.isDefaultRecommendation && (
                      <Text color="blue.600">
                        Match Score: {(plan.similarityScore * 100).toFixed(1)}%
                      </Text>
                    )}
                  </Stack>
                  <Wrap mt={2}>
                    {plan.tags?.slice(0, 3).map((tag) => (
                      <Tag key={tag} size="sm" colorScheme="blue">
                        {tag}
                      </Tag>
                    ))}
                  </Wrap>
                </Box>
                <Button
                  mt={4}
                  size="sm"
                  width="100%"
                  colorScheme={comparePlans.includes(plan) ? "red" : "blue"}
                  onClick={() => handleSelectForCompare(plan)}
                >
                  {comparePlans.includes(plan)
                    ? "Remove from Comparison"
                    : "Add to Compare"}
                </Button>
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      {/* Main Plans Grid */}
      <Heading size="lg">Explore All Plans</Heading>
      <Flex
        wrap="wrap"
        justify="flex-start"
        gap={6}
        width="100%"
        maxW="1200px"
        my={10}
      >
        {plans.map((plan) => (
          <Box
            key={plan.id}
            position="relative"
            width={["100%", "calc(50% - 12px)", "calc(33.333% - 16px)"]}
          >
            <Box
              as="a"
              href={`/plan1/${plan.id}`}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              bg="white"
              boxShadow="lg"
              transition="all 0.2s"
              _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
              display="block"
              height={"42vh"}
            >
              <IconButton
                icon={<FiBookmark size={24} />}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme={
                  bookmarkedPlans.some((p) => p.id === plan.id)
                    ? "blue"
                    : "gray"
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleBookmark(plan);
                }}
                aria-label={
                  bookmarkedPlans.some((p) => p.id === plan.id)
                    ? "Remove from Booklist"
                    : "Add to Booklist"
                }
              />

              <Stack spacing={3} mt={8}>
                <Heading size="sm" color="#2C319F">
                  {plan.planName}
                </Heading>
                <Text noOfLines={2} color="gray.700">
                  {plan.description}
                </Text>
                <Text fontWeight="bold" color="green.600">
                  Interest Rate: {plan.interestRate}%
                </Text>
                <Text color="orange.600">CAGR: {plan.cagr.toFixed(2)}%</Text>
                <Text color="red.600">Risk Level: {plan.riskLevel}</Text>
                <Text color="blue.600">
                  Min Investment: ₹{plan.minimumInvestment?.toLocaleString()}
                </Text>
              </Stack>
            </Box>
            <Button
              mt={2}
              width="100%"
              colorScheme={comparePlans.includes(plan) ? "red" : "blue"}
              onClick={() => handleSelectForCompare(plan)}
            >
              {comparePlans.includes(plan)
                ? "Remove from Comparison"
                : "Add to Compare"}
            </Button>
          </Box>
        ))}
      </Flex>

      {/* Comparison Section */}
      {comparePlans.length >= 2 && (
        <Button
          colorScheme="green"
          mt={6}
          size="lg"
          onClick={handleCompare}
          mb={8}
        >
          Compare Selected Plans ({comparePlans.length})
        </Button>
      )}

      {/* Comparison Results */}
      {comparisonResults.bestPlan && (
        <Box
          mt={8}
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="lg"
          width="100%"
          maxW="1200px"
          mb={8}
        >
          <Heading size="md" color="blue.600" mb={4}>
            Plan Comparison Results
          </Heading>

          <Table variant="simple" mt={4}>
            <Thead>
              <Tr>
                <Th>Plan Detail</Th>
                {comparisonResults.otherPlans.map((plan) => (
                  <Th key={plan.id}>{plan.planName}</Th>
                ))}
                <Th bg="green.50">{comparisonResults.bestPlan.planName}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Interest Rate</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.interestRate}%</Td>
                ))}
                <Td bg="green.50">
                  {comparisonResults.bestPlan.interestRate}%
                </Td>
              </Tr>
              <Tr>
                <Td>CAGR</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.cagr.toFixed(2)}%</Td>
                ))}
                <Td bg="green.50">
                  {comparisonResults.bestPlan.cagr.toFixed(2)}%
                </Td>
              </Tr>
              <Tr>
                <Td>Risk Level</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>
                    <Tag
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
                ))}
                <Td bg="green.50">
                  <Tag
                    colorScheme={
                      comparisonResults.bestPlan.riskLevel <= 2
                        ? "green"
                        : comparisonResults.bestPlan.riskLevel <= 3.5
                        ? "yellow"
                        : "red"
                    }
                  >
                    {comparisonResults.bestPlan.riskLevel}
                  </Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Minimum Investment</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>
                    ₹{plan.minimumInvestment?.toLocaleString() || "N/A"}
                  </Td>
                ))}
                <Td bg="green.50">
                  ₹
                  {comparisonResults.bestPlan.minimumInvestment?.toLocaleString() ||
                    "N/A"}
                </Td>
              </Tr>
              <Tr>
                <Td>Category</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.investmentCategory}</Td>
                ))}
                <Td bg="green.50">
                  {comparisonResults.bestPlan.investmentCategory}
                </Td>
              </Tr>
              <Tr>
                <Td>Subcategory</Td>
                {comparisonResults.otherPlans.map((plan) => (
                  <Td key={plan.id}>{plan.investmentSubCategory}</Td>
                ))}
                <Td bg="green.50">
                  {comparisonResults.bestPlan.investmentSubCategory}
                </Td>
              </Tr>
              <Tr>
                <Td>Comparison Score</Td>
                {comparisonResults.scores.slice(1).map((score) => (
                  <Td key={score.planName}>{score.score}%</Td>
                ))}
                <Td bg="green.50">{comparisonResults.scores[0].score}%</Td>
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
    </Box>
  );
};

export default Page;
