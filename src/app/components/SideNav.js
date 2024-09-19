"use client";
import React from "react";
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
import Link from "next/link"; // Correct import for Next.js Link component

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Ensure the Drawer can open and close
  const btnRef = React.useRef();

  return (
    <>
      {/* Hamburger Icon Button */}
      <Button ref={btnRef} bg="#152b5a" onClick={onOpen}>
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
              {/* Custom Dropdown for Investment Plans */}
              <Link href="/">
                <Menu>
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    color="#e9ecef"
                    width="full"
                  >
                    DashBoard
                  </MenuButton>
                </Menu>
              </Link>
              <Menu>
                <MenuButton
                  as={Button}
                  bg="rgba(229, 229, 229, 0.1)"
                  color="#e9ecef"
                >
                  Investment Plans
                </MenuButton>
                <MenuList bg="#ebeff4">
                  {/* Each MenuItem is a clickable link */}
                  <Link href="/pages/plan1" passHref>
                    <MenuItem as="a" bg="#ebeff4">
                      Plan 1
                    </MenuItem>
                  </Link>
                  <Link href="/pages/plan2" passHref>
                    <MenuItem as="a" bg="#ebeff4">
                      Plan 2
                    </MenuItem>
                  </Link>
                  <Link href="/pages/plan3" passHref>
                    <MenuItem as="a" bg="#ebeff4">
                      Plan 3
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>

              {/* Custom Dropdown for Banks */}
              <Menu>
                <MenuButton
                  as={Button}
                  bg="rgba(229, 229, 229, 0.1)"
                  color="#e9ecef"
                >
                  Banks
                </MenuButton>
                <MenuList>
                  {/* Each MenuItem is a clickable link */}
                  <Link href="/bank1" passHref>
                    <MenuItem as="a">Bank 1</MenuItem>
                  </Link>
                  <Link href="/bank2" passHref>
                    <MenuItem as="a">Bank 2</MenuItem>
                  </Link>
                  <Link href="/bank3" passHref>
                    <MenuItem as="a">Bank 3</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
              <Menu>
                <Link href="/pages/calculator">
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    color="#e9ecef"
                    width="full"
                  >
                    Calculator
                  </MenuButton>
                </Link>
              </Menu>
              <Menu>
                <Link href="/pages/profile">
                  <MenuButton
                    as={Button}
                    bg="rgba(229, 229, 229, 0.1)"
                    color="#e9ecef"
                    width="full"
                  >
                    My Profile
                  </MenuButton>
                </Link>
              </Menu>
            </Box>
            {/* Avatar */}
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
                        name="Harshita Gawas"
                        src="https://bit.ly/dan-abramov"
                      />
                      <Text color="white" fontWeight="bold">
                        Harshita Gawas
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideNav;
