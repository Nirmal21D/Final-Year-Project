"use client";
import SideNav from "../../components/SideNav";
import SearchBox from "../../components/SearchBar";
import Welcome from "../../components/Welcome";
import { Box } from "@chakra-ui/react";


const welcome = () => {
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={10}
      justifyItems="center"
      p={5}
      backgroundImage="url(/images/body-background.png)"
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundAttachment="fixed"
      backgroundRepeat="no-repeat"
      height="auto"
      width="auto"
    >
      <Box display="flex" gap={10} justifyItems="center">
        <SideNav />
        <SearchBox />
      </Box>

      {/* Pass handleLogin to LoginPage */}
      <Welcome />
    </Box>
  );
};

export default welcome;
