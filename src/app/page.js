"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Spinner,
  Card,
  CardBody,
  Text,
  Heading,
  Link,
  SimpleGrid,
  Badge,
  VStack,
  Skeleton,
  Container,
  Stack,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase";

import Headers from "@/components/Headers";
import Chat from "@/components/chat";
import Welcome from "@/components/Welcome";

const MainPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ... keep your existing useEffect hooks for fetching plans and user data ...
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCollection = collection(db, "investmentplans");
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans from Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user); // Set user state based on authentication status
      if (user) {
        const userDoc = await getDocs(collection(db, "users")); // Assuming user interests are stored in a "users" collection
        const userData = userDoc.docs.find((doc) => doc.id === user.uid);
        if (userData) {
          setUserInterests(userData.data().interests || []); // Set user interests from user document
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const filteredPlans = plans.filter(
    (plan) => plan.tags && plan.tags.some((tag) => userInterests.includes(tag))
  );

  return (
    <Box>
      {/* Fixed Header */}
      <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      {/* Hero Section */}
      <Box
        position="relative"
        height="100vh"
        width="100%"
        backgroundImage="url('/images/bg1.jpg')" // Replace with your actual image URL
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        {/* Dark gradient overlay */}
        <Box
          position="absolute"
          top="0"
          right="0"
          width="100%"
          height="100%"
          background="linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.8))"
        />

        {/* Hero Content */}
        <Container
          maxW="container.xl"
          height="100%"
          position="relative"
          zIndex="1"
        >
          <Stack
            height="100%"
            justifyContent="center"
            alignItems="flex-start"
            spacing="6"
            maxW="xl"
          >
            <Welcome />
            {/* <Heading
              color="white"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
            >
              Invest in Your Future
            </Heading>
            <Text
              color="gray.100"
              fontSize={{ base: "lg", md: "xl" }}
              maxW="lg"
            >
              Discover personalized investment plans tailored to your goals.
              Start your journey to financial freedom today with our expert
              guidance and proven strategies.
            </Text> */}
          </Stack>
        </Container>
      </Box>

      {/* Recommended Plans Section */}
      <Box bg="gray.50" py="16" background="rgba(0,128,128,0.08)">
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb="8">
            Recommended For you
          </Heading>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} height="250px" borderRadius="lg" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
                  as={Link}
                  href={`/plan1/${plan.id}`}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                  bg="gray.50"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <CardBody>
                    <VStack align="stretch" spacing="4">
                      <Heading size="md">{plan.planName}</Heading>
                      <Text fontSize="3xl" fontWeight="bold">
                        ${plan.minAmount}
                        <Box as="span" fontSize="sm" fontWeight="normal" ml="1">
                          /month
                        </Box>
                      </Text>
                      <Badge colorScheme="green" alignSelf="flex-start">
                        {plan.interestRate}% Interest Rate
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        Click to view plan details
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Chat Interface */}
      {isChatOpen && (
        <Box
          position="fixed"
          bottom="20"
          right="4"
          width="350px"
          height="500px"
          borderRadius="xl"
          boxShadow="lg"
          backdropFilter="blur(50px)"
          bg="rgba(45, 55, 72, 0.2)"
          zIndex={999}
        >
          <Chat />
        </Box>
      )}

      <IconButton
        position="fixed"
        bottom="4"
        right="4"
        size="lg"
        borderRadius="full"
        colorScheme={isChatOpen ? "red" : "blue"}
        icon={<ChatIcon />}
        boxShadow="lg"
        zIndex={1000}
        aria-label={isChatOpen ? "Close Chat" : "Open Chat"}
        onClick={toggleChat}
      />
    </Box>
  );
};

export default MainPage;
