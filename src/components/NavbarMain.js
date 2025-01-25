"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [activeType, setActiveType] = useState(null);

  const togglePlans = (type) => {
    setActiveType((prevType) => (prevType === type ? null : type));
  };

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
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const buttonStyles = {
    bg: "#567C8D",
    color: "#e9ecef",
    width: "100px",
    height: "40px",
    _hover: { bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" },
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
        {/* <Divider orientation="vertical" height="35px" /> */}
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
                    <MenuItem bg="#ffffff">
                      <Link
                        href={investment.link}
                      >{`Explore ${investment.type}`}</Link>
                    </MenuItem>
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
        <Menu>
          <Link href=" /news">
            <MenuButton
              as={Button}
              bg="#567C8D"
              color="#e9ecef"
              width="full"
              _hover={{ bg: "rgba(229, 229, 229, 0.5)", color: "#11212d" }}
            >
              News
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
            <Divider orientation="vertical" height="35px" />
          </>
        ) : (
          <>
            <Button {...buttonStyles} onClick={handleLogout}>
              Log Out
            </Button>

            <Divider orientation="vertical" height="35px" />
            {user && userData && (
              <Box>
                <Wrap>
                  <WrapItem>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={4}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          name={userData.name || "User"}
                          src={userData.photoURL}
                          h={4}
                          w={4}
                          p={4}
                        />
                      </Box>
                      <Box>
                        {/* <Text color="white" fontWeight="bold">
                    {userData.name || "User"}
                  </Text> */}

                        <Link href="/profile">
                          <Text color="white">View Profile</Text>
                        </Link>
                      </Box>
                    </Box>
                  </WrapItem>
                </Wrap>
              </Box>
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default NavbarMain;
