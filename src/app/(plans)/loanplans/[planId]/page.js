"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Text,
  Stack,
  Divider,
  Tag,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
  useToast,
  Icon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FiClock, FiDollarSign, FiPercent, FiTrendingUp } from "react-icons/fi";
import Headers from "@/components/Headers";

const LoanPlanDetails = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planDoc = await getDoc(doc(db, "loanplans", planId));
        if (!planDoc.exists()) {
          toast({
            title: "Error",
            description: "Loan plan not found",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push('/loanplans');
          return;
        }

        const currentPlan = { id: planDoc.id, ...planDoc.data() };
        setPlan(currentPlan);
      } catch (error) {
        console.error("Error fetching loan plan:", error);
        toast({
          title: "Error",
          description: "Failed to load loan plan details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, router, toast]);

  if (loading) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="xl">Loading...</Text>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Text fontSize="xl">Loan plan not found</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Headers />

      <Container maxW="container.xl" py={4}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          <GridItem>
            <Box bg="white" p={8} borderRadius="xl" shadow="lg">
              <Stack spacing={6}>
                <Wrap spacing={2}>
                  {plan.tags?.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag size="lg" colorScheme="blue" borderRadius="full">
                        {tag}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>

                <Text fontSize="xl" color="gray.700" lineHeight="tall">
                  {plan.description}
                </Text>

                <Divider />

                <Grid templateColumns="repeat(2, 1fr)" gap={8}>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiPercent} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Interest Rate</Text>
                        <Text fontSize="xl" color="blue.600">{plan.interestRate}%</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiClock} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Tenure</Text>
                        <Text fontSize="xl" color="blue.600">{plan.tenure} months</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiDollarSign} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Minimum Loan Amount</Text>
                        <Text fontSize="xl" color="blue.600">₹{plan.minAmount}</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg="blue.50" borderRadius="lg">
                    <HStack spacing={3}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontWeight="bold" color="gray.700">Maximum Loan Amount</Text>
                        <Text fontSize="xl" color="blue.600">₹{plan.maxAmount}</Text>
                      </Box>
                    </HStack>
                  </Box>
                </Grid>

                <Divider />

                <Text fontSize="lg" color="gray.700">
                  <strong>Loan Category:</strong> {plan.loanCategory}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Loan SubCategory:</strong> {plan.loanSubCategory}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Plan Type:</strong> {plan.planType}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Created At:</strong> {plan.createdAt.toDate().toString()}
                </Text>
                <Text fontSize="lg" color="gray.700">
                  <strong>Last Updated:</strong> {plan.lastUpdated.toDate().toString()}
                </Text>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoanPlanDetails;