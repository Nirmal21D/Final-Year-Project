"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Headers from "@/components/Headers";

const Booklist = () => {
  const router = useRouter();
  const toast = useToast();
  const [bookmarkedPlans, setBookmarkedPlans] = React.useState([]);

  React.useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem("bookmarkedPlans");
      if (storedBookmarks) {
        const parsedBookmarks = JSON.parse(storedBookmarks);
        setBookmarkedPlans(parsedBookmarks);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast({
        title: "Error",
        description: "Failed to load bookmarked plans",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, []);

  const handleRemove = (plan) => {
    const updatedBookmarks = bookmarkedPlans.filter((p) => p.id !== plan.id);
    setBookmarkedPlans(updatedBookmarks);
    localStorage.setItem("bookmarkedPlans", JSON.stringify(updatedBookmarks));
    toast({
      title: "Plan removed",
      description: `${plan.planName} has been removed from your booklist.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

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

      <VStack spacing={8} width="100%" maxW="800px" mt="20vh" p={4}>
        <Heading size="xl" color="#2C319F">
          Your Bookmarked Plans
        </Heading>

        {bookmarkedPlans.length === 0 ? (
          <Text>You haven't bookmarked any plans yet.</Text>
        ) : (
          bookmarkedPlans.map((plan) => (
            <Box
              key={plan.id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              width="100%"
              bg="white"
              boxShadow="md"
            >
              <Heading size="md" color="#2C319F">
                {plan.planName}
              </Heading>
              <Text mt={2} color="gray.700">
                {plan.description}
              </Text>
              <HStack mt={4} justifyContent="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text fontWeight="bold" color="green.600">
                    Interest Rate: {plan.interestRate ?? 0}%
                  </Text>
                  <Text color="orange.600">
                    CAGR: {(plan.cagr ?? 0).toFixed(2)}%
                  </Text>
                  <Text color="red.600">
                    Risk Level: {plan.riskLevel ?? "N/A"}
                  </Text>
                  <Text color="blue.600">
                    Min Investment: ₹{plan.minAmount?.toLocaleString() ?? "0"}
                  </Text>
                </VStack>
                <VStack>
                  <Button
                    colorScheme="blue"
                    onClick={() => router.push(`/plan1/${plan.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleRemove(plan)}
                  >
                    Remove
                  </Button>
                </VStack>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Booklist;
