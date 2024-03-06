import { Box, Container, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import LoginComponent from "../components/Authentication/LoginComponent";
import RegisterComponent from "../components/Authentication/RegisterComponent";

const HomePage = () => {

  const  navigate=useNavigate()

  useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"))
       
        if(user){
            navigate('/chats')
        }
    },[navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text textAlign={"center"} textColor={"green"} fontSize={"4xl"} fontFamily={"Work sans"}>
          Chat-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" colorScheme="green" >
          <TabList mb="1rem">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LoginComponent/>
            </TabPanel>
            <TabPanel>
              <RegisterComponent/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
