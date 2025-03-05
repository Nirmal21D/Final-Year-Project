"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Spinner,
  Card,
  CardBody,
  Text,
  Heading,
  Link,
  SimpleGrid,
  Badge,
  VStack,
  Skeleton,
  Container,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  FormErrorMessage,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Avatar,
  Center,
  AvatarBadge,
} from "@chakra-ui/react";
import { ChatIcon, AddIcon } from "@chakra-ui/icons";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Headers from "@/components/Headers";
import Chat from "@/components/chat";
import Welcome from "@/components/Welcome";
import Footer from "@/components/footer";

const MainPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suggestedInterests, setSuggestedInterests] = useState([
    "Stocks", "Bonds", "Real Estate", "Mutual Funds", 
    "Cryptocurrency", "Gold", "Fixed Deposits", "Retirement", "Tax Saving"
  ]);
  const [interestInput, setInterestInput] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    mobileNumber: "",
    age: "",
    salary: "",
    cibilScore: "",
    interests: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [profilePhoto, setProfilePhoto] = useState("/images/photo-placeholder.jpg");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansCollection = collection(db, "investmentplans");
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans from Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Update the user auth useEffect to include profile photo
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      setUser(userAuth);
      if (userAuth) {
        try {
          const userDocRef = doc(db, "users", userAuth.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserProfile(userData);
            setUserInterests(userData.interests || []);
            // Set profile photo if it exists
            if (userData.profilePhoto) {
              setProfilePhoto(userData.profilePhoto);
            }
            
            const requiredFields = [
              { key: 'name', label: 'Name' },
              { key: 'mobileNumber', label: 'Mobile Number' },
              { key: 'age', label: 'Age' },
              { key: 'salary', label: 'Salary' },
              { key: 'cibilScore', label: 'CIBIL Score' },
              { key: 'interests', label: 'Investment Interests' }
            ];
            
            const missing = requiredFields.filter(field => {
              if (field.key === 'interests') {
                return !userData[field.key] || userData[field.key].length === 0;
              }
              return !userData[field.key];
            });
            
            setMissingFields(missing);
            
            if (missing.length > 0) {
              setFormValues({
                name: userData.name || "",
                mobileNumber: userData.mobileNumber || "",
                age: userData.age || "",
                salary: userData.salary || "",
                cibilScore: userData.cibilScore || "",
                interests: userData.interests || [],
              });
              onOpen();
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [onOpen]);

  // Add this function to handle fetching suggested interests from Firestore
  useEffect(() => {
    const fetchSuggestedInterests = async () => {
      try {
        const tagsCollection = collection(db, "tags");
        const tagsSnapshot = await getDocs(tagsCollection);
        
        if (!tagsSnapshot.empty) {
          const tagsList = tagsSnapshot.docs.map(doc => doc.data().tag);
          setSuggestedInterests(tagsList);
        }
      } catch (error) {
        console.error("Error fetching suggested interests:", error);
      }
    };
    
    fetchSuggestedInterests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  // Add this function to handle file uploads
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, file);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update state
        setProfilePhoto(downloadURL);
        
        // Clear any existing error
        if (formErrors.profilePhoto) {
          setFormErrors({
            ...formErrors,
            profilePhoto: undefined
          });
        }
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        setFormErrors({
          ...formErrors,
          profilePhoto: "Failed to upload image. Please try again."
        });
      }
    }
  };

  // Update the validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formValues.name.trim()) errors.name = "Name is required";
    if (!formValues.mobileNumber.trim()) errors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formValues.mobileNumber)) errors.mobileNumber = "Enter a valid 10-digit mobile number";
    
    if (!formValues.age) errors.age = "Age is required";
    else if (isNaN(formValues.age) || parseInt(formValues.age) < 18) errors.age = "Age must be at least 18";
    
    if (!formValues.salary) errors.salary = "Salary is required";
    else if (isNaN(formValues.salary)) errors.salary = "Salary must be a number";
    
    if (!formValues.cibilScore) errors.cibilScore = "CIBIL Score is required";
    else if (isNaN(formValues.cibilScore) || parseInt(formValues.cibilScore) < 300 || parseInt(formValues.cibilScore) > 900) 
      errors.cibilScore = "CIBIL Score must be between 300-900";
    
    if (!formValues.interests || formValues.interests.length === 0)
      errors.interests = "Please select at least one investment interest";
    
    return errors;
  };

  // Update the submit handler to include profilePhoto
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        ...userProfile,
        name: formValues.name,
        mobileNumber: formValues.mobileNumber,
        age: parseInt(formValues.age),
        salary: parseFloat(formValues.salary),
        cibilScore: parseInt(formValues.cibilScore),
        interests: formValues.interests,
        profilePhoto: profilePhoto, // Add this line to include profilePhoto
      }, { merge: true });
      
      // Update local state with new values
      setUserInterests(formValues.interests);
      setMissingFields([]);
      onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these functions to handle interest management
  const handleAddInterest = (interest) => {
    if (!formValues.interests.includes(interest) && formValues.interests.length < 5 && interest.trim()) {
      setFormValues({
        ...formValues,
        interests: [...formValues.interests, interest]
      });
      
      if (formErrors.interests) {
        setFormErrors({
          ...formErrors,
          interests: undefined
        });
      }
    }
    setInterestInput("");
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormValues({
      ...formValues,
      interests: formValues.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const filteredPlans = plans.filter(
    (plan) => plan.tags && plan.tags.some((tag) => userInterests.includes(tag))
  );

  return (
    <Box>
      {/* Fixed Header */}
      <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      {/* Hero Section */}
      <Box
        position="relative"
        height="100vh"
        width="100%"
        backgroundImage="url('/images/bg1.jpg')" // Replace with your actual image URL
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        {/* Dark gradient overlay */}
        <Box
          position="absolute"
          top="0"
          right="0"
          width="100%"
          height="100%"
          background="linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.8))"
        />

        {/* Hero Content */}
        <Container
          maxW="container.xl"
          height="100%"
          position="relative"
          zIndex="1"
        >
          <Stack
            height="100%"
            justifyContent="center"
            alignItems="flex-start"
            spacing="6"
            maxW="xl"
          >
            <Welcome />
            {/* <Heading
              color="white"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
            >
              Invest in Your Future
            </Heading>
            <Text
              color="gray.100"
              fontSize={{ base: "lg", md: "xl" }}
              maxW="lg"
            >
              Discover personalized investment plans tailored to your goals.
              Start your journey to financial freedom today with our expert
              guidance and proven strategies.
            </Text> */}
          </Stack>
        </Container>
      </Box>

      {/* Recommended Plans Section */}
      <Box bg="gray.50" py="16" background="rgba(0,128,128,0.08)">
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb="8">
            Recommended For you
          </Heading>
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} height="250px" borderRadius="lg" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
                  as={Link}
                  href={`/plan1/${plan.id}`}
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "transform 0.3s ease",
                  }}
                  bg="gray.50"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <CardBody>
                    <VStack align="stretch" spacing="4">
                      <Heading size="md">{plan.planName}</Heading>
                      <Text fontSize="3xl" fontWeight="bold">
                        ${plan.minAmount}
                        <Box as="span" fontSize="sm" fontWeight="normal" ml="1">
                          /month
                        </Box>
                      </Text>
                      <Badge colorScheme="green" alignSelf="flex-start">
                        {plan.interestRate}% Interest Rate
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        Click to view plan details
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      {/* Chat Interface */}
      {isChatOpen && (
        <Box
          position="fixed"
          bottom="20"
          right="4"
          width="350px"
          height="500px"
          borderRadius="xl"
          boxShadow="lg"
          backdropFilter="blur(50px)"
          bg="rgba(45, 55, 72, 0.2)"
          zIndex={999}
        >
          <Chat />
        </Box>
      )}

      <IconButton
        position="fixed"
        bottom="4"
        right="4"
        size="lg"
        borderRadius="full"
        colorScheme={isChatOpen ? "red" : "blue"}
        icon={<ChatIcon />}
        boxShadow="lg"
        zIndex={1000}
        aria-label={isChatOpen ? "Close Chat" : "Open Chat"}
        onClick={toggleChat}
      />
      
      {/* Profile Completion Modal */}
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete Your Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please provide the following information to get personalized investment recommendations:</Text>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {/* Profile Photo Upload */}
                <FormControl>
                  <FormLabel textAlign="center">Profile Photo</FormLabel>
                  <Center>
                    <Avatar 
                      size="xl" 
                      src={profilePhoto}
                      cursor="pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AvatarBadge boxSize="1em" bg="green.500" border="none">
                        <AddIcon color="white" boxSize="0.6em" />
                      </AvatarBadge>
                    </Avatar>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Center>
                  {formErrors.profilePhoto && (
                    <Text color="red.500" fontSize="sm" textAlign="center" mt={2}>
                      {formErrors.profilePhoto}
                    </Text>
                  )}
                </FormControl>

                {/* Existing form controls */}
                <FormControl isInvalid={formErrors.name} isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input 
                    name="name" 
                    value={formValues.name} 
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={formErrors.mobileNumber} isRequired>
                  <FormLabel>Mobile Number</FormLabel>
                  <Input 
                    name="mobileNumber" 
                    value={formValues.mobileNumber} 
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.mobileNumber}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={formErrors.age} isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input 
                    name="age" 
                    value={formValues.age} 
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.age}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={formErrors.salary} isRequired>
                  <FormLabel>Monthly Salary</FormLabel>
                  <Input 
                    name="salary" 
                    value={formValues.salary} 
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.salary}</FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={formErrors.cibilScore} isRequired>
                  <FormLabel>CIBIL Score</FormLabel>
                  <Input 
                    name="cibilScore" 
                    value={formValues.cibilScore} 
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{formErrors.cibilScore}</FormErrorMessage>
                </FormControl>

                {/* Interest selection */}
                <FormControl isInvalid={formErrors.interests} isRequired>
                  <FormLabel>Investment Interests</FormLabel>
                  
                  <HStack mb={2}>
                    <Input
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Add investment interest"
                    />
                    <Button
                      onClick={() => handleAddInterest(interestInput)}
                      isDisabled={formValues.interests.length >= 5 || !interestInput.trim()}
                    >
                      Add
                    </Button>
                  </HStack>
                  
                  {/* Display selected interests */}
                  <Wrap spacing={2} mb={4}>
                    {formValues.interests.map((interest) => (
                      <WrapItem key={interest}>
                        <Tag size="md" colorScheme="blue" borderRadius="full">
                          <TagLabel>{interest}</TagLabel>
                          <TagCloseButton onClick={() => handleRemoveInterest(interest)} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  
                  {/* Suggested interests */}
                  <Text mb={2} fontWeight="bold">
                    Suggested Interests:
                  </Text>
                  <Wrap spacing={2}>
                    {suggestedInterests
                      .filter(interest => !formValues.interests.includes(interest))
                      .map((interest) => (
                        <WrapItem key={interest}>
                          <Tag
                            size="md"
                            colorScheme="gray"
                            borderRadius="full"
                            cursor="pointer"
                            onClick={() => handleAddInterest(interest)}
                            _hover={{ bg: "blue.100" }}
                          >
                            <TagLabel>{interest}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                  </Wrap>
                  
                  <FormErrorMessage>{formErrors.interests}</FormErrorMessage>
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </Box>
  );
};

export default MainPage;
