import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
const RegisterComponent = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [pics,setPic]=useState(undefined)
    const [loading,setPicLoading]=useState(false)
    const toast=useToast();
    const navigate=useNavigate()
    const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dym6wmimj");
      fetch("https://api.cloudinary.com/v1_1/dym6wmimj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };



   
    const submitHandler=async()=>{
     setPicLoading(true)
     if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pics);
    try {
      const config={
        headers:{
          "Content-type":"application/json"
        }
      }
      const {data}=await axios.post("http://localhost:8080/api/user",{
        name,email,password,pics
      },config)
      console.log(data)
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setPicLoading(false)
      navigate('/chats')
    } catch (error) {
      console.log(error)
      toast({
        title: "Something went wrong! try again later... ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    }

  return (
   <VStack spacing={"5px"}>
    <FormControl id="first name" isRequired>
        <FormLabel>
          Name
        </FormLabel>
        <Input value={name} placeholder='enter your name...' name='name' onChange={(e)=>{
                setName(e.target.value)
            }}/>
    </FormControl>
    <FormControl id="email" isRequired>
        <FormLabel>
          Email
        </FormLabel>
        <Input name='email' value={email} placeholder='enter your email...' onChange={(e)=>{
                setEmail(e.target.value)
            }}/>
    </FormControl>
    <FormControl id="Password" isRequired>
        <FormLabel>
          Password
        </FormLabel>
        <Input type='password' value={password} placeholder='enter your  password...' name='password' onChange={(e)=>{
                setPassword(e.target.value)
            }}/>
    </FormControl>
    <FormControl id="confirm password" isRequired>
        <FormLabel>
         Confirm password
        </FormLabel>
        <Input  type='password' value={confirmPassword}   placeholder='enter your password again...' onChange={(e)=>{
                setConfirmPassword(e.target.value)
            }}/>
    </FormControl>
    <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
     
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>           
   </VStack>
  )
}

export default RegisterComponent