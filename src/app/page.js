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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Divider,
  Image,
  Progress,
  useToast,
  InputGroup,
  InputRightElement,
  ButtonGroup,
  Icon,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  keyframes
} from "@chakra-ui/react";
import { 
  ChatIcon, 
  AddIcon, 
  SearchIcon, 
  StarIcon, 
  TimeIcon,
  CheckCircleIcon, 
  InfoIcon
} from "@chakra-ui/icons";
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiBarChart2, 
  FiStar, 
  FiCheckCircle, 
  FiArrowRight,
  FiShield,
  FiActivity,
  FiFilter
} from "react-icons/fi";
import { motion } from "framer-motion";
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, limit, where } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Headers from "@/components/Headers";
import Chat from "@/components/chat";
import Welcome from "@/components/Welcome";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCard = motion(Card);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [trendingPlans, setTrendingPlans] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const toast = useToast();
  const router = useRouter();
  
  // Calculate profile completeness
  useEffect(() => {
    if (user && userProfile) {
      const requiredFields = [
        'name', 'mobileNumber', 'age', 'salary', 'cibilScore', 'profilePhoto', 'interests'
      ];
      
      let completedFields = 0;
      requiredFields.forEach(field => {
        if (field === 'interests') {
          if (userProfile[field] && userProfile[field].length > 0) completedFields++;
        } else if (userProfile[field]) {
          completedFields++;
        }
      });
      
      const percentage = Math.round((completedFields / requiredFields.length) * 100);
      setProfileCompleteness(percentage);
    }
    
  }, [user, userProfile]);

  // Fetch all investment plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const plansCollection = collection(db, "investmentplans");
        const plansSnapshot = await getDocs(plansCollection);
        const plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlans(plansData);
        
        // Get featured plans (highest interest rate)
        const featuredPlans = [...plansData]
          .sort((a, b) => b.interestRate - a.interestRate)
          .slice(0, 3);
        setFeaturedPlans(featuredPlans);
        
        // Get trending plans (most popular or recently added)
        const trendingPlans = [...plansData]
          .sort((a, b) => b.popularity - a.popularity || b.createdAt - a.createdAt)
          .slice(0, 4);
        setTrendingPlans(trendingPlans);
      } catch (error) {
        console.error("Error fetching plans from Firebase:", error);
        toast({
          title: "Error",
          description: "Failed to load investment plans",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]);

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
            if(!userData.userType){
              router.push("/bankdashboard");
            }
            setUserProfile(userData);
            setUserInterests(userData.interests || []);
            
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

  // Fetch suggested interests
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
        profilePhoto: profilePhoto,
      }, { merge: true });
      
      // Update local state
      setUserInterests(formValues.interests);
      setMissingFields([]);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
  
  // Filter plans based on user interests and search query
  const filteredPlans = plans.filter(
    (plan) => {
      // Category filter
      if (selectedCategory !== "All" && plan.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !plan.planName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Interest filter (only if user has interests)
      if (userInterests.length > 0) {
        return plan.tags && plan.tags.some((tag) => userInterests.includes(tag));
      }
      
      return true;
    }
  );

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  // Plan categories
  const categories = [
    "All",
    "Stocks", 
    "Bonds", 
    "Mutual Funds", 
    "Fixed Deposits", 
    "Real Estate", 
    "Cryptocurrency"
  ];

  return (
    <Box>
      {/* Fixed Header */}
      <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
        <Headers />
      </Box>

      {/* Hero Section with Animated Elements */}
      <Box
        position="relative"
        height="100vh"
        width="100%"
        backgroundImage="url('/images/bg1.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        pt="70px" // Add padding top to account for the fixed header
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
          <Grid
            height="100%"
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={8}
            alignItems="center"
          >
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Welcome />
              </MotionBox>
            </GridItem>
            
            <GridItem display={{ base: "none", lg: "block" }}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card 
                  bg="rgba(255, 255, 255, 0.9)"
                  backdropFilter="blur(10px)"
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="2xl"
                >
                  <CardBody p={8}>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color="teal.700">Start Your Investment Journey</Heading>
                      
                      {user ? (
  <>
    <Box>
      {profileCompleteness < 100 ? (
        <>
          <Text mb={2} fontWeight="medium">Profile Completion</Text>
          <Progress 
            value={profileCompleteness} 
            colorScheme="teal" 
            borderRadius="full" 
            size="sm"
            hasStripe
          />
          <Flex justify="space-between" mt={1}>
            <Text fontSize="sm" color="gray.600">{profileCompleteness}% Complete</Text>
            <Text 
              fontSize="sm" 
              color="teal.600" 
              fontWeight="medium" 
              cursor="pointer"
              onClick={onOpen}
              _hover={{ textDecoration: "underline" }}
            >
              Complete Now
            </Text>
          </Flex>
        </>
      ) : (
        <Flex 
          bg="green.50" 
          p={3} 
          borderRadius="md" 
          align="center"
          color="green.700"
        >
          <Icon as={FiCheckCircle} mr={3} boxSize={5} />
          <Text fontWeight="medium">Profile Completed</Text>
        </Flex>
      )}
    </Box>
    
    <SimpleGrid columns={2} spacing={4}>
      <Link href="/plan1">
        <Button 
          variant="outline" 
          colorScheme="teal" 
          size="lg" 
          width="full"
          borderRadius="full"
          rightIcon={<FiBarChart2 />}
        >
          Explore Plans
        </Button>
      </Link>
      <Link href="/loanplans">
        <Button 
          colorScheme="teal"
          size="lg"
          width="full"
          borderRadius="full"
          rightIcon={<FiDollarSign />}
        >
          Apply for Loan
        </Button>
      </Link>
    </SimpleGrid>
  </>
) : (
  <>
    <Text color="gray.600">
      Create an account to discover personalized investment recommendations 
      and manage your financial goals.
    </Text>
    <SimpleGrid columns={2} spacing={4}>
      <Link href="/login">
        <Button 
          variant="outline" 
          colorScheme="teal" 
          size="lg" 
          width="full"
          borderRadius="full"
        >
          Log In
        </Button>
      </Link>
      <Link href="/signup">
        <Button 
          colorScheme="teal"
          size="lg"
          width="full"
          borderRadius="full"
        >
          Sign Up
        </Button>
      </Link>
    </SimpleGrid>
  </>
)}
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Featured Plans Section */}
      <Box py={16} bg="gray.50">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" mb={8}>
            <Heading as="h2" size="xl">
              Featured Plans
            </Heading>
            <Link href="/plan1">
              <Button rightIcon={<FiArrowRight />} colorScheme="teal" variant="ghost">
                View All Plans
              </Button>
            </Link>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} height="300px" borderRadius="lg" />
              ))
            ) : (
              featuredPlans.map((plan, index) => (
                <MotionCard
                  key={plan.id}
                  as={Link}
                  href={`/plan1/${plan.id}`}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={cardVariants}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  bg="white"
                  _hover={{ transform: "translateY(-8px)", boxShadow: "xl", transition: "all 0.3s ease" }}
                >
                  <Box h="8px" bg="teal.500" />
                  <CardBody p={6}>
                    <Badge 
                      colorScheme="teal" 
                      fontSize="0.8em" 
                      mb={2}
                    >
                      FEATURED
                    </Badge>
                    <Heading size="md" mb={3}>{plan.planName}</Heading>
                    <Text color="gray.600" noOfLines={2} mb={4}>
                      {plan.description || "Invest in this high-return plan with excellent benefits"}
                    </Text>
                    
                    <Divider my={4} />
                    
                    <SimpleGrid columns={2} spacing={4} mb={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Interest Rate</Text>
                        <Text fontSize="xl" fontWeight="bold" color="teal.600">
                          {plan.interestRate}%
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500">Min Investment</Text>
                        <Text fontSize="xl" fontWeight="bold">
                        ₹{plan.minAmount}
                        </Text>
                      </Box>
                    </SimpleGrid>
                    
                    <HStack mt={4} spacing={2}>
                      {plan.tags && plan.tags.slice(0, 3).map(tag => (
                        <Tag key={tag} size="sm" colorScheme="gray" borderRadius="full">
                          {tag}
                        </Tag>
                      ))}
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))
            )}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Recommended Plans Section */}
      <Box py={16} background="rgba(0,128,128,0.08)">
        <Container maxW="container.xl">
          <Box mb={8}>
            <Heading as="h2" size="xl" mb={3}>
              Recommended For You
            </Heading>
            <Text color="gray.600" fontSize="md">
              {user ? 
                "Based on your interests and investment profile" : 
                "Create an account to get personalized recommendations"}
            </Text>
          </Box>
          
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} height="250px" borderRadius="lg" />
              ))}
            </SimpleGrid>
          ) : (user && userInterests.length > 0) ? (
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              as={SimpleGrid}
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={6}
            >
              {/* Update filtering logic to only filter by user interests, no categories or search */}
              {plans
                .filter(plan => plan.tags && plan.tags.some(tag => userInterests.includes(tag)))
                .slice(0, 6) // Limit to 6 plans
                .map((plan) => (
                  <MotionCard
                    key={plan.id}
                    variants={cardVariants}
                    as={Link}
                    href={`/plan1/${plan.id}`}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg="white"
                    _hover={{
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                      boxShadow: "lg",
                    }}
                  >
                    <CardBody p={6}>
                      <Flex justify="space-between" align="start" mb={3}>
                        <Heading size="md">{plan.planName}</Heading>
                        <Badge colorScheme="green">{plan.interestRate}%</Badge>
                      </Flex>
                      
                      <Text fontSize="sm" color="gray.600" noOfLines={2} mb={4}>
                        {plan.description || "A great investment opportunity with competitive returns."}
                      </Text>
                      
                      <Divider my={3} />
                      
                      <SimpleGrid columns={2} spacing={4} mb={3}>
                        <Box>
                          <Text fontSize="xs" color="gray.500">Min Investment</Text>
                          <Text fontSize="lg" fontWeight="semibold">
                          ₹{plan.minAmount}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500">Duration</Text>
                          <Text fontSize="lg" fontWeight="semibold">
                            {plan.duration || "Flexible"}
                          </Text>
                        </Box>
                      </SimpleGrid>
                      
                      <HStack mt={3} spacing={2} flexWrap="wrap">
                        {plan.tags && plan.tags.slice(0, 3).map(tag => (
                          <Tag key={tag} size="sm" colorScheme="teal" variant="subtle" borderRadius="full">
                            {tag}
                          </Tag>
                        ))}
                      </HStack>
                    </CardBody>
                  </MotionCard>
                ))}
            </MotionBox>
          ) : (
            <Box 
              textAlign="center" 
              py={10} 
              px={6} 
              borderRadius="lg" 
              bg="white" 
              boxShadow="sm"
            >
              <InfoIcon boxSize={10} color="teal.500" mb={4} />
              <Heading as="h3" size="lg" mb={2}>
                {user ? "Complete Your Profile" : "Create an Account"}
              </Heading>
              <Text color="gray.600" mb={5}>
                {user 
                  ? "Add your investment interests to see personalized recommendations." 
                  : "Sign up to get personalized investment recommendations based on your profile."}
              </Text>
              <Button 
                colorScheme="teal"
                onClick={() => user ? onOpen() : router.push('/signup')}
              >
                {user ? "Update Profile" : "Sign Up"}
              </Button>
            </Box>
          )}

          {/* Add a view more button at the bottom if there are plans */}
          {!isLoading && user && userInterests.length > 0 && plans.filter(plan => 
            plan.tags && plan.tags.some(tag => userInterests.includes(tag))
          ).length > 0 && (
            <Flex justify="center" mt={8}>
              <Button
                colorScheme="teal"
                variant="outline"
                size="lg"
                rightIcon={<FiArrowRight />}
                onClick={() => router.push('/plan1')}
              >
                View All Recommended Plans
              </Button>
            </Flex>
          )}
        </Container>
      </Box>
      
      {/* Key Benefits Section */}
      <Box py={16} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="800px" mx="auto">
              <Heading size="xl" mb={4}>Why Choose Finance Mastery</Heading>
              <Text color="gray.600" fontSize="lg">
                Experience the advantages of smart investing with our platform's unique features
              </Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <VStack spacing={4} align="start">
                  <Flex
                    w={14}
                    h={14}
                    justify="center"
                    align="center"
                    borderRadius="full"
                    bg="teal.100"
                    color="teal.700"
                  >
                    <Icon as={FiTrendingUp} boxSize={6} />
                  </Flex>
                  <Heading size="md">Higher Returns</Heading>
                  <Text color="gray.600">
                    Access investment plans with higher returns than traditional savings accounts
                  </Text>
                </VStack>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <VStack spacing={4} align="start">
                  <Flex
                    w={14}
                    h={14}
                    justify="center"
                    align="center"
                    borderRadius="full"
                    bg="teal.100"
                    color="teal.700"
                  >
                    <Icon as={FiShield} boxSize={6} />
                  </Flex>
                  <Heading size="md">Secure Investments</Heading>
                  <Text color="gray.600">
                    Invest with confidence knowing your funds are secure and protected
                  </Text>
                </VStack>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <VStack spacing={4} align="start">
                  <Flex
                    w={14}
                    h={14}
                    justify="center"
                    align="center"
                    borderRadius="full"
                    bg="teal.100"
                    color="teal.700"
                  >
                    <Icon as={FiActivity} boxSize={6} />
                  </Flex>
                  <Heading size="md">Expert Guidance</Heading>
                  <Text color="gray.600">
                    Receive personalized advice and support from our financial experts
                  </Text>
                </VStack>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <VStack spacing={4} align="start">
                  <Flex
                    w={14}
                    h={14}
                    justify="center"
                    align="center"
                    borderRadius="full"
                    bg="teal.100"
                    color="teal.700"
                  >
                    <Icon as={FiFilter} boxSize={6} />
                  </Flex>
                  <Heading size="md">Diverse Options</Heading>
                  <Text color="gray.600">
                    Choose from a wide range of investment plans tailored to your needs
                  </Text>
                </VStack>
              </MotionBox>
            </SimpleGrid>
          </VStack>
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
