// "use client";
// import React from "react";
// import SideNav from "../../../components/SideNav";
// import SearchBox from "../../../components/SearchBar";
// import ProfilePage from "../../../components/ProfilePage";
// import { Box, Text } from "@chakra-ui/react";
// const profile = () => {
//   return (
//     <>
//       <Box
//         display="flex"
//         flexDirection="column"
//         gap={10}
//         justifyItems="center"
//         p={5}
//         backgroundImage="url(/images/body-background.png)"
//         backgroundPosition="center"
//         backgroundSize="cover"
//         backgroundAttachment="fixed"
//         backgroundRepeat="no-repeat"
//         height="auto"
//         width="auto"
//         minHeight="100vh" // Ensures the background covers at least the full viewport height
//         minWidth="auto" // Ensures the background covers the full viewport width
//       >
//         <Box display="flex" gap={10} justifyItems="center">
//           <SideNav />
//           <SearchBox />
//         </Box>

//         <ProfilePage />
//       </Box>
//     </>
//   );
// };

// export default profile;
"use client";
import React from "react";

import { Box } from "@chakra-ui/react";

import ProfilePage from "@/components/ProfilePage";
import Headers from "@/components/Headers";
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
            id="profile"
            // border="1px solid rgba(255, 255, 255)"
            marginTop="calc(17vh + 40px)" // 17vh (navbar height) + original margin
          >
            <ProfilePage />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default page;
