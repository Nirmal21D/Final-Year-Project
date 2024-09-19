"use client";
import React from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Icon,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBox = () => {
  const handleSearch = () => {
    // Implement search logic here
    console.log("Search initiated");
  };

  return (
    <>
      <Box
        bg="rgba(229, 229, 229, 0.1)"
        width="100%"
        p={3}
        height={65}
        borderRadius="md"
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="#e2cadb" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search..."
            bg="rgba(10, 14, 35, 0.49)"
            // bg="gray.100" // Light gray background
            borderRadius="lg" // Optional: Rounded corners
            // _placeholder={{ color: "gray.500" }}
            id="searchIp"
          />
          <Button onClick={handleSearch} bg="#395698" ml={2} color="white ">
            Search
          </Button>
        </InputGroup>
      </Box>
    </>
  );
};

export default SearchBox;
