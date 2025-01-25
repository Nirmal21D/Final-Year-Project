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
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase"; // Import auth from firebase

import Welcome from "@/components/Welcome";
import Headers from "@/components/Headers";
import Chat from "@/components/chat";

const MainPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [userInterests, setUserInterests] = useState([]); // State to hold user interests
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // State to hold user information

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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Filter plans based on user interests
  const filteredPlans = plans.filter(
    (plan) => plan.tags && plan.tags.some((tag) => userInterests.includes(tag))
  );

  return (
    <>
      <Box
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        // backgroundImage="url(/images/newbg.png)"
        bg="gray.50"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh"
        minWidth="auto"
      >
        <Box
          id="upper"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Headers />
        </Box>
        <Box
          id="lower"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            id="welcome"
            m="40px"
            height="30vh"
            width="90%"
            borderRadius="xl"
            boxShadow="lg"
            backdropFilter="blur(50px)"
            bg="rgba(45, 55, 72, 0.2)"
            marginTop="calc(17vh + 40px)"
          >
            <Welcome />
          </Box>

          <Box
            id="plans"
            m="40px"
            width="90%"
            borderRadius="xl"
            boxShadow="lg"
            backdropFilter="blur(50px)"
            bg="rgba(45, 55, 72, 0.2)"
            p="6"
          >
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <Spinner size="xl" />
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection={{ base: "column", md: "row" }}
                justifyContent="space-around"
                gap="6"
              >
                {filteredPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    width="auto"
                    height="auto"
                    maxW="300px"
                    borderRadius="lg"
                    bg="rgba(255, 255, 255, 0.1)"
                    boxShadow="lg"
                    position="relative"
                    as={Link}
                    href={`/plan1/${plan.id}`}
                    isExternal
                  >
                    <CardBody>
                      <Heading size="md" mb="4">
                        {plan.planName}
                      </Heading>
                      <Text fontSize="xl" mb="4">
                        ${plan.minAmount}
                        <Box as="span" fontSize="sm">
                          /month
                        </Box>
                      </Text>
                      <Text mb="4">Interest Rate: {plan.interestRate}%</Text>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

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
        </Box>

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
    </>
  );
};

export default MainPage;
