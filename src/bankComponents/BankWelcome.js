"use client";
import React, { useState, useEffect } from "react";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BankWelcome = () => {
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (bank) => {
      setLoading(true);
      if (bank) {
        try {
          const bankDoc = doc(db, "Banks", bank.uid);
          const bankSnap = await getDoc(bankDoc);

          if (bankSnap.exists()) {
            setBankData(bankSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching bank data: ", error);
        }
      } else {
        console.log("No bank is signed in.");
        setBankData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (!bankData) {
    return (
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        shadow="md"
        textAlign="center"
        mb={6}
      >
        <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={2}>
          Please Sign Up or Login to continue
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="md"
      shadow="md"
      textAlign="center"
      mb={6}
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={2}>
        Welcome to Finance Mastery!
      </Text>
      <Text fontSize="md" color="gray.600">
        We're excited to have your bank onboard. Whether you're here to explore
        or manage plans, we're committed to empowering you with tools to reach
        your goals. Let’s make finance simple and effective together!
      </Text>
    </Box>
  );
};

export default BankWelcome;
