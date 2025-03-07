"use client";
import React from "react";
import SearchBox from "../components/SearchBar";
import NavbarMain from "../components/NavbarMain";
import {
  Box,
  Image,
  Container,
  Flex,
  Spacer,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Headers = () => {
  // Colors that match your existing theme
  const logoBgColor = "#003a5c";
  const navBgColor = "#567C8D";
  const textColor = "white";
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(0, 0, 0, 0.3)"
  );

  return (
    <Box as="header" width="100%" position="sticky" top="0" zIndex="1000">
      {/* Top bar with logo and contact info */}
      <Box
        id="logo-bar"
        width="100%"
        height="10vh"
        background={logoBgColor}
        boxShadow={`0 2px 10px ${shadowColor}`}
        position="relative"
        zIndex="5"
      >
        <Container maxW="7xl" height="100%">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            height="100%"
          >
            {/* Logo */}
            <Box
              position="relative"
              height="100%"
              display="flex"
              alignItems="center"
            >
              <Image
                src="/images/logo.png"
                alt="Financial Portal Logo"
                width={220}
                objectFit="contain"
                position="relative"
                top="12px"
              />
            </Box>

            <Spacer />

            {/* Contact Information */}
            <HStack
              spacing={8}
              color={textColor}
              display={{ base: "none", md: "flex" }}
            >
              <HStack spacing={2}>
                <FaPhoneAlt />
                <Text fontSize="sm">+91 123-456-7890</Text>
              </HStack>
              <HStack spacing={2}>
                <FaEnvelope />
                <Text fontSize="sm">contact@financialportal.com</Text>
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Navigation bar */}
      <Box
        id="nav-bar"
        width="100%"
        bg={navBgColor}
        borderBottom="1px solid"
        borderColor="rgba(255,255,255,0.1)"
        boxShadow={`0 4px 10px ${shadowColor}`}
      >
        {/* NavbarMain is rendered here with full width */}
        <NavbarMain />
      </Box>
    </Box>
  );
};

export default Headers;
