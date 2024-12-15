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
      <Box display="flex" width="55%">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="#e2cadb" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search..."
            bg="gray.100" // Light gray background
            borderRadius="lg" // Optional: Rounded corners
            _placeholder={{ color: "gray.500" }}
            id="searchIp"
            height="6vh"
            color="#333333"
          />
          <Button
            onClick={handleSearch}
            bg="#007b83"
            ml={2}
            color="#ffffff"
            height="6vh"
          >
            Search
          </Button>
        </InputGroup>
      </Box>
    </>
  );
};

export default SearchBox;
