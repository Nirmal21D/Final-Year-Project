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
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [username, setUsername] = useState("");
  const [fundsHistory, setFundsHistory] = useState(["funds"]);
  const [profilePhoto, setProfilePhoto] = useState(
    "/images/photo-placeholder.jpg"
  );
  const fileInputRef = useRef(null);
  const toast = useToast();

  const [userTags, setUserTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [investments, setInvestments] = useState([]); // Added state for investments
  const [receipts, setReceipts] = useState([]); // Added state for receipts
  const [interests, setInterests] = useState([]); // Added state for interests

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
            setPhone(userData.phone || "");
            setSalary(userData.salary || "");
            setUsername(userData.username || "");
            setUserTags(userData.interests || []);
            setFundsHistory(
              userData.fundsHistory || ["No transaction history"]
            );
            setProfilePhoto(userData.profilePhoto || "");
            setInvestments(userData.investments || []);
            console.log(userData.investments[0].receipts[0]);
            setReceipts(userData.investments.receipts || []); // Fetch receipts
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
        phone,
        salary,
        username,
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

  return (
    <Box pb={8} px={16} maxWidth="1200px" margin="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={2}>
        COMPLETE YOUR
      </Text>
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        PROFILE
      </Text>
      <Text fontSize="sm" mb={8}>
        This information will be used to personalize your experience.
      </Text>

      <Tabs variant="enclosed" width="100%">
        <TabList>
          <Tab>User Info</Tab>
          <Tab>Certificates</Tab>
          <Tab>Investments & Receipts</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* User Info Section */}
            <Box mb={6} display={"flex"}>
              <Avatar size="2xl" src={profilePhoto} mb={4} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button
                onClick={() => fileInputRef.current.click()}
                size="sm"
                colorScheme="blue"
                mt={12}
                ml={5}
              >
                Change Profile Photo
              </Button>
            </Box>

            {renderHorizontalInput("Email", email, setEmail, "email")}
            {renderHorizontalInput("Password", passwd, setPasswd, "password")}
            {renderHorizontalInput("Phone", phone, setPhone, "number")}
            {renderHorizontalInput("Salary", salary, setSalary)}
            {renderHorizontalInput("Username", username, setUsername)}

            <Box mb={4} width="100%">
              <Text fontSize="lg" mb={2}>
                History:
              </Text>
              <Box
                bg="transparent"
                borderRadius="md"
                p={4}
                color="gray.800"
                maxHeight="100px"
                overflowY="auto"
              >
                {fundsHistory.map((fund, index) => (
                  <Text key={index}>{fund}</Text>
                ))}
              </Box>
            </Box>

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
            {/* Certificates Section */}
            <Text fontSize="lg" mb={4}>
              Your Certificates:
            </Text>
            <VStack spacing={4} align="start">
              {certificates.length > 0 ? (
                certificates.map((certificate) => (
                  <Text key={certificate.id}>{certificate.name}</Text>
                ))
              ) : (
                <Text>No certificates found.</Text>
              )}
            </VStack>
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
                      <Th>Date</Th>
                      <Th>Status</Th>
                      <Th>Receipt</Th>
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
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5}>No investment plans found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>

              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  Your Receipts
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Receipt ID</Th>
                      <Th>Description</Th>
                      <Th>Amount</Th>
                      <Th>Date</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {receipts.length > 0 ? (
                      receipts.map((receipt) => (
                        <Tr key={receipt}>
                          <Td>{receipt.id}</Td>
                          <Td>{receipt.description}</Td>
                          <Td>${receipt.amount}</Td>
                          <Td>{new Date(receipt.date).toLocaleDateString()}</Td>
                          <Td>
                            {receipt.url && (
                              <HStack spacing={2}>
                                <Link href={receipt.url} isExternal>
                                  <Button size="sm" colorScheme="blue">
                                    View
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() =>
                                    window.open(
                                      receipt.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
                                >
                                  Download
                                </Button>
                              </HStack>
                            )}
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={5}>No receipts found.</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePage;
