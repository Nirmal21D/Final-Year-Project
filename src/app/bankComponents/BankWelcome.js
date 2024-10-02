"use client";
import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
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
    return <Text>Loading...</Text>;
  }

  if (!bankData) {
    return (
      <Text fontSize="3xl" color="white" fontWeight="bold" mb={4}>
        Please Sign Up or Login to continue
      </Text>
    );
  }

  return (
    <>
      <Text fontSize="md" color="gray.400">
        Welcome back,
      </Text>
      <Text fontSize="3xl" color="white" fontWeight="bold" mb={4}>
        {bankData.bankName || "Bank"}
      </Text>
      <Text fontSize="lg" color="gray.400">
        Glad to see you again!
      </Text>
    </>
  );
};

export default BankWelcome;
