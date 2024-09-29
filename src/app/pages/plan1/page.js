"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/app/components/SideNav";
import SearchBox from "../../components/SearchBar";
import { Box, Text } from "@chakra-ui/react";
import Plancards from "@/app/components/Plancards";
import { db, auth } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

const page = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/pages/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "plans"));
        const plansData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans: ", error);
      }
    };

    if (user) {
      fetchPlans();
    }
  }, [user]);

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={10}
        justifyItems="center"
        p={5}
        backgroundImage="url(/images/body-background.png)"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        height="100vh"
        width="100%"
      >
        <Box display="flex" gap={10} justifyItems="center">
          <SideNav />
          <SearchBox />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={20}
          p={10}
        >
          {plans.map((plan) => (
            <Plancards
              key={plan.id}
              header={plan.planName}
              summary={plan.description}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default page;
