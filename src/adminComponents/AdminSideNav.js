"use client";
import React from "react";
import { VStack, Button, Icon, Image } from "@chakra-ui/react";
import Link from "next/link";
import { FiHome, FiFilePlus, FiFileText, FiDollarSign } from "react-icons/fi";

const AdminSideNav = () => {
  return (
    <VStack spacing={6} align="center" bg="gray.800" p={4} borderRadius="md">
      <Image
        src="/images/logo.png"
        alt="Financial Portal Logo"
        width={220}
        pos={"absolute"}
        top={-12}
      />
      <Link href="/admin/dashboard" passHref>
        <Button
          marginTop={12}
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
    </VStack>
  );
};

export default AdminSideNav;
