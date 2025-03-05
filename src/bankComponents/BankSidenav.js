"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Avatar,
  Text,
  VStack,
  Divider,
  HStack,
  Badge,
  Flex,
  Icon,
  Image,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiGrid,
  FiFilePlus,
  FiEdit,
  FiFileText,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname(); // Add this hook for path checking
  const btnRef = React.useRef();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [pendingInvestments, setPendingInvestments] = useState(0);
  const [notifications, setNotifications] = useState(0);
 
  
  // Color styles
  const activeBgColor = useColorModeValue("blue.100", "blue.700");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user data
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDoc);

          // Fetch notifications count
          const notificationsQuery = query(
            collection(db, "bankNotifications"),
            where("read", "==", false)
          );
          const notificationsSnapshot = await getDocs(notificationsQuery);
          setNotifications(notificationsSnapshot.size);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      } else {
        setUserData(null);
        setPendingApplications(0);
        setNotifications(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    return pathname === path;
  };

  const navCategories = [
    // Dashboard
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          icon: FiHome,
          path: "/bankdashboard",
        }
      ]
    },

    // Plan Management
    {
      title: "Plan Management",
      items: [
        {
          title: "All Plans",
          icon: FiGrid,
          path: "/bankplans",
        },
        {
          title: "Add New Plan",
          icon: FiFilePlus,
          path: "/addplans",
        },
        
      ],
    },

    // Applications
    {
      title: "Applications",
      items: [
        {
          title: "Loan Applications",
          icon: FiFileText,
          path: "/loanApplication",
          badge: pendingApplications,
        }
      ],
    },

    // Profile
    {
      title: "Settings",
      items: [
        {
          title: "Bank Profile",
          icon: FiUser,
          path: "/bankprofile",
        }
      ],
    },
  ];

  // Add styles for the navigation
  const NavItem = ({ item, isNested = false }) => {
    const active = isActive(item.path);
    
    return (
      <Link href={item.path} style={{ textDecoration: 'none' }}>
        <Box
          as={motion.div}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <Flex
            align="center"
            p="3"
            mx={isNested ? "3" : "2"}
            borderRadius="xl"
            role="group"
            cursor="pointer"
            position="relative"
            bg={active ? "blue.600" : "transparent"}
            color={active ? "white" : "gray.300"}
            _hover={{
              bg: active ? "blue.700" : "gray.700",
              color: "white",
            }}
            transition="all 0.2s"
          >
            {active && (
              <Box
                position="absolute"
                left="-2"
                top="50%"
                transform="translateY(-50%)"
                w="4px"
                h="60%"
                bg="blue.400"
                borderRadius="full"
              />
            )}
            {item.icon && (
              <Icon
                as={item.icon}
                mr="3"
                fontSize="18"
                color={active ? "blue.200" : "gray.400"}
                transition="0.2s"
                _groupHover={{ transform: "scale(1.1)", color: "white" }}
              />
            )}
            <Text 
              fontSize="sm" 
              fontWeight={active ? "bold" : "medium"}
              letterSpacing="0.4px"
            >
              {item.title}
            </Text>
            {item.badge && (
              <Badge
                ml="auto"
                colorScheme={active ? "red" : "blue"}
                variant={active ? "solid" : "subtle"}
                fontSize="xs"
                borderRadius="full"
                px="2"
                py="1"
              >
                {item.badge}
              </Badge>
            )}
          </Flex>
        </Box>
      </Link>
    );
  };

  // Add category styling
  const NavCategory = ({ category }) => {
    return (
      <Box mb={6}>
        <Text
          px="4"
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          color="gray.500"  // Darker category text
          letterSpacing="wider"
          mb={3}
        >
          {category.title}
        </Text>
        <VStack spacing={1} align="stretch">
          {category.items?.map((item) => (
            <NavItem key={item.path} item={item} isNested={true} />
          )) || <NavItem item={category} />}
        </VStack>
      </Box>
    );
  };

  // Main component render
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="gray.900"  // Changed to dark background
      borderRight="1px"
      borderRightColor="gray.700"  // Darker border
      w={["280px", "20%"]} // Responsive width: 280px on mobile, 20% on larger screens
      maxW="400px" // Add maximum width to prevent too wide sidebar on large screens
      minW="280px" // Add minimum width to prevent too narrow sidebar
      shadow="dark-lg"  // Darker shadow
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
          background: '#1A202C',  // Dark scrollbar track
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#2D3748',  // Dark scrollbar thumb
          borderRadius: '24px',
        },
      }}
    >
      <Box
        px="6"
        py="6"
        borderBottom="1px"
        borderColor="gray.700"
        bg="gray.900"
        position="sticky"
        top="0"
        zIndex="sticky"
      >
        <Flex align="center" mb={2}>
          <Image src="/logo.png" h="8" />
          <Text 
            fontSize="xl" 
            ml="3" 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, blue.300)"
            bgClip="text"
          >
            Bank Dashboard
          </Text>
        </Flex>
      </Box>

      <Box px="3" py="6">
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          {navCategories.map((category) => (
            <NavCategory key={category.title} category={category} />
          ))}
        </Flex>
      </Box>

      <Box 
        position="sticky" 
        bottom="0" 
        w="full" 
        bg="gray.900"  // Dark background
        borderTop="1px" 
        borderColor="gray.700"  // Darker border
        p="4"
      >
        <VStack spacing="4">
          <HStack 
            spacing="3" 
            width="full" 
            p="3" 
            bg="gray.800"  // Dark background
            borderRadius="lg"
          >
            <Avatar 
              size="sm" 
              name={userData?.name} 
              src={userData?.avatar} 
              bg="blue.500"
            />
            <Box flex="1">
              <Text 
                fontSize="sm" 
                fontWeight="medium"
                color="gray.100"  // Lighter text
              >
                {userData?.name || 'Bank Staff'}
              </Text>
              <Text 
                fontSize="xs" 
                color="gray.400"  // Lighter secondary text
              >
                {userData?.role || 'Administrator'}
              </Text>
            </Box>
          </HStack>

          <Button
            leftIcon={<FiLogOut />}
            variant="outline"
            size="sm"
            width="full"
            onClick={handleLogout}
            colorScheme="red"
            borderColor="red.500"
            color="red.400"
            bg="transparent"
            _hover={{
              bg: "red.900"
            }}
          >
            Log Out
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default SideNav;
