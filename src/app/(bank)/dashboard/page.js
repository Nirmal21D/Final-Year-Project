"use client";
import React from "react";
import BankWelcome from "@/app/bankComponents/BankWelcome";
import BankSidenav from "@/app/bankComponents/BankSidenav";
import Navbar from "@/app/bankComponents/Navbar";
import DashStats from "@/app/bankComponents/DashStats";
import InvestPlanDisplay from "@/app/bankComponents/plandisplay";
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
