"use client";
import React from "react";
import { Text, VStack, Button, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FiHome, FiFilePlus, FiFileText, FiDollarSign } from "react-icons/fi";

const AdminSideNav = () => {
  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="white">
        Finance Mastery
      </Text>
      <VStack spacing={4} align="stretch" bg="gray.800" p={4} borderRadius="md">
        <Link href="/admin/dashboard" passHref>
          <Button
            w="100%"
            leftIcon={<Icon as={FiHome} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="teal"
          >
            Dashboard
          </Button>
        </Link>
        <Link href="/admin/all-plans" passHref>
          <Button
            w="100%"
            leftIcon={<Icon as={FiFilePlus} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="teal"
          >
            All Plans
          </Button>
        </Link>
        <Link href="/admin/all-banks" passHref>
          <Button
            w="full"
            leftIcon={<Icon as={FiDollarSign} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="teal"
          >
            All Banks
          </Button>
        </Link>
        <Link href="/admin/plan-verify" passHref>
          <Button
            w="100%"
            leftIcon={<Icon as={FiFileText} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="teal"
          >
            Plan Verify
          </Button>
        </Link>
        {/* <Link href="/admin/blogs" passHref>
          <Button
            w="100%"
            leftIcon={<Icon as={FiFileText} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="teal"
          >
            Blogs
          </Button>
        </Link> */}
      </VStack>
    </>
  );
};

export default AdminSideNav;
