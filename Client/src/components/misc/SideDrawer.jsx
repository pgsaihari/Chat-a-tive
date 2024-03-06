import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
const SideDrawer = () => {
  const { user,setSelectedChat,chats,setChats,selectedChat,notification,setNotification } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
 
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Don't leave the search field empty",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false)
      return
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:8080/api/user?search=${search}`,
        config
      );
      console.log(data);
      if(data.users.length===0){
        toast({
          title: "No user found",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
        return
      }
      else{
        setLoading(false);
        setSearchResult(data.users)
      }
      
    } catch (error) {
     
        toast({
          title: "Sorry,Failed to load the search results!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        setLoading(false);
    }
  };


const accessChat=async(userId)=>{
console.log(userId)
try {
  setLoadingChat(true)
  const config = {
    headers: {
      "Content-type":"application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
  const {data}=await axios.post("http://localhost:8080/api/chat",{userId},config)
  console.log(data)
  if(!chats.find((c)=>c._id===data._id)) {setChats([data,...chats])}
  setSelectedChat(data)
  setLoadingChat(false)
  onClose()

} catch (error) {
  toast({
    title: "Sorry,Failed to load the chat!",
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });
}
}
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaMagnifyingGlass />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" color={"green"}>
          Chat-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            <Badge colorScheme="red" variant="solid" borderRadius="full" px="2" textTransform="uppercase">
                {notification.length}
              </Badge>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>{!notification.length && "No new messages"}
            {notification.map((note)=>{
              return (<MenuItem key={note._id} onClick={()=>{
                setSelectedChat(note.chat)
                setNotification(notification.filter((n)=> n!==note))
              }}>
                {note.chat.isGroupChat? `New Message from ${note.chat.chatName}`:`New message from ${getSender(user,note.chat.users)}`}
              </MenuItem>)
            })}
              </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}></ProfileModal>
              <Text
                color={"green"}
                fontSize={"5md"}
                py={3}
                m={2}
                fontFamily={"Work sans"}
              >
                {" "}
                Hi! {user.name}
              </Text>
              <MenuDivider />
              <MenuItem>My Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
              <MenuDivider />
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email..."
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch} color={"green"} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading? (
              <ChatLoading/>
            ):(
              searchResult?.map(user=>(
                <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
              ))
            )}
                {loadingChat && <Spinner ml={"auto"} display={"flex"}/>}

          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
