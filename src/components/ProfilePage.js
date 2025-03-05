"use client";
import { Box, Button, Input, Text, Flex, useToast, VStack, HStack, Wrap, WrapItem, Tag, TagLabel, TagCloseButton, Avatar, Tabs, TabList, Tab, TabPanels, TabPanel, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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
  const [mobileNumber, setmobileNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [name, setName] = useState("");
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
  const [investments, setInvestments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [age, setAge] = useState("");
  const [cibilScore, setCibilScore] = useState("");


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
            setProfilePhoto(userData.profilePhoto || "/images/photo-placeholder.jpg");
            
            // Safely handle investments and receipts
            const userInvestments = userData.investments || [];
            setInvestments(userInvestments);
            setAge(userData.age || "");
            setCibilScore(userData.cibilScore || "");
            
            // Safely log receipt if it exists, using optional chaining
            if (userInvestments.length > 0 && userInvestments[0]?.receipts?.length > 0) {
              console.log(userInvestments[0].receipts[0]);
            }
            
            // Safely set receipts
            const allReceipts = [];
            userInvestments.forEach(investment => {
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
            {renderHorizontalInput("Mobile Number", mobileNumber, setmobileNumber, "number")}
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
                          <Td>{new Date(investment.timestamp.seconds * 1000).toLocaleString()}</Td>
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
        </TabPanels>
      </Tabs>
    </Box>
  );
};


export default ProfilePage;
