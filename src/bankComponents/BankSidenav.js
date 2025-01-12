"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
  Avatar,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiHome,
  FiFilePlus,
  FiFileText,
  FiUser,
  FiLogOut,
  FiUserPlus,
  FiLogIn,
  FiTrendingUp,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { auth, db } from "../firebase"; // Added db import
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Added Firestore imports

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

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
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Finance Mastery
      </Text>
      <VStack spacing={4} align="stretch">
        <Link href="/bankdashboard">
          <Button
            w={"full"}
            leftIcon={<FiHome />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Dashboard
          </Button>
        </Link>
        <Link href=" /addplans">
          <Button
            w="full"
            leftIcon={<FiFilePlus />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Add New Plan
          </Button>
        </Link>
        <Link href=" /bankplans">
          <Button
            w={"full"}
            leftIcon={<FiFileText />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Bank Plans
          </Button>
        </Link>

        {!user ? (
          <>
            <Link href="/signup">
              <Button
                w={"full"}
                leftIcon={<FiUserPlus />}
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="whiteAlpha"
              >
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                w={"full"}
                leftIcon={<FiLogIn />}
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="whiteAlpha"
              >
                Login
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href=" /bankprofile">
              <Button
                w={"full"}
                leftIcon={<FiUser />}
                variant="ghost"
                justifyContent="flex-start"
                colorScheme="whiteAlpha"
              >
                My Profile
              </Button>
            </Link>
            <Button
              w={"full"}
              leftIcon={<FiLogOut />}
              variant="ghost"
              justifyContent="flex-start"
              colorScheme="whiteAlpha"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </>
        )}
      </VStack>
      {/* <Button
        ref={btnRef}
        bg="#152b5a"
        onClick={onOpen}
        position="fixed"
        width="2vw"
        borderRadius="50"
        top={4}
        border="2px solid #c1c1c1"
      >
        <HamburgerIcon color="#c1c1c1" />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          bg="#0f1535"
          borderRadius="lg"
          height="95%"
          alignSelf="center"
          ml={3}
        >
          <DrawerHeader borderBottomWidth="1px" color="#e9ecef">
            Finance Mastery
          </DrawerHeader>
          <DrawerBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p={5}
          >
            <Box display="flex" flexDirection="column" gap={5}>
              <Link href="/bankdashboard">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                    color="#e9ecef"
                    width="full"
                  >
                    Home
                  </MenuButton>
                </Menu>
              </Link>
              <Link href=" /addplans">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                    color="#e9ecef"
                    width="full"
                  >
                    Add Plans
                  </MenuButton>
                </Menu>
              </Link>
              <Link href=" /bankplans">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                    color="#e9ecef"
                    width="full"
                  >
                    Bank Plans
                  </MenuButton>
                </Menu>
              </Link>
              <Link href=" /loanplans">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                    color="#e9ecef"
                    width="full"
                  >
                    Loan Plans
                  </MenuButton>
                </Menu>
              </Link>
              <Link href=" /investmentplans">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                    color="#e9ecef"
                    width="full"
                  >
                    Investment Plans
                  </MenuButton>
                </Menu>
              </Link>

              {!user ? (
                <>
                  <Menu>
                    <Link href="/signup">
                      <MenuButton
                        as={Button}
                        bg="rgba(229, 229, 229, 0.1)"
                        color="#e9ecef"
                        width="full"
                        _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                      >
                        Sign Up
                      </MenuButton>
                    </Link>
                  </Menu>
                  <Menu>
                    <Link href="/login">
                      <MenuButton
                        as={Button}
                        bg="rgba(229, 229, 229, 0.1)"
                        color="#e9ecef"
                        width="full"
                        _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                      >
                        Login
                      </MenuButton>
                    </Link>
                  </Menu>
                </>
              ) : (
                <>
                  <Menu>
                    <Link href=" /bankprofile">
                      <MenuButton
                        as={Button}
                        bg="rgba(229, 229, 229, 0.1)"
                        color="#e9ecef"
                        width="full"
                        _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                      >
                        My Profile
                      </MenuButton>
                    </Link>
                  </Menu>
                  <Menu>
                    <MenuButton
                      as={Button}
                      bg="rgba(250, 5, 5, 0.1)"
                      color="#e9ecef"
                      width="full"
                      _hover={{ bg: "rgba(229, 229, 229, 0.8)" }}
                      onClick={handleLogout}
                    >
                      Log Out
                    </MenuButton>
                  </Menu>
                </>
              )}
            </Box>
            {user && userData && (
              <Box mt="auto">
                <Wrap justify="flex-start">
                  <WrapItem>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box display="flex" alignItems="center" gap={4}>
                        <Avatar
                          name={userData.name || "User"}
                          src={userData.photoURL}
                        />
                        <Text color="white" fontWeight="bold">
                          {userData.name || "User"}
                        </Text>
                      </Box>

                      <Link href="/profile">
                        <Text color="white" fontSize="sm">
                          View Profile
                        </Text>
                      </Link>
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </>
  );
};

export default SideNav;
