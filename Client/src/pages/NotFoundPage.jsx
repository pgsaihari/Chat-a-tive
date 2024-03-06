import React from "react";
import { Box, Text, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container>
          <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      m="40px 0 15px 0"
      alignItems="center"
    >
      <Text fontSize="4xl" fontWeight="bold" mb="4">
        404 - Not Found
      </Text>
      <Text fontSize="xl" mb="8">
        Oops! The page you are looking for does not exist.
      </Text>
      <Button as={Link} to="/" colorScheme="teal" size="lg">
        Go Home
      </Button>
    </Box>
    </Container>
  
  );
};

export default NotFoundPage;
