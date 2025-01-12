// "use client";

// import React from "react";
// import { Box } from "@chakra-ui/react";
// import BankSidenav from "@/bankComponents/BankSidenav";
// import DashStats from "@/bankComponents/DashStats";
// import BankWelcome from "@/bankComponents/BankWelcome";

// const page = () => {
//   return (
//     <>
//       <Box
//         id="main"
//         display="flex"
//         flexDirection="column"
//         justifyItems="center"
//         alignItems="center"
//         backgroundImage="url(/images/newbg.png)"
//         backgroundPosition="center"
//         backgroundSize="cover"
//         backgroundAttachment="fixed"
//         backgroundRepeat="no-repeat"
//         height="auto"
//         width="auto"
//         minHeight="100vh"
//         minWidth="auto"
//       >
//         <Box
//           id="upper"
//           position="fixed"
//           top="0"
//           left="0"
//           right="0"
//           zIndex="1000"
//         >
//           <BankSidenav />
//         </Box>
//         <Box
//           id="lower"
//           w="full"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           flexDirection="column"
//         >
//           <Box
//             id="welcome"
//             m="40px"
//             height="30vh"
//             width="90%"
//             borderRadius="xl"
//             boxShadow="lg"
//             backdropFilter="blur(50px)"
//             bg="rgba(45, 55, 72, 0.2)"
//             // border="1px solid rgba(255, 255, 255)"
//             marginTop="calc(17vh + 40px)" // 17vh (navbar height) + original margin
//           >
//             <BankWelcome />
//             <DashStats />
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };
// export default page;

// "use client";
// import React from "react";
// import { Box } from "@chakra-ui/react";
// import BankSidenav from "@/bankComponents/BankSidenav";
// import DashStats from "@/bankComponents/DashStats";
// import BankWelcome from "@/bankComponents/BankWelcome";
// import BankHeaders from "@/bankComponents/BankHeaders";
// import Calendar from "@/bankComponents/Calendar";
// const page = () => {
//   return (
//     <>
//       <Box
//         id="main"
//         display="flex"
//         flexDirection="column"
//         justifyItems="center"
//         alignItems="center"
//         backgroundImage="url(/images/newbg.png)"
//         backgroundPosition="center"
//         backgroundSize="cover"
//         backgroundAttachment="fixed"
//         backgroundRepeat="no-repeat"
//         height="auto"
//         width="auto"
//         minHeight="100vh"
//         minWidth="auto"
//         p={5}
//       >
//         <Box id="upper">
//           <BankHeaders />
//         </Box>
//         <Box
//           id="lower"
//           w="full"
//           // display="flex"
//           // alignItems="center"
//           // justifyContent="center"
//           // flexDirection="column"
//         >
//           <Box id="calendar" marginTop="14vh">
//             <Calendar />
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };
// export default page;

// import React from "react";
// import { Box, Flex } from "@chakra-ui/react";

// import BankHeaders from "@/bankComponents/BankHeaders";
// import BankSidenav from "@/bankComponents/BankSidenav";
// import DashStats from "@/bankComponents/DashStats";

// const BankDashboard = () => {
//   return (
//     <Flex h="100vh">
//       {/* Sidebar */}
//       <Box w="20%" bg="gray.800" color="white" p={4}>
//         <BankSidenav />
//       </Box>

//       {/* Main Content */}
//       <Box w="80%" bg="gray.50" display="flex" flexDirection="column">
//         <Box position="fixed" width="80%">
//           <BankHeaders />
//         </Box>
//         <Box px={6} mt={24}>
//           <DashStats />
//         </Box>
//       </Box>
//     </Flex>
//   );
// };

// export default BankDashboard;

import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import BankHeaders from "@/bankComponents/BankHeaders";
import BankSidenav from "@/bankComponents/BankSidenav";
import DashStats from "@/bankComponents/DashStats";
import BankWelcome from "@/bankComponents/BankWelcome";

const BankDashboard = () => {
  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="20%" bg="gray.800" color="white" p={4}>
        <BankSidenav />
      </Box>

      {/* Main Content */}
      <Box w="80%" bg="gray.50" display="flex" flexDirection="column">
        {/* Fixed Header */}
        <Box position="fixed" width="80%">
          <BankHeaders />
        </Box>

        {/* Scrollable Content */}
        <Box px={6} mt={24}>
          <BankWelcome />

          {/* Dashboard Stats */}
          <DashStats />
        </Box>
      </Box>
    </Flex>
  );
};

export default BankDashboard;
