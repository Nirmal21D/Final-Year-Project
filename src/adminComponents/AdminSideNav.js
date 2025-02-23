"use client";
import React from "react";
import { Text, VStack, Button, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FiHome, FiFilePlus, FiFileText, FiDollarSign } from "react-icons/fi";

const AdminSideNav = () => {
  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Finance Mastery
      </Text>
      <VStack spacing={4} align="stretch">
        <Link href="/admin/dashboard" passHref>
          <Button
            w="full"
            leftIcon={<Icon as={FiHome} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Dashboard
          </Button>
        </Link>
        <Link href="/admin/all-plans" passHref>
          <Button
            w="full"
            leftIcon={<Icon as={FiFilePlus} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
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
            colorScheme="whiteAlpha"
          >
            All Banks
          </Button>
        </Link>
        <Link href="/admin/plan-verify" passHref>
          <Button
            w="full"
            leftIcon={<Icon as={FiFileText} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Plan Verify
          </Button>
        </Link>
        {/* <Link href="/admin/blogs" passHref>
          <Button
            w="full"
            leftIcon={<Icon as={FiFileText} />}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme="whiteAlpha"
          >
            Blogs
          </Button>
        </Link> */}
      </VStack>
    </>
  );
};

export default AdminSideNav;
