"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  Flex,
  Spacer,
  HStack,
  VStack,
  Container,
  useColorModeValue,
  useDisclosure,
  Collapse,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Badge,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  CloseButton,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
} from "@chakra-ui/icons";
import {
  FaHome,
  FaChartLine,
  FaCalculator,
  FaMoneyBillWave,
  FaNewspaper,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaCoins,
  FaBriefcase,
} from "react-icons/fa";
import Link from "next/link";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const NavbarMain = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(); // For mobile menu
  const [activeType, setActiveType] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(2); // Example notification count

  // Use a ref for the hamburger button
  const btnRef = useRef();

  // Color scheme
  const navBg = useColorModeValue("white", "gray.800");
  const menuBg = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("#567C8D", "#3F5B68");
  const buttonHover = useColorModeValue("blue.100", "blue.700");
  const textColor = useColorModeValue("#008080", "#008080");
  const hoverTextColor = useColorModeValue("#11212d", "#ffffff");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("No user is signed in.");
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      router.push("/");
      onClose(); // Close mobile menu if open
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Button styles
  const navButtonStyles = {
    bg: "transparent",
    color: textColor,
    fontWeight: "medium",
    rounded: "md",
    _hover: {
      bg: buttonHover,
      color: hoverTextColor,
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s",
    p: 2,
    minW: "auto",
    w: "100%", // Make buttons take full width
    justifyContent: "flex-start", // Left align text
  };

  // Nav items configuration
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <FaHome />,
    },
    {
      label: "Investments",
      href: "/plan1",
      icon: <FaChartLine />,
    },
    {
      label: "Loan Plans",
      href: "/loanplans",
      icon: <FaMoneyBillWave />,
    },
    {
      label: "Calculators",
      href: "/calculator",
      icon: <FaCalculator />,
    },
    {
      label: "Budget Planner",
      href: "/budget",
      icon: <FaBriefcase />,
    },
    {
      label: "Inflation",
      href: "/inflation",
      icon: <FaCoins />,
    },
    {
      label: "News",
      href: "/news",
      icon: <FaNewspaper />,
    },
  ];

  // Desktop navigation rendering
  const renderDesktopNav = () => (
    <HStack
      spacing={2}
      display={{ base: "none", md: "flex" }}
      w="100%"
      justifyContent="space-around"
    >
      {navItems.map((item) => (
        <Link
          href={item.href}
          key={item.label}
          passHref
          style={{ width: "100%" }}
        >
          <Button {...navButtonStyles} variant="ghost" justifyContent="center">
            <HStack spacing={2}>
              <Box>{item.icon}</Box>
              <Text>{item.label}</Text>
            </HStack>
          </Button>
        </Link>
      ))}
    </HStack>
  );

  // Mobile drawer rendering
  const renderMobileNav = () => (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader
          borderBottomWidth="1px"
          display="flex"
          alignItems="center"
        >
          <Text fontWeight="bold" fontSize="lg">
            Navigation
          </Text>
          <Spacer />
          <CloseButton onClick={onClose} />
        </DrawerHeader>
        <DrawerBody p={0}>
          <VStack align="stretch" spacing={0}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.label} passHref>
                <Button
                  variant="ghost"
                  w="100%"
                  justifyContent="flex-start"
                  onClick={onClose}
                  py={3}
                  px={4}
                  borderRadius={0}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack spacing={3}>
                    <Box>{item.icon}</Box>
                    <Text>{item.label}</Text>
                  </HStack>
                </Button>
              </Link>
            ))}
          </VStack>

          {/* Mobile Auth */}
          <Box p={4} mt={4}>
            {!user ? (
              <VStack spacing={3} align="stretch">
                <Link href="/login" passHref>
                  <Button
                    w="100%"
                    colorScheme="blue"
                    leftIcon={<FaSignInAlt />}
                    onClick={onClose}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button
                    w="100%"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<FaUserPlus />}
                    onClick={onClose}
                  >
                    Sign Up
                  </Button>
                </Link>
              </VStack>
            ) : (
              <VStack spacing={3} align="stretch">
                <Flex align="center" p={2} borderWidth="1px" borderRadius="md">
                  <Avatar
                    size="sm"
                    name={userData?.name || "User"}
                    src={userData?.photoURL}
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="medium">{userData?.name || "User"}</Text>
                    <Text fontSize="xs" opacity={0.8}>
                      {user.email}
                    </Text>
                  </Box>
                </Flex>
                <Link href="/profile" passHref>
                  <Button
                    w="100%"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<FaUserCircle />}
                    onClick={onClose}
                  >
                    View Profile
                  </Button>
                </Link>
                <Button
                  w="100%"
                  colorScheme="red"
                  variant="solid"
                  leftIcon={<FaSignOutAlt />}
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </VStack>
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  // User menu for desktop
  const renderUserMenu = () => (
    <Menu>
      <MenuButton
        as={Button}
        rounded="full"
        variant="link"
        cursor="pointer"
        minW={0}
      >
        <Avatar
          size="sm"
          name={userData?.name || "User"}
          src={userData?.photoURL}
          bg={buttonBg}
        />
      </MenuButton>
      <MenuList bg={menuBg} borderColor={borderColor} boxShadow="lg">
        <Box px={3} py={2} mb={2}>
          <Text fontWeight="medium">{userData?.name || "User"}</Text>
          <Text fontSize="xs" opacity={0.8}>
            {user.email}
          </Text>
        </Box>
        <MenuDivider />
        <Link href="/profile" passHref>
          <MenuItem as="a" icon={<FaUserCircle />}>
            Profile
          </MenuItem>
        </Link>

        <MenuDivider />
        <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={navBg}
      px={4}
      py={2}
      boxShadow="sm"
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <Container maxW="7xl">
        <Flex align="center" justify="space-between">
          {/* Mobile Menu Button */}
          <IconButton
            ref={btnRef}
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            aria-label="Open menu"
          />

          {/* Desktop Nav */}
          {renderDesktopNav()}

          {/* Mobile Nav Drawer */}
          {renderMobileNav()}

          {/* Right side - Auth buttons or User menu */}
          <HStack spacing={4}>
            {!user ? (
              <HStack spacing={2} display={{ base: "none", md: "flex" }}>
                <Link href="/login" passHref>
                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    leftIcon={<FaSignInAlt />}
                    size={buttonSize}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button
                    colorScheme="blue"
                    leftIcon={<FaUserPlus />}
                    size={buttonSize}
                  >
                    Sign Up
                  </Button>
                </Link>
              </HStack>
            ) : (
              <HStack
                paddingLeft={4}
                spacing={2}
                display={{ base: "none", md: "flex" }}
              >
                {renderUserMenu()}
              </HStack>
            )}

            {/* Mobile auth buttons */}
            {!user ? (
              <HStack spacing={2} display={{ base: "flex", md: "none" }}>
                <Link href="/login" passHref>
                  <IconButton
                    aria-label="Login"
                    icon={<FaSignInAlt />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                  />
                </Link>
              </HStack>
            ) : (
              <IconButton
                aria-label="User menu"
                icon={
                  <Avatar
                    size="xs"
                    name={userData?.name || "User"}
                    src={userData?.photoURL}
                  />
                }
                variant="ghost"
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
              />
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavbarMain;
