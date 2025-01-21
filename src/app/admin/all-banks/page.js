"use client";

import React, { useState, useEffect } from "react";
import { Box, Text, Image, Button, Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Spinner, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton } from "@chakra-ui/react";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDocs as getPlansDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AllBankss() {
  const [Banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [plans, setPlans] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchBanks = async () => {
      const usersRef = collection(db, "Banks");
      const querySnapshot = await getDocs(usersRef);
      const banksDocs = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setBanks(banksDocs);
    };
    fetchBanks();
  }, []);

  const fetchPlansByBank = async (bankId) => {
    const plansRef = collection(db, "investmentplans");
    const querySnapshot = await getDocs(plansRef);
    const bankPlans = querySnapshot.docs
      .filter(doc => doc.data().createdBy === bankId)
      .map(doc => ({ id: doc.id, ...doc.data() }));
    setPlans(bankPlans);
  };

  const handleBanBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isBanned: true
      });

      setBanks(prevBanks => 
        prevBanks.map(bank => 
          bank.id === bankId ? { ...bank, isBanned: true } : bank
        )
      );
    } catch (error) {
      console.error("Error banning bank:", error);
    }
  };

  const handleUnbanBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await updateDoc(bankRef, {
        isBanned: false
      });

      setBanks(prevBanks => 
        prevBanks.map(bank => 
          bank.id === bankId ? { ...bank, isBanned: false } : bank
        )
      );
    } catch (error) {
      console.error("Error unbanning bank:", error);
    }
  };

  const handleDeleteBank = async (bankId) => {
    try {
      const bankRef = doc(db, "Banks", bankId);
      await deleteDoc(bankRef);

      // Delete plans created by the bank
      const plansQuery = query(collection(db, "investmentplans"), where("createdBy", "==", bankId));
      const plansSnapshot = await getPlansDocs(plansQuery);
      plansSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setBanks(prevBanks => 
        prevBanks.filter(bank => bank.id !== bankId)
      );
    } catch (error) {
      console.error("Error deleting bank:", error);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bg="#F0F4FB" mx="auto">
      {/* Sidebar */}
    

      {/* Main Content */}
      <Box flex="1" p="6" mx="auto" maxW="85%">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="6">
          <Text fontSize="3xl" fontWeight="semibold" color="emerald.400">All Banks</Text>
          <Box display="flex" alignItems="center" spaceX="4">
            <Text color="gray.600">Hello, Admin</Text>
            <Image src="/admin-avatar.png" alt="Admin Avatar" boxSize="40px" borderRadius="full" />
          </Box>
        </Box>

        {/* Banks List */}
        <Box bg="white" rounded="lg" shadow="lg" p="6">
          <Box overflowX="auto">
            <Table minW="full">
              <Thead>
                <Tr>
                  <Th px="6" py="3" textTransform="uppercase" color="gray.500">Name</Th>
                  <Th px="6" py="3" textTransform="uppercase" color="gray.500">Email</Th>
                  <Th px="6" py="3" textTransform="uppercase" color="gray.500">Status</Th>
                  <Th px="6" py="3" textTransform="uppercase" color="gray.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Banks.map((bank) => (
                  <Tr key={bank.id}>
                    <Td px="6" py="4" whiteSpace="nowrap">{bank.bankName || 'N/A'}</Td>
                    <Td px="6" py="4" whiteSpace="nowrap">{bank.bankEmail || 'N/A'}</Td>
                    <Td px="6" py="4" whiteSpace="nowrap">
                      {bank.isBanned ? "Banned" : "Active"}
                    </Td>
                    <Td px="6" py="4" whiteSpace="nowrap" spaceX="2">
                      <Button
                        onClick={() => {
                          setSelectedBank(bank);
                          fetchPlansByBank(bank.id);
                          onOpen();
                        }}
                        bg="blue.500"
                        _hover={{ bg: "blue.600" }}
                        color="white"
                        px="4"
                        py="2"
                        rounded="md"
                      >
                        View Details
                      </Button>
                      {bank.isBanned ? (
                        <Button
                          onClick={() => handleUnbanBank(bank.id)}
                          bg="green.500"
                          _hover={{ bg: "green.600" }}
                          color="white"
                          px="4"
                          py="2"
                          rounded="md"
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleBanBank(bank.id)}
                          bg="red.500"
                          _hover={{ bg: "red.600" }}
                          color="white"
                          px="4"
                          py="2"
                          rounded="md"
                          isDisabled={bank.isBanned}
                        >
                          Ban
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedBank(bank);
                          setIsAlertOpen(true);
                        }}
                        bg="red.500"
                        _hover={{ bg: "red.600" }}
                        color="white"
                        px="4"
                        py="2"
                        rounded="md"
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* Banks Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="white" rounded="lg" maxW="4xl" w="full" my="8">
            {/* Modal Header */}
            <ModalHeader borderBottomWidth="1px" p="6">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontSize="2xl" fontWeight="semibold" color="gray.800">{selectedBank || 'N/A'}</Text>
                  <Text color="gray.500">{selectedBank || 'N/A'}</Text>
                </Box>
                <Button onClick={onClose} color="gray.400" _hover={{ color: "gray.600" }}>&#10005;</Button>
              </Box>
            </ModalHeader>

            {/* Modal Body */}
            <ModalBody p="6" spaceY="6">
              {/* Banks Info */}
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap="4">
                <Box>
                  <Box display="flex" alignItems="center" spaceX="2">
                    <Text color="gray.500">📱</Text>
                    <Text fontWeight="medium">Phone:</Text>
                    <Text>{selectedBank || 'N/A'}</Text>
                  </Box>
                  <Box display="flex" alignItems="center" spaceX="2">
                    <Text color="gray.500">🏢</Text>
                    <Text fontWeight="medium">Organization:</Text>
                    <Text>{selectedBank || 'N/A'}</Text>
                  </Box>
                  <Box display="flex" alignItems="center" spaceX="2">
                    <Text color="gray.500">📅</Text>
                    <Text fontWeight="medium">Joined:</Text>
                    <Text>{selectedBank/* .createdAt?.toDate().toLocaleDateString() */ || 'N/A'}</Text>
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight="medium">Bio:</Text>
                  <Text color="gray.600" mt="1">{selectedBank || 'No bio available'}</Text>
                </Box>
              </Box>

              {/* plans Section */}
              <Box mt="8">
                <Text fontSize="xl" fontWeight="semibold" mb="4">plans ({plans.length})</Text>
                {plans.length === 0 ? (
                  <Box p="8" bg="gray.50" rounded="lg" textAlign="center">
                    <Text color="gray.500">No plans created yet</Text>
                  </Box>
                ) : (
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap="4">
                    {plans.map(plan => (
                      <Box key={plan.id} bg="gray.50" rounded="lg" p="4" _hover={{ bg: "gray.100" }} transition="colors">
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb="2">
                          <Text fontWeight="semibold" fontSize="lg">{plan.bankName}</Text>
                          <Text px="2" py="1" rounded="full" fontSize="xs" bg={plan.status === 'approved' ? 'green.100' : plan.status === 'pending' ? 'yellow.100' : 'red.100'} color={plan.status === 'approved' ? 'green.800' : plan.status === 'pending' ? 'yellow.800' : 'red.800'}>
                            {plan.status}
                          </Text>
                        </Box>

                        <Box spaceY="2" fontSize="sm">
                          <Text color="gray.600" noOfLines={2}>{plan.description}</Text>
                          
                          <Box display="flex" justifyContent="space-between" color="gray.500">
                            <Box display="flex" spaceX="2" alignItems="center">
                              <Text>👥</Text>
                              <Text>
                                {plan.registeredUsers?.length || 0}/{plan.maxParticipants} seats
                              </Text>
                            </Box>
                            <Box display="flex" spaceX="2" alignItems="center">
                              <Text>💰</Text>
                              <Text>{plan.isPaid ? `${plan.amount} INR` : 'Free'}</Text>
                            </Box>
                          </Box>

                          <Box display="flex" justifyContent="space-between" color="gray.500">
                            <Box display="flex" spaceX="2" alignItems="center">
                              <Text>📍</Text>
                              <Text noOfLines={1}>{plan.location}</Text>
                            </Box>
                            <Box display="flex" spaceX="2" alignItems="center">
                              <Text>📅</Text>
                              <Text>
                                {plan.planDates?.[0]?.startTime?.seconds 
                                  ? new Date(plan.planDates[0].startTime.seconds * 1000).toLocaleDateString()
                                  : 'N/A'
                                }
                              </Text>
                            </Box>
                          </Box>

                          {/* Updated Progress bar section */}
                          <Box mt="4">
                            <Box display="flex" justifyContent="space-between" fontSize="sm" mb="1">
                              <Text color="gray.600">Seats filled</Text>
                              <Text color="gray.600">
                                {Math.round(((plan.registeredUsers?.length || 0) / plan.maxParticipants) * 100)}%
                              </Text>
                            </Box>
                            <Box w="full" h="3" bg="gray.200" rounded="full" overflow="hidden">
                              <Box h="full" rounded="full" transition="all 500ms" bg={((plan.registeredUsers?.length || 0) / plan.maxParticipants) > 0.8 ? 'red.500' : ((plan.registeredUsers?.length || 0) / plan.maxParticipants) > 0.5 ? 'yellow.500' : 'emerald.500'} style={{ width: `${Math.min(((plan.registeredUsers?.length || 0) / plan.maxParticipants) * 100, 100)}%` }} />
                            </Box>
                            <Box display="flex" justifyContent="space-between" fontSize="xs" color="gray.500" mt="1">
                              <Text>{plan.registeredUsers?.length || 0} registered</Text>
                              <Text>{plan.maxParticipants - (plan.registeredUsers?.length || 0)} seats remaining</Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </ModalBody>

            {/* Modal Footer */}
            <ModalFooter borderTopWidth="1px" p="6" display="flex" justifyContent="flex-end">
              <Button onClick={onClose} px="4" py="2" bg="gray.100" color="gray.600" rounded="md" _hover={{ bg: "gray.200" }} transition="colors">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Bank Confirmation Dialog */}
        <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setIsAlertOpen(false)}>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Bank
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to delete this bank? This action is irreversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => {
                handleDeleteBank(selectedBank.id);
                setIsAlertOpen(false);
              }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Footer */}
        <Box mt="8" textAlign="center" color="gray.600">
          <Text>© 2025 Admin Panel. All Rights Reserved.</Text>
        </Box>
      </Box>
    </Box>
  );
}
