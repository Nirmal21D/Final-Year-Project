"use client";
import { Box, Heading, Grid, Button, Center, Divider } from "@chakra-ui/react";
import CICal from "../components/CICal";
import EMICal from "../components/EMICal";
import FDCal from "../components/FDCal";
import IncomeTaxCal from "../components/IncomeTaxCal";
import SICal from "../components/SICal";
import SALCal from "../components/SALCal";
import SIPCal from "../components/SIPCal";

import React, { useState } from "react";

const Calc2 = () => {
  const [selectedCal, setSelectedCal] = useState(null);

  return (
    <>
      <Box id="main" display="flex" gap={4}>
        <Box
          id="left"
          width="40%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            my={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bg="rgba(10, 14, 35, 0.49)"
            p={6}
            borderRadius="md"
            color="#ebeff4"
            width="80%"
          >
            <Heading size="md" mb={6}>
              Financial Calculations
            </Heading>
            <Grid templateColumns="repeat(1,1fr)" gap={4}>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("CI")}
              >
                Compound Interest Calculator
              </Button>

              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("EMI")}
              >
                EMI Calculator
              </Button>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("FD")}
              >
                FD Calculator
              </Button>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("IT")}
              >
                Income Tax Calculator
              </Button>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SI")}
              >
                Simple Interest Calculator
              </Button>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SAL")}
              >
                Salary Calculator
              </Button>
              <Button
                color="#ebeff4"
                bgGradient="linear(to-l, #0075ff ,  #9f7aea)"
                whiteSpace="normal"
                textAlign="center"
                onClick={() => setSelectedCal("SIP")}
              >
                SIP Calculator
              </Button>
            </Grid>
          </Box>
        </Box>

        <Box height="inherit">
          <Divider orientation="vertical" />
        </Box>

        <Box
          id="right"
          width="60%"
          my={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
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
    </>
  );
};

export default Calc2;
