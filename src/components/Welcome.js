"use client";
import React, { useState, useEffect } from "react";
import { Box, Text, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, VStack } from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Welcome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [salaryInput, setSalaryInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [cibilInput, setCibilInput] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const data = userSnap.data();

            // Check if salary, age or cibil score is missing
            if (!data.salary || data.salary.trim() === "" || 
                !data.age || data.age.trim() === "" ||
                !data.cibilScore || data.cibilScore.trim() === "") {
              setIsDialogOpen(true);
            }

            setUserData(data);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        console.log("No user is signed in.");
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (salaryInput.trim() === "") {
      alert("Salary cannot be empty!");
      return;
    }
    if (ageInput.trim() === "") {
      alert("Age cannot be empty!");
      return;
    }
    if (cibilInput.trim() === "") {
      alert("CIBIL Score cannot be empty!");
      return;
    }

    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, { 
        salary: salaryInput,
        age: ageInput,
        cibilScore: cibilInput
      });
      setUserData((prev) => ({ 
        ...prev, 
        salary: salaryInput,
        age: ageInput,
        cibilScore: cibilInput
      }));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userData) {
    return (
      <Box p="20px">
        <Text fontSize="3xl" color="#666d74" fontWeight="bold">
          Please Sign Up or Login to continue
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box p="20px">
        <Text fontSize="lg" color="#666d74">
          Welcome back,
        </Text>
        <Text fontSize="4xl" color="#003a5c" fontWeight="bold" mb={4}>
          {userData.name || "User"}
        </Text>
        <Text fontSize="lg" color="#666d74">
          Your salary: {userData.salary || "Not Provided"}
        </Text>
        <Text fontSize="lg" color="#666d74">
          Your age: {userData.age || "Not Provided"}
        </Text>
        <Text fontSize="lg" color="#666d74">
          Your CIBIL Score: {userData.cibilScore || "Not Provided"}
        </Text>
        <Text fontSize="lg" color="#666d74">
          Glad to see you again!
        </Text>
      </Box>

      {/* Custom Dialog for User Details Input */}
      <Modal isOpen={isDialogOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Your Details</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Input
                type="number"
                placeholder="Enter your salary"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Enter your age"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Enter your CIBIL Score"
                value={cibilInput}
                onChange={(e) => setCibilInput(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Welcome;
