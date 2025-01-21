"use client";
import React, { useState, useEffect } from "react";
import { Box, IconButton, Spinner } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

import Welcome from "@/components/Welcome";
import Headers from "@/components/Headers";
import Chat from "@/components/chat";

const MainPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCollection = collection(db, "plans");
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans from Firebase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Box
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        backgroundImage="url(/images/newbg.png)"
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
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <Spinner size="xl" />
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection={{ base: "column", md: "row" }}
                justifyContent="space-around"
                gap="6"
              >
                {plans.map((plan) => (
                  <Box
                    key={plan.id}
                    flex="1"
                    p="6"
                    borderRadius="lg"
                    bg="rgba(255, 255, 255, 0.1)"
                    textAlign="center"
                    transform={plan.isRecommended ? "scale(1.05)" : "none"}
                    boxShadow={plan.isRecommended ? "xl" : "none"}
                    position="relative"
                  >
                    {plan.isRecommended && (
                      <Box
                        position="absolute"
                        top="-3"
                        right="-3"
                        bg="green.500"
                        color="white"
                        px="3"
                        py="1"
                        borderRadius="full"
                        fontSize="sm"
                      >
                        Recommended
                      </Box>
                    )}
                    <Box fontSize="2xl" fontWeight="bold" mb="4">{plan.name}</Box>
                    <Box fontSize="4xl" mb="4">
                      ${plan.price}<Box as="span" fontSize="sm">/month</Box>
                    </Box>
                    <Box mb="4">
                      {plan.features && plan.features.map((feature, idx) => (
                        <Box key={idx} mb="2">✓ {feature}</Box>
                      ))}
                    </Box>
                  </Box>
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
