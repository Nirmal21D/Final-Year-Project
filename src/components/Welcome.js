import React, { useState, useEffect } from "react";
import { Box, Text, Heading, Spinner } from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const Welcome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
            if(!userData.userType) {
             router.push("/bankdashboard");
            }
          } else {
            console.error("No such document!");
          }
        } else {
          console.log("No user is signed in.");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box p="20px">
        <Text fontSize="3xl" color="white" fontWeight="bold">
          Please Sign Up or Login to continue
        </Text>
      </Box>
    );
  }

  return (
    <Box
      p="20px"
      style={{
        animation: "breathe 4s infinite ease-in-out",
      }}
      sx={{
        "@keyframes breathe": {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.02)",
            opacity: 0.9,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      <Heading
        color="white"
        fontSize={{ base: "4xl", md: "5xl", lg: "4xl" }}
        fontWeight="bold"
        mb={2}
      >
        Welcome back,
      </Heading>
      <Heading
        color="white"
        fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
        fontWeight="bold"
        mb={4}
      >
        {userData?.name || "User"}
      </Heading>
      <Text color="gray.100" fontSize={{ base: "lg", md: "xl" }} maxW="lg">
        Empowering Smarter Financial Decisions – Manage, Invest, and Grow with
        Finance Mastery.
      </Text>
    </Box>
  );
};

export default Welcome;
