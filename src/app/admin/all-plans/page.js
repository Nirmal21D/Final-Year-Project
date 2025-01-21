"use client"
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Stack,
  Avatar,
  useToast,
  Spinner
} from "@chakra-ui/react";

export default function AllPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansRef = collection(db, "investmentplans");
        const querySnapshot = await getDocs(plansRef);
        const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast({
          title: "Error fetching plans",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const planRef = doc(db, "investmentplans", planId);
        await deleteDoc(planRef);
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
        toast({
          title: "Plan deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting plan: ", error);
        toast({
          title: "Error deleting plan",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="85%" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading color="green.400" size="lg">Plans Management</Heading>
          <Flex align="center" gap={4}>
            <Text color="gray.600">Hello, Admin</Text>
            <Avatar src="/admin-avatar.png" size="md" />
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {plans.map((plan) => (
              <Card key={plan.id} variant="outline" transition="all 0.2s" _hover={{ shadow: "xl" }}>
                <CardBody>
                  <Flex justify="space-between" align="start" mb={4}>
                    <Heading size="md" color="gray.800">{plan.planName}</Heading>
                    <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                      {plan.investmentCategory}
                    </Badge>
                  </Flex>

                  <Text color="gray.600" mb={4} noOfLines={2}>
                    {plan.description}
                  </Text>

                  <Stack spacing={2} fontSize="sm" color="gray.500">
                    <Flex align="center">
                      <Text mr={2}>💰</Text>
                      <Text>Interest Rate: {plan.interestRate}%</Text>
                    </Flex>
                    
                    <Flex align="center">
                      <Text mr={2}>⏳</Text>
                      <Text>Tenure: {plan.tenure} months</Text>
                    </Flex>

                    <Flex align="center">
                      <Text mr={2}>📊</Text>
                      <Text>Risk Level: {plan.riskLevel}</Text>
                    </Flex>

                    <Flex align="center">
                      <Text mr={2}>💵</Text>
                      <Text>Minimum Investment: {plan.minimumInvestment} INR</Text>
                    </Flex>

                    <Flex align="center">
                      <Text mr={2}>🏷️</Text>
                      <Text>{plan.investmentSubCategory}</Text>
                    </Flex>
                  </Stack>

                  <Flex justify="flex-end" mt={6}>
                    <Button
                      onClick={() => handleDeletePlan(plan.id)}
                      colorScheme="red"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
