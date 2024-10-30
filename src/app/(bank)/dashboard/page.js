"use client";
import React from "react";
import BankWelcome from "@/bankComponents/BankWelcome";
import BankSidenav from "@/bankComponents/BankSidenav";
import Navbar from "@/bankComponents/Navbar";
import DashStats from "@/bankComponents/DashStats";
import InvestPlanDisplay from "@/bankComponents/plandisplay";
import { Box } from "@chakra-ui/react";

const DashboardPage = () => {
  return (
    <Box>
      <BankSidenav />
      <Navbar />
      <BankWelcome />
      <InvestPlanDisplay />
      <DashStats />
    </Box>
  );
};

export default DashboardPage;
