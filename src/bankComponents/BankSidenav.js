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
} from "@chakra-ui/react";
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
      <Button ref={btnRef} bg="#152b5a" onClick={onOpen} position="fixed">
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
                    <Link href="/pages/signup">
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
                    <Link href="/pages/login">
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

                      <Link href="/pages/profile">
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
      </Drawer>
    </>
  );
};

export default SideNav;
