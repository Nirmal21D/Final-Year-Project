"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BankSidenav from "@/bankComponents/BankSidenav";
import BankHeaders from "@/bankComponents/BankHeaders";

import { Box, Flex } from "@chakra-ui/react";

const BankProfile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Flex h="auto">
        {/* Sidebar */}
        <Box
          w="20%"
          bg="gray.800"
          color="white"
          p={4}
          position={"fixed"}
          h={"full"}
        >
          <BankSidenav />
        </Box>

        {/* Main Content */}
        <Box
          w="80%"
          bg="gray.50"
          display="flex"
          flexDirection="column"
          position={"absolute"}
          left={"20%"}
        >
          <Box position="fixed" width="80%" zIndex={1000}>
            <BankHeaders />
          </Box>
          <Box px={6} mt={12}></Box>
        </Box>
      </Flex>
    </>
  );
};

export default BankProfile;
