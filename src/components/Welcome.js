"use client";
import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";
import { auth, db } from "@/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Welcome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("No user is signed in.");
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userData) {
    return <Text fontSize="3xl" color="white" fontWeight="bold" mb={4}>Please Sign Up or Login to continue</Text>;
  }

  return (
    <>
      <Text fontSize="md" color="gray.400">
        Welcome back,
      </Text>
      <Text fontSize="3xl" color="white" fontWeight="bold" mb={4}>
        {userData.name || "User"}
      </Text>
      <Text fontSize="lg" color="gray.400">
        Glad to see you again!
      </Text>
    </>
  );
};

export default Welcome;
