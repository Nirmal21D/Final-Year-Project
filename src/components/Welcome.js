"use client";
import React, { useState, useEffect } from "react";
import { Box, Text, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { auth, db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Welcome = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [salaryInput, setSalaryInput] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const data = userSnap.data();

            // Check if salary is missing
            if (!data.salary || data.salary.trim() === "") {
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

  const handleSalarySubmit = async () => {
    if (salaryInput.trim() === "") {
      alert("Salary cannot be empty!");
      return;
    }

    try {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDoc, { salary: salaryInput });
      setUserData((prev) => ({ ...prev, salary: salaryInput })); // Update local state
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating salary: ", error);
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
          Glad to see you again!
        </Text>
      </Box>

      {/* Custom Dialog for Salary Input */}
      <Modal isOpen={isDialogOpen} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Your Salary</ModalHeader>
          <ModalBody>
            <Input
              type="number"
              placeholder="Enter your salary"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSalarySubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Welcome;
