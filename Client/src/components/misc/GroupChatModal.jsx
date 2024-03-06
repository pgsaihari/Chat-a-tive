import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { user, chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSearch=async(query)=>{
      setSearch(query);
      if(!query){
        return;
      }
      try {
        setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        };
        const {data}=await axios.get(`http://localhost:8080/api/user?search=${search}`,config)
        console.log(data.users)
        setLoading(false)
        setSearchResults(data.users)
      }
      catch(err){
        toast({
          title: "FAILED!",
          description:"failed to load the search results (notified to hq)",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }
  
  const handleGroup=(userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
      toast({
        title:"user already added",
        status:"warning",
        duration:5000,
        position:"top",
        isClosable: true,
      })
      return
    }
   setSelectedUsers([...selectedUsers,userToAdd])

  }

  const handleDelete=(delUser)=>{
    setSelectedUsers(selectedUsers.filter(sel=>sel._id !==delUser._id))
  }
  const handleSubmit=async()=>{
    setLoading(true)
    if(!groupChatName){
      toast({
        title:"Create a name for your group",
        status:"warning",
        duration:5000,
        position:"top",
        isClosable: true,
      })
      setLoading(false)
      return
    }
    if(selectedUsers.length===0){
      toast({
        title:"Thats not a group! add someone...",
        status:"warning",
        duration:5000,
        position:"top",
        isClosable: true,
      })
      setLoading(false)
      return
    }
    try {
      
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };

      const {data}=await axios.post("http://localhost:8080/api/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id))

      },config)
      console.log(data)
      if(data.message){
        toast({
          title: data.message,
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false)
        return 
      }
      setChats([data,...chats])
      onClose();
      toast({
        title: "New group created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false)
    } catch (error) {
      toast({
        title: "FAILED!",
        description:"failed to create a group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input placeholder="Group Name" mb={3} value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <Input placeholder="Add users eg:John,Rose,Xavier"  mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
  
            {/* selected users */}
            {selectedUsers.map(user=>{
             return <UserBadgeItem key={user._id} user={user} handleFunction={()=>{handleDelete(user)}}/>
            })}

          
            {loading ? <div><Spinner/></div>:(searchResults.map(user=>{
           
            return  <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
            }))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
              Create Chat
            </Button>
   
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
