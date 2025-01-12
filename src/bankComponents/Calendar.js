"use client";
import React, { useState, useEffect } from "react";
import { Box, Divider } from "@chakra-ui/react";

const Calendar = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleDateString("en-IN", { month: "long" });
  const weekDay = date.toLocaleDateString("en-IN", { weekday: "short" });
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Box
        id="main"
        width="20vw"
        height="18vh"
        // border="1px solid black"
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
        gap={4}
        bg="rgba(0, 58, 92,0.1)"
        borderRadius="20px"
        shadow={"lg"}
      >
        <Box
          id="circle"
          height="6vw"
          width="6vw"
          border="1px solid black"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize={"3xl"}
        >
          {`${day}`}
        </Box>
        <Box id="month">
          <Box>{`${weekDay},`}</Box>
          <Box>{`${month}`}</Box>
        </Box>
        <Divider orientation="vertical" h="6vh" borderColor="black" />
        <Box id="time">{`${time}`}</Box>
      </Box>
    </>
  );
};

export default Calendar;
