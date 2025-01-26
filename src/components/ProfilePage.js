// "use client";
// import {
//   Box,
//   Button,
//   Input,
//   Text,
//   Flex,
//   useToast,
//   VStack,
//   HStack,
//   Wrap,
//   WrapItem,
//   Tag,
//   TagLabel,
//   TagCloseButton,
//   Image,
//   Avatar,
// } from "@chakra-ui/react";
// import React, { useState, useEffect, useRef } from "react";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
// import { db, auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";

// const ProfilePage = () => {
//   const [email, setEmail] = useState("");
//   const [passwd, setPasswd] = useState("");
//   const [phone, setPhone] = useState("");
//   const [salary, setSalary] = useState("");
//   const [username, setUsername] = useState("");
//   const [fundsHistory, setFundsHistory] = useState(["funds"]);
//   const [profilePhoto, setProfilePhoto] = useState("");
//   const fileInputRef = useRef(null);
//   const toast = useToast();

//   const [userTags, setUserTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [user, setUser] = useState(null);

//   const suggestedTags = [
//     "High Risk Tolerance",
//     "Low Risk Tolerance",
//     "Medium Risk Tolerance",
//     "Short Term Goals",
//     "Long Term Goals",
//     "Tax Saving",
//     "High Returns Seeking",
//     "Senior Citizen",
//     "Youth",
//     "Beginner Investor",
//     "Fixed Income",
//     "Regular Income",
//     "Wealth Creation",
//     "Retirement Planning",
//     "Education Planning",
//     "Real Estate Interest",
//     "Technology Interest",
//     "Healthcare Interest",
//     "Green Energy Interest",
//   ];

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         try {
//           const userDoc = await getDoc(doc(db, "users", user.uid));
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setEmail(userData.email || "");
//             setPhone(userData.phone || "");
//             setSalary(userData.salary || "");
//             setUsername(userData.username || "");
//             setUserTags(userData.interests || []);
//             setFundsHistory(
//               userData.fundsHistory || ["No transaction history"]
//             );
//             setProfilePhoto(userData.profilePhoto || "");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           toast({
//             title: "Error",
//             description: "Failed to load user data",
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//           });
//         }
//       }
//     };
//     fetchUserData();
//   }, [user, toast]);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result;
//         setProfilePhoto(base64String);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddTag = async (tag) => {
//     if (!userTags.includes(tag) && userTags.length < 5) {
//       const newTags = [...userTags, tag];
//       setUserTags(newTags);

//       try {
//         await updateDoc(doc(db, "users", user.uid), {
//           interests: newTags,
//         });
//         toast({
//           title: "Interest Added",
//           description: "Your investment interest has been updated",
//           status: "success",
//           duration: 2000,
//           isClosable: true,
//         });
//       } catch (error) {
//         console.error("Error updating tags:", error);
//         toast({
//           title: "Error",
//           description: "Failed to update interests",
//           status: "error",
//           duration: 2000,
//           isClosable: true,
//         });
//       }
//     }
//     setTagInput("");
//   };

//   const handleRemoveTag = async (tagToRemove) => {
//     const newTags = userTags.filter((tag) => tag !== tagToRemove);
//     setUserTags(newTags);

//     try {
//       await updateDoc(doc(db, "users", user.uid), {
//         interests: newTags,
//       });
//       toast({
//         title: "Interest Removed",
//         description: "Your investment interest has been updated",
//         status: "success",
//         duration: 2000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Error removing tag:", error);
//       toast({
//         title: "Error",
//         description: "Failed to remove interest",
//         status: "error",
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   const saveProfile = async () => {
//     try {
//       await updateDoc(doc(db, "users", user.uid), {
//         email,
//         phone,
//         salary,
//         username,
//         profilePhoto,
//       });
//       toast({
//         title: "Profile Updated",
//         description: "Your profile information has been saved",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       toast({
//         title: "Error",
//         description: "Failed to save profile",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const renderHorizontalInput = (label, value, onChange, type = "text") => (
//     <Flex mb={4} width="100%" alignItems="center">
//       <Text width="40%" fontWeight="bold" mr={4}>
//         {label}
//       </Text>
//       <Input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         bg="transparent"
//         color="black"
//         size="lg"
//         flex="1"
//         borderColor={"black"}
//       />
//     </Flex>
//   );

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       p={6}
//       // bg="rgba(117, 122, 140,0.299)"
//       color="black"
//       borderRadius="xl"
//       // shadow="md"
//       width="100%"
//       maxWidth="600px"
//       mx="auto"
//     >
//       <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
//         Profile Page
//       </Text>

//       {/* Profile Photo Section */}
//       <Box mb={6} textAlign="center">
//         <Avatar size="2xl" src={profilePhoto} mb={4} />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           style={{ display: "none" }}
//         />
//         <Button
//           onClick={() => fileInputRef.current.click()}
//           size="sm"
//           colorScheme="blue"
//         >
//           Change Profile Photo
//         </Button>
//       </Box>

//       {renderHorizontalInput("Email", email, setEmail, "email")}
//       {renderHorizontalInput("Password", passwd, setPasswd, "password")}
//       {renderHorizontalInput("Phone", phone, setPhone, "number")}
//       {renderHorizontalInput("Salary", salary, setSalary)}
//       {renderHorizontalInput("Username", username, setUsername)}

//       <Box mb={4} width="100%">
//         <Text fontSize="lg" mb={2}>
//           History:
//         </Text>
//         <Box
//           bg="transparent"
//           borderRadius="md"
//           p={4}
//           color="gray.800"
//           maxHeight="100px"
//           overflowY="auto"
//         >
//           {fundsHistory.map((fund, index) => (
//             <Text key={index}>{fund}</Text>
//           ))}
//         </Box>
//       </Box>

//       {/* Interest Tags Section */}
//       <Box w="100%">
//         <Text fontSize="xl" fontWeight="bold" mb={4}>
//           Your Investment Interests
//         </Text>

//         <HStack mb={2}>
//           <Input
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             placeholder="Add your interests"
//           />
//           <Button
//             onClick={() => handleAddTag(tagInput)}
//             isDisabled={userTags.length >= 5 || !tagInput.trim()}
//           >
//             Add
//           </Button>
//         </HStack>

//         {/* Display user's tags */}
//         <Wrap spacing={2} mb={4}>
//           {userTags.map((tag) => (
//             <WrapItem key={tag}>
//               <Tag size="md" colorScheme="blue" borderRadius="full">
//                 <TagLabel>{tag}</TagLabel>
//                 <TagCloseButton onClick={() => handleRemoveTag(tag)} />
//               </Tag>
//             </WrapItem>
//           ))}
//         </Wrap>

//         {/* Suggested tags */}
//         <Text mb={2} fontWeight="bold">
//           Suggested Interests:
//         </Text>
//         <Wrap spacing={2}>
//           {suggestedTags.map((tag) => (
//             <WrapItem key={tag}>
//               <Tag
//                 size="md"
//                 colorScheme="gray"
//                 borderRadius="full"
//                 cursor="pointer"
//                 onClick={() => handleAddTag(tag)}
//                 _hover={{ bg: "blue.100" }}
//               >
//                 <TagLabel>{tag}</TagLabel>
//               </Tag>
//             </WrapItem>
//           ))}
//         </Wrap>
//       </Box>

//       <Button
//         color="#ebeff4"
//         bgGradient="linear(to-l, #141727 , #3a416f)"
//         _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
//         onClick={saveProfile}
//         width="100%"
//         mb={4}
//       >
//         Save Profile
//       </Button>
//     </Box>
//   );
// };

// export default ProfilePage;
"use client";

import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [username, setUsername] = useState("");
  const [fundsHistory, setFundsHistory] = useState(["funds"]);
  const [profilePhoto, setProfilePhoto] = useState(
    "/images/photo-placeholder.jpg"
  );
  const fileInputRef = useRef(null);
  const toast = useToast();

  const [userTags, setUserTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [user, setUser] = useState(null);

  const suggestedTags = [
    "High Risk Tolerance",
    "Low Risk Tolerance",
    "Medium Risk Tolerance",
    "Short Term Goals",
    "Long Term Goals",
    "Tax Saving",
    "High Returns Seeking",
    "Senior Citizen",
    "Youth",
    "Beginner Investor",
    "Fixed Income",
    "Regular Income",
    "Wealth Creation",
    "Retirement Planning",
    "Education Planning",
    "Real Estate Interest",
    "Technology Interest",
    "Healthcare Interest",
    "Green Energy Interest",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setEmail(userData.email || "");
            setPhone(userData.phone || "");
            setSalary(userData.salary || "");
            setUsername(userData.username || "");
            setUserTags(userData.interests || []);
            setFundsHistory(
              userData.fundsHistory || ["No transaction history"]
            );
            setProfilePhoto(
              userData.profilePhoto || "/images/photo-placeholder.jpg"
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };
    fetchUserData();
  }, [user, toast]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = async (tag) => {
    if (!userTags.includes(tag) && userTags.length < 5) {
      const newTags = [...userTags, tag];
      setUserTags(newTags);

      try {
        await updateDoc(doc(db, "users", user.uid), {
          interests: newTags,
        });
        toast({
          title: "Interest Added",
          description: "Your investment interest has been updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating tags:", error);
        toast({
          title: "Error",
          description: "Failed to update interests",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
    setTagInput("");
  };

  const handleRemoveTag = async (tagToRemove) => {
    const newTags = userTags.filter((tag) => tag !== tagToRemove);
    setUserTags(newTags);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        interests: newTags,
      });
      toast({
        title: "Interest Removed",
        description: "Your investment interest has been updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "Failed to remove interest",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const saveProfile = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        email,
        phone,
        salary,
        username,
        profilePhoto,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pb={8} px={16} maxWidth="1200px" margin="auto">
      <Text fontSize="3xl" fontWeight="bold" mb={2}>
        COMPLETE YOUR
      </Text>
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        PROFILE
      </Text>
      <Text fontSize="sm" mb={8}>
        This information will be used to personalize your experience.
      </Text>

      <Flex gap={5} mb={8}>
        <Image
          src={profilePhoto || "images/photo-placeholder.jpg"}
          alt="Profile"
          boxSize="150px"
          objectFit="cover"
          border="1px"
          borderColor="gray.300"
        />
        <Button
          as="label"
          htmlFor="photo-upload"
          bg="#007b83"
          color="white"
          _hover={{ bg: "#27a05d" }}
          height="40px"
          px={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
          UPLOAD PHOTO
        </Button>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          display="none"
          id="photo-upload"
        />
      </Flex>

      <Flex gap={10}>
        <Box width="full">
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Box flex={1}>
                <Text mb={2} fontSize="sm">
                  Email
                </Text>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  height="36px"
                  px={4}
                  border="1px"
                  borderColor="gray.300"
                />
              </Box>
              <Box flex={1}>
                <Text mb={2} fontSize="sm">
                  Password
                </Text>
                <Input
                  type="password"
                  value={passwd}
                  onChange={(e) => setPasswd(e.target.value)}
                  height="36px"
                  px={4}
                  border="1px"
                  borderColor="gray.300"
                />
              </Box>
            </HStack>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text mb={2} fontSize="sm">
                  Phone
                </Text>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  height="36px"
                  px={4}
                  border="1px"
                  borderColor="gray.300"
                />
              </Box>
              <Box flex={1}>
                <Text mb={2} fontSize="sm">
                  Salary
                </Text>
                <Input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  height="36px"
                  px={4}
                  border="1px"
                  borderColor="gray.300"
                />
              </Box>
            </HStack>
            <Box>
              <Text mb={2} fontSize="sm">
                Username
              </Text>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                height="36px"
                px={4}
                border="1px"
                borderColor="gray.300"
              />
            </Box>
          </VStack>

          <Box mt={8}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Your Investment Interests
            </Text>
            <HStack mb={2}>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add your interests"
                height="36px"
                px={4}
                border="1px"
                borderColor="gray.300"
              />
              <Button
                onClick={() => handleAddTag(tagInput)}
                isDisabled={userTags.length >= 5 || !tagInput.trim()}
                bg="#007b83"
                color="white"
                _hover={{ bg: "#27a05d" }}
                height="36px"
              >
                Add
              </Button>
            </HStack>
            <Wrap spacing={2} mb={4}>
              {userTags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="teal"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
            <Text mb={2} fontWeight="bold" fontSize="sm">
              Suggested Interests:
            </Text>
            <Wrap spacing={2}>
              {suggestedTags.map((tag) => (
                <WrapItem key={tag}>
                  <Tag
                    size="md"
                    borderRadius="full"
                    variant="outline"
                    colorScheme="teal"
                    cursor="pointer"
                    onClick={() => handleAddTag(tag)}
                    _hover={{ bg: "green.50" }}
                  >
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </Box>
      </Flex>

      <Flex justify="center" alignItems="center" mt={8}>
        <Button
          color="#ebeff4"
          // bg="#007b83"
          background="#003a5c"
          // bgGradient="linear(to-l, #141727 , #3a416f)"
          _hover={{ bg: "rgba(229, 229, 229, 0.8)", color: "#003a5c" }}
          onClick={saveProfile}
          width="20%"
          borderRadius="20"
          mb={4}
        >
          Save Profile
        </Button>
      </Flex>
    </Box>
  );
};

export default ProfilePage;
