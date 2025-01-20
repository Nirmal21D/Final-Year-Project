"use client"; // Mark this component as a client component

import React from "react";
import { Box } from "@chakra-ui/react";
import Headers from "@/components/Headers";
import InformationOptions from "../../../../../components/informationOptions";
import GovernmentSchemesPage from "@/components/GovernmentSchemesPage";

const SchemesPage = () => {
  return (
    <>
      {/* Header Section */}
      <Box
        id="upper"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
        bg="white"
        boxShadow="md"
      >
        <Headers />
      </Box>

      {/* Information Options Section */}
      <Box mt={52}>
        <InformationOptions />
      </Box>
      <Box mt={10}>
        <GovernmentSchemesPage />
      </Box>
    </>
  );
};

export default SchemesPage;
