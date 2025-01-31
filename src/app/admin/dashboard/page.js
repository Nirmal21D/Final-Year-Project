"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AdminSideNav from "@/adminComponents/AdminSideNav";
import AdminHeader from "@/adminComponents/AdminHeader";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
} from "@chakra-ui/react";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [totalBanks, setTotalBanks] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [verifiedBanks, setVerifiedBanks] = useState(0);
  const [rejectedBanks, setRejectedBanks] = useState(0);
  const [banks, setBanks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchBankAndPlanData = async () => {
      const banksRef = collection(db, "Banks");
      const plansRef = collection(db, "investmentplans");
      const querySnapshotBanks = await getDocs(banksRef);
      const querySnapshotPlans = await getDocs(plansRef);

      const banksData = querySnapshotBanks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanks(banksData);
      console.log(banksData);

      const plansData = querySnapshotPlans.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlans(plansData);

      setTotalBanks(querySnapshotBanks.size);
      setTotalPlans(querySnapshotPlans.size);
      setPendingVerifications(
        querySnapshotBanks.docs.filter((doc) => !doc.data().isVerified).length
      );
      setVerifiedBanks(
        querySnapshotBanks.docs.filter((doc) => doc.data().isVerified).length
      );
      setRejectedBanks(
        querySnapshotBanks.docs.filter((doc) => doc.data().isRejected).length
      );
    };
    fetchBankAndPlanData();
  }, []);

  const handleRejectBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isRejected: true,
        isVerified: false,
      });

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId
            ? { ...bank, isRejected: true, isVerified: false }
            : bank
        )
      );

      alert("Bank rejected successfully");
    } catch (error) {
      console.error("Error rejecting bank:", error);
      alert("Failed to reject bank");
    }
  };

  const handleVerifyBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isVerified: true,
        isRejected: false,
      });

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId
            ? { ...bank, isVerified: true, isRejected: false }
            : bank
        )
      );

      alert("Bank verified successfully");
    } catch (error) {
      console.error("Error verifying bank:", error);
      alert("Failed to verify bank");
    }
  };

  return (
    <>
      <Flex bg="#F0F4FB" minH="100vh">
        <Box
          w="20%"
          bg="gray.800"
          color="white"
          p={4}
          position="fixed"
          h="full"
        >
          <AdminSideNav />
        </Box>

        {/* Main Content */}
        <Box flex="1" ml="20%">
          <Box mb={6}>
            {/* <AdminHeader /> */}
            <Flex justify="space-between" align="center" mt={2} px={6}>
              <Heading size="lg" color="emerald.400">
                Admin Dashboard
              </Heading>
              <Flex align="center" gap={4}>
                <Text color="gray.600">Hello, Admin</Text>
                <Avatar src="/admin-avatar.png" size="md" />
              </Flex>
            </Flex>
          </Box>

          {/* Dashboard Cards */}
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(5, 1fr)",
            }}
            gap={6}
            px={6}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                Total Banks
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                {totalBanks}
              </Text>
            </Box>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                Total Plans
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                {totalPlans}
              </Text>
            </Box>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                Pending Verifications
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                {pendingVerifications}
              </Text>
            </Box>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                Verified Banks
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                {verifiedBanks}
              </Text>
            </Box>
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                Rejected Banks
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                {rejectedBanks}
              </Text>
            </Box>
          </Grid>

          {/* Banks List */}
          <Box mt={8} px={6}>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color="emerald.400"
              mb={4}
            >
              Banks
            </Text>
            <Box bg="white" borderRadius="lg" boxShadow="lg" p={6}>
              <Box overflowX="auto">
                <Table variant="simple" w="full">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {banks.map((bank) => (
                      <Tr key={bank.id}>
                        <Td>{bank.bankName}</Td>
                        <Td>
                          {bank.isVerified
                            ? "Verified"
                            : bank.isRejected
                            ? "Rejected"
                            : "Pending"}
                        </Td>
                        <Td>
                          {bank.isVerified ? (
                            <Button
                              onClick={() => handleRejectBank(bank.id)}
                              colorScheme="red"
                              isDisabled={bank.isRejected}
                            >
                              Reject
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleVerifyBank(bank.id)}
                              colorScheme="green"
                            >
                              Verify
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box mt={12} mb={6} textAlign="center" color="gray.600">
            <Text>© 2025 Admin Panel. All Rights Reserved.</Text>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default AdminDashboard;
