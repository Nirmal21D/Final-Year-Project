"use client";
import {
  Box,
  Heading,
  Grid,
  Button,
  Center,
  Divider,
  Input,
} from "@chakra-ui/react";
import CICal from "./CICal";
import EMICal from "./EMICal";
import FDCal from "./FDCal";
import IncomeTaxCal from "./IncomeTaxCal";
import SICal from "./SICal";
import SALCal from "./SALCal";
import SIPCal from "./SIPCal";

import React, { useState } from "react";

const Calc2 = () => {
  const [selectedCal, setSelectedCal] = useState(null);

  return (
    <>
      <Box id="main" display="flex" overflow="hidden">
        <Box
          id="left"
          width="40%"
          position="fixed"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          // left="0"
          top="58"
          margin="auto"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            boxShadow="lg"
            backdropFilter="blur(50px)"
            bg="rgba(45, 55, 72, 0.25)"
            p={6}
            borderRadius="md"
            color="#ebeff4"
            width="80%"
          >
            <Heading size="lg" mb={6} color="#003a5c">
              Financial Calculations
            </Heading>
            <Grid templateColumns="repeat(1,1fr)" gap={4}>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #141727 , #3a416f)"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("CI")}
              >
                Compound Interest Calculator
              </Button>

              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("EMI")}
              >
                EMI Calculator
              </Button>
              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("FD")}
              >
                FD Calculator
              </Button>
              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("IT")}
              >
                Income Tax Calculator
              </Button>
              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SI")}
              >
                Simple Interest Calculator
              </Button>
              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SAL")}
              >
                Salary Calculator
              </Button>
              <Button
                color="#ebeff4"
                _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
                bgGradient="linear(to-l, #141727 , #3a416f)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SIP")}
              >
                SIP Calculator
              </Button>
            </Grid>
          </Box>
        </Box>

        <Box
          height="100vh"
          position="fixed"
          left="40%"
          width="1px"
          borderColor="black"
        >
          {/* <Divider orientation="vertical" h="100%" /> */}
        </Box>

        <Box
          id="right"
          width="60%"
          minHeight="80vh"
          marginLeft="40%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflowY="auto"
          overflowX="hidden"
          px={4}
          py={6}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {selectedCal === "CI" && <CICal />}
            {selectedCal === "EMI" && <EMICal />}
            {selectedCal === "FD" && <FDCal />}
            {selectedCal === "IT" && <IncomeTaxCal />}
            {selectedCal === "SI" && <SICal />}
            {selectedCal === "SAL" && <SALCal />}
            {selectedCal === "SIP" && <SIPCal />}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Calc2;
