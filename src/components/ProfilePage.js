"use client";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  useToast,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Center,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Heading,
  Grid,
  GridItem,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [name, setName] = useState("");
  const [fundsHistory, setFundsHistory] = useState(["funds"]);
  const [profilePhoto, setProfilePhoto] = useState(
    "/images/photo-placeholder.jpg"
  );
  const fileInputRef = useRef(null);
  const toast = useToast();
  const router = useRouter();

  const [userTags, setUserTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [age, setAge] = useState("");
  const [cibilScore, setCibilScore] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setEmail(userData.email || "");
            setmobileNumber(userData.mobileNumber || "");
            setSalary(userData.salary || "");
            setName(userData.name || "");
            setUserTags(userData.interests || []);
            setFundsHistory(
              userData.fundsHistory || ["No transaction history"]
            );
            setProfilePhoto(
              userData.profilePhoto || "/images/photo-placeholder.jpg"
            );

            // Safely handle investments and receipts
            const userInvestments = userData.investments || [];
            setInvestments(userInvestments);
            setAge(userData.age || "");
            setCibilScore(userData.cibilScore || "");

            // Safely log receipt if it exists, using optional chaining
            if (
              userInvestments.length > 0 &&
              userInvestments[0]?.receipts?.length > 0
            ) {
              console.log(userInvestments[0].receipts[0]);
            }

            // Safely set receipts
            const allReceipts = [];
            userInvestments.forEach((investment) => {
              if (investment.receipts && investment.receipts.length > 0) {
                allReceipts.push(...investment.receipts);
              }
            });
            setReceipts(allReceipts);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };
    fetchUserData();
  }, [user, toast]);

  useEffect(() => {
    const fetchSuggestedTags = async () => {
      try {
        const tagsCollection = collection(db, "tags");
        const tagsSnapshot = await getDocs(tagsCollection);
        const tagsList = tagsSnapshot.docs.map((doc) => doc.data().tag);

        setSuggestedTags(tagsList);
      } catch (error) {
        console.error("Error fetching suggested tags:", error);
      }
    };

    fetchSuggestedTags();
  }, []);

  useEffect(() => {
    const fetchInterests = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setInterests(userData.interests || []);
        console.log(interests);
      }
    };
    fetchInterests();
  }, [user]);

  useEffect(() => {
    const fetchLoanApplications = async () => {
      if (user) {
        setLoadingApplications(true);
        try {
          const applicationsRef = collection(db, "loanApplications");
          const q = query(applicationsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const applications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setLoanApplications(applications);
        } catch (error) {
          console.error("Error fetching loan applications:", error);
          toast({
            title: "Error",
            description: "Failed to load loan applications",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoadingApplications(false);
        }
      }
    };

    fetchLoanApplications();
  }, [user, toast]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = async (tag) => {
    if (!userTags.includes(tag) && userTags.length < 5) {
      const newTags = [...userTags, tag];
      setUserTags(newTags);

      try {
        await updateDoc(doc(db, "users", user.uid), {
          interests: newTags,
        });
        toast({
          title: "Interest Added",
          description: "Your investment interest has been updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating tags:", error);
        toast({
          title: "Error",
          description: "Failed to update interests",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
    setTagInput("");
  };

  const handleRemoveTag = async (tagToRemove) => {
    const newTags = userTags.filter((tag) => tag !== tagToRemove);
    setUserTags(newTags);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        interests: newTags,
      });
      toast({
        title: "Interest Removed",
        description: "Your investment interest has been updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "Failed to remove interest",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const saveProfile = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        email,
        mobileNumber,
        salary,
        name,
        profilePhoto,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderHorizontalInput = (label, value, onChange, type = "text") => (
    <Flex mb={4} width="100%" alignItems="center">
      <Text width="40%" fontWeight="bold" mr={4}>
        {label}
      </Text>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="transparent"
        color="black"
        size="lg"
        flex="1"
        borderColor={"black"}
      />
    </Flex>
  );

  useEffect(() => {
    const fetchCertificates = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const certificates = userData.certificates || [];
            setCertificates(certificates);
          }
        } catch (error) {
          console.error("Error fetching certificates:", error);
        }
      }
    };
    fetchCertificates();
  }, [user]);

  const handleViewApplicationDetails = (application) => {
    setSelectedApplication(application);
    onOpen();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box pb={8} px={16} maxWidth="1200px" margin="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={2}>
        YOUR PROFILE
      </Text>

      <Text fontSize="sm" mb={8}>
        This information will be used to personalize your experience.
      </Text>

      <Tabs variant="enclosed" width="100%">
        <TabList>
          <Tab>User Info</Tab>
          <Tab>Investments & Receipts</Tab>
          <Tab>My Applications</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* User Info Section */}

            {renderHorizontalInput("Email", email, setEmail, "email")}
            {renderHorizontalInput(
              "Mobile Number",
              mobileNumber,
              setmobileNumber,
              "number"
            )}
            {renderHorizontalInput("Salary", salary, setSalary)}
            {renderHorizontalInput("Name", name, setName)}
            {renderHorizontalInput("Age", age, setAge)}
            {renderHorizontalInput("CIBIL Score", cibilScore, setCibilScore)}

            {/* Interest Tags Section */}
            <Box w="100%">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Your Investment Interests
              </Text>

              <HStack mb={2}>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add your interests"
                />
                <Button
                  onClick={() => handleAddTag(tagInput)}
                  isDisabled={userTags.length >= 5 || !tagInput.trim()}
                >
                  Add
                </Button>
              </HStack>

              {/* Display user's tags */}
              <Wrap spacing={2} mb={4}>
                {userTags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag size="md" colorScheme="blue" borderRadius="full">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>

              {/* Suggested tags */}
              <Text mb={2} fontWeight="bold">
                Suggested Interests:
              </Text>
              <Wrap spacing={2}>
                {suggestedTags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="md"
                      colorScheme="gray"
                      borderRadius="full"
                      cursor="pointer"
                      onClick={() => handleAddTag(tag)}
                      _hover={{ bg: "blue.100" }}
                    >
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Button
                mt={10}
                color="#ebeff4"
                colorScheme="teal"
                onClick={saveProfile}
                width="30%"
                mb={4}
              >
                Save Profile
              </Button>
            </Box>
          </TabPanel>

          <TabPanel>
            {/* Investments & Receipts Section */}
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Your Investment Plans
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Plan Name</Th>
                      <Th>Amount</Th>
                      <Th>Receipt</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {investments.length > 0 ? (
                      investments.map((investment) => (
                        <Tr key={investment.planId}>
                          <Td>{investment.planName}</Td>
                          <Td>${investment.amount}</Td>
                          <Td>
                            {investment.receipts ? (
                              <HStack spacing={2}>
                                <Link href={investment.receipts[0]}>
                                  <Button
                                    size="sm"
                                    colorScheme="blue"
                                    onClick={() =>
                                      window.open(investment.receipts)
                                    }
                                  >
                                    View
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() =>
                                    window.open(investment.receipts)
                                  }
                                >
                                  Download
                                </Button>
                              </HStack>
                            ) : (
                              <Text>No receipt</Text>
                            )}
                          </Td>
                          <Td>
                            {new Date(
                              investment.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={6}>No investment plans found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            {/* Loan Applications Section */}
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Your Loan Applications
                </Text>

                {loadingApplications ? (
                  <Center p={10}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                  </Center>
                ) : loanApplications.length === 0 ? (
                  <Box
                    p={10}
                    textAlign="center"
                    borderWidth="1px"
                    borderRadius="lg"
                  >
                    <Text color="gray.500">
                      You haven't applied for any loans yet.
                    </Text>
                    <Button
                      mt={4}
                      colorScheme="blue"
                      onClick={() => router.push("/loans")}
                    >
                      Browse Loan Options
                    </Button>
                  </Box>
                ) : (
                  <Table
                    variant="simple"
                    bg="white"
                    shadow="sm"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Loan Details</Th>
                        <Th>Amount</Th>
                        <Th>Date Applied</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loanApplications.map((application) => (
                        <Tr
                          key={application.id}
                          _hover={{ bg: "gray.50" }}
                          bg={
                            application.applicationStatus?.status === "approved"
                              ? "green.50"
                              : application.applicationStatus?.status ===
                                "rejected"
                              ? "red.50"
                              : application.applicationStatus?.status ===
                                "under_review"
                              ? "orange.50"
                              : undefined
                          }
                        >
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">
                                {application.loanDetails?.loanPlanName ||
                                  "Loan Application"}
                              </Text>
                              <Badge colorScheme="purple" fontSize="xs">
                                {application.loanDetails?.loanCategory ||
                                  "Unknown"}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontWeight="medium">
                              ₹
                              {application.loanDetails?.loanAmount?.toLocaleString() ||
                                "0"}
                            </Text>
                          </Td>
                          <Td>
                            {application.applicationStatus?.submittedAt
                              ?.toDate()
                              ?.toLocaleDateString() || "N/A"}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                application.applicationStatus?.status ===
                                "approved"
                                  ? "green"
                                  : application.applicationStatus?.status ===
                                    "rejected"
                                  ? "red"
                                  : application.applicationStatus?.status ===
                                    "under_review"
                                  ? "orange"
                                  : "blue"
                              }
                              p={1}
                              borderRadius="md"
                            >
                              {application.applicationStatus?.status?.toUpperCase() ||
                                "PENDING"}
                            </Badge>
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() =>
                                handleViewApplicationDetails(application)
                              }
                            >
                              View Details
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Application Details Modal */}
      {selectedApplication && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              bg={
                selectedApplication.applicationStatus?.status === "approved"
                  ? "green.500"
                  : selectedApplication.applicationStatus?.status === "rejected"
                  ? "red.500"
                  : selectedApplication.applicationStatus?.status ===
                    "under_review"
                  ? "orange.500"
                  : "blue.500"
              }
              color="white"
              borderTopRadius="md"
            >
              <Flex justify="space-between" align="center">
                <Box>
                  Loan Application #
                  {selectedApplication.applicationId ||
                    selectedApplication.id.slice(0, 8)}
                </Box>
                <Badge
                  fontSize="md"
                  colorScheme="white"
                  variant="solid"
                  py={1}
                  px={3}
                  bg="whiteAlpha.300"
                >
                  {selectedApplication.applicationStatus?.status?.toUpperCase() ||
                    "PENDING"}
                </Badge>
              </Flex>
            </ModalHeader>
            <ModalCloseButton color="white" />

            <ModalBody py={6}>
              <Grid templateColumns="1fr" gap={6}>
                {/* Application Summary */}
                <Box>
                  <Heading size="md" mb={4}>
                    Loan Summary
                  </Heading>
                  <VStack
                    align="start"
                    spacing={3}
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                  >
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Plan Name:
                      </Text>
                      <Text>
                        {selectedApplication.loanDetails?.loanPlanName}
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Loan Category:
                      </Text>
                      <Badge colorScheme="purple">
                        {selectedApplication.loanDetails?.loanCategory}
                      </Badge>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Amount Requested:
                      </Text>
                      <Text fontWeight="bold" color="blue.600">
                        ₹
                        {selectedApplication.loanDetails?.loanAmount?.toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Interest Rate:
                      </Text>
                      <Text>
                        {selectedApplication.loanDetails?.interestRate}%
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Tenure:
                      </Text>
                      <Text>
                        {selectedApplication.loanDetails?.tenure} months
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Monthly EMI:
                      </Text>
                      <Text fontWeight="bold" color="green.600">
                        ₹
                        {Math.round(
                          selectedApplication.loanDetails?.emi
                        )?.toLocaleString()}
                        /month
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Purpose:
                      </Text>
                      <Text>
                        {selectedApplication.loanDetails?.purpose ||
                          "Not specified"}
                      </Text>
                    </HStack>
                    <HStack w="full">
                      <Text fontWeight="bold" w="180px">
                        Applied On:
                      </Text>
                      <Text>
                        {formatDate(
                          selectedApplication.applicationStatus?.submittedAt
                        )}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Status History Section */}
                <Box>
                  <Heading size="md" mb={4}>
                    Application Status
                  </Heading>
                  <VStack align="start" spacing={0}>
                    <HStack
                      bg="blue.50"
                      p={3}
                      borderTopRadius="md"
                      borderLeft="4px solid"
                      borderColor="blue.500"
                      w="full"
                    >
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg="blue.500"
                        color="white"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        1
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Application Submitted</Text>
                        <Text fontSize="sm">
                          {formatDate(
                            selectedApplication.applicationStatus?.submittedAt
                          )}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack
                      bg={
                        selectedApplication.applicationStatus?.status !==
                        "pending"
                          ? "orange.50"
                          : "gray.100"
                      }
                      p={3}
                      borderLeft="4px solid"
                      borderColor={
                        selectedApplication.applicationStatus?.status !==
                        "pending"
                          ? "orange.500"
                          : "gray.300"
                      }
                      w="full"
                    >
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={
                          selectedApplication.applicationStatus?.status !==
                          "pending"
                            ? "orange.500"
                            : "gray.300"
                        }
                        color="white"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        2
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Under Review</Text>
                        <Text fontSize="sm">
                          {selectedApplication.applicationStatus?.status !==
                          "pending"
                            ? "Application is being processed"
                            : "Waiting for review"}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack
                      bg={
                        selectedApplication.applicationStatus?.status ===
                          "approved" ||
                        selectedApplication.applicationStatus?.status ===
                          "rejected"
                          ? selectedApplication.applicationStatus?.status ===
                            "approved"
                            ? "green.50"
                            : "red.50"
                          : "gray.100"
                      }
                      p={3}
                      borderLeft="4px solid"
                      borderColor={
                        selectedApplication.applicationStatus?.status ===
                        "approved"
                          ? "green.500"
                          : selectedApplication.applicationStatus?.status ===
                            "rejected"
                          ? "red.500"
                          : "gray.300"
                      }
                      w="full"
                    >
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={
                          selectedApplication.applicationStatus?.status ===
                          "approved"
                            ? "green.500"
                            : selectedApplication.applicationStatus?.status ===
                              "rejected"
                            ? "red.500"
                            : "gray.300"
                        }
                        color="white"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        3
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Final Decision</Text>
                        <Text fontSize="sm">
                          {selectedApplication.applicationStatus?.status ===
                          "approved"
                            ? "Application approved"
                            : selectedApplication.applicationStatus?.status ===
                              "rejected"
                            ? "Application rejected"
                            : "Pending decision"}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ProfilePage;
