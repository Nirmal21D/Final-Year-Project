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
  Divider,
  Flex,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { auth, db } from "../firebase"; // Added db import
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Added Firestore imports
import { investmentPlans } from "./PlanData";
const NavbarMain = () => {
  const [activeType, setActiveType] = useState(null);

  const togglePlans = (type) => {
    setActiveType((prevType) => (prevType === type ? null : type));
  };

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
      <Flex
        direction="row"
        align="center"
        gap={5}
        justify="space-evenly"
        w="full"
      >
        <Link href="/">
          <Menu>
            <MenuButton
              as={Button}
              bg="#567C8D"
              color="#e9ecef"
              width="full"
              _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            >
              Home
            </MenuButton>
          </Menu>
        </Link>
        <Divider orientation="vertical" height="35px" />

        {/* __________________________________________________________________________________________ */}

        <Menu closeOnSelect={false}>
          {" "}
          {/* Keep menu open when selecting sub-items */}
          <MenuButton
            as={Button}
            bg="#567C8D"
            _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            color="#e9ecef"
          >
            Investment Plans
          </MenuButton>
          <MenuList bg="#ebeff4">
            {investmentPlans.map((investment) => (
              <Box key={investment.type}>
                <MenuItem
                  bg="#ffffff"
                  onClick={() => togglePlans(investment.type)}
                  _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
                >
                  {investment.type}
                </MenuItem>
                {activeType === investment.type && (
                  <Box pl={4} bg="#ebeff4">
                    {investment.plans.map((plan) => (
                      <MenuItem key={plan.name} bg="#ffffff">
                        <Link href={plan.link}>{plan.name}</Link>
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </MenuList>
        </Menu>
        <Divider orientation="vertical" height="35px" />
        {/* __________________________________________________________________________________________ */}
        <Menu>
          <MenuButton
            as={Button}
            bg="#567C8D"
            color="#e9ecef"
            _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
          >
            Banks
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href="/bank1">
              Bank 1
            </MenuItem>
            <MenuItem as={Link} href="/bank2">
              Bank 2
            </MenuItem>
            <MenuItem as={Link} href="/bank3">
              Bank 3
            </MenuItem>
          </MenuList>
        </Menu>
        <Divider orientation="vertical" height="35px" />
        <Menu>
          <Link href=" /calculator">
            <MenuButton
              as={Button}
              bg="#567C8D"
              color="#e9ecef"
              width="full"
              _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            >
              Calculator
            </MenuButton>
          </Link>
        </Menu>
        <Divider orientation="vertical" height="35px" />
        <Menu>
          <Link href=" /budget">
            <MenuButton
              as={Button}
              bg="#567C8D"
              color="#e9ecef"
              width="full"
              _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            >
              Budget Planner
            </MenuButton>
          </Link>
        </Menu>
        <Divider orientation="vertical" height="35px" />
        <Menu>
          <Link href=" /inflation">
            <MenuButton
              as={Button}
              bg="#567C8D"
              color="#e9ecef"
              width="full"
              _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            >
              Inflation
            </MenuButton>
          </Link>
        </Menu>
        <Divider orientation="vertical" height="35px" />
        {!user ? (
          <>
            <Menu>
              <Link href=" /signup">
                <MenuButton
                  as={Button}
                  bg="#567C8D"
                  color="#e9ecef"
                  width="full"
                  _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
                >
                  SignUp
                </MenuButton>
              </Link>
            </Menu>
            <Divider orientation="vertical" height="35px" />
            <Menu>
              <Link href=" /login">
                <MenuButton
                  as={Button}
                  bg="#567C8D"
                  color="#e9ecef"
                  width="full"
                  _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
                >
                  Login
                </MenuButton>
              </Link>
            </Menu>
          </>
        ) : (
          <>
            <Menu>
              <Link href=" /profile">
                <MenuButton
                  as={Button}
                  bg="#567C8D"
                  color="#e9ecef"
                  width="full"
                  _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
                >
                  My Profile
                </MenuButton>
              </Link>
            </Menu>
            <Divider orientation="vertical" height="35px" />
            <Menu>
              <MenuButton
                as={Button}
                bg="rgba(250, 5, 5, 0.1)"
                color="#e9ecef"
                width="full"
                _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
                onClick={handleLogout}
              >
                Log Out
              </MenuButton>
            </Menu>
            <Divider orientation="vertical" height="35px" />
          </>
        )}
      </Flex>
      {user && userData && (
        <Box mt="auto">
          <Wrap justify="flex-start">
            <WrapItem>
              <Box display="flex" alignItems="center" flexDirection="column">
                <Box display="flex" alignItems="center" gap={4}>
                  <Avatar
                    name={userData.name || "User"}
                    src={userData.photoURL}
                  />
                  <Text color="white" fontWeight="bold">
                    {userData.name || "User"}
                  </Text>
                </Box>

                <Link href=" /profile">
                  <Text color="white" fontSize="sm">
                    View Profile
                  </Text>
                </Link>
              </Box>
            </WrapItem>
          </Wrap>
        </Box>
      )}
    </>
  );
};

export default NavbarMain;
