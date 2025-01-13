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
          <Input
            type="text"
            placeholder="Search..."
            bg="gray.100" // Light gray background
            _placeholder={{ color: "gray.500" }}
            id="searchIp"
            height="6vh"
            color="#333333"
            borderRightRadius="0" // Remove right border radius
          />
          <Button
            onClick={handleSearch}
            bg="#007b83"
            color="#ffffff"
            height="6vh"
            borderLeftRadius="0" // Remove left border radius
          >
            Search
          </Button>
        </InputGroup>
      </Box>
    </>
  );
};

export default SearchBox;
