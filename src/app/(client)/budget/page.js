"use client";
import React from "react";
import BudgetPlannerPage from "/src/components/BudgetPlannerPage";
import Headers from "@/components/Headers";
import { Box } from "@chakra-ui/react";

const page = () => {
  return (
    <>
      <Box
        id="main"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        // backgroundImage="url(/images/newbg.png)"
        bg="gray.50"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundAttachment="fixed"
        backgroundRepeat="no-repeat"
        height="auto"
        width="auto"
        minHeight="100vh"
        minWidth="auto"
        css={{
          /* Styling for custom scrollbars */
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#48BB78", // Thumb color (green)
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#2F855A", // Darker green on hover
          },
          "&::-webkit-scrollbar-track": {
            background: "#1A202C", // Scrollbar track color (dark grey)
          },
        }}
      >
        <Box
          id="upper"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Headers />
        </Box>
        <Box id="lower" w="full">
          <Box
            id="budget"
            marginTop="calc(17vh)" // 17vh (navbar height) + original margin
          >
            <BudgetPlannerPage />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default page;
