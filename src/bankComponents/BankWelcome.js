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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  if (!bankData) {
    return (
      <VStack spacing={4} align="center" mt={10}>
        <Text fontSize="3xl" color="white" fontWeight="bold">
          Please Sign Up or Login to continue
        </Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={2} align="center" mt={10}>
      <Text fontSize="md" color="gray.400">
        Welcome back,
      </Text>
      <Text fontSize="3xl" color="white" fontWeight="bold">
        {bankData.bankName || "Bank"}
      </Text>
      <Text fontSize="lg" color="gray.400">
        Glad to see you again!
      </Text>
    </VStack>
  );
};

export default BankWelcome;
