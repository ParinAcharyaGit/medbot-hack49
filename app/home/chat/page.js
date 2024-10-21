"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Stack, TextField, Avatar, AppBar, Toolbar, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Home = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm MedBot. How can I assist you with your symptoms today?",
      profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "", profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "I'm sorry, but I encountered an error. Please try again later.",
          profilePic: "https://www.shutterstock.com/image-vector/call-center-customer-support-vector-600nw-2285364015.jpg",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ height: 60, backgroundColor: '#1e1e1e', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', borderBottom: '4px solid #d81b60' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/home')}>
            <ArrowBackIcon sx={{ color: '#d81b60', fontSize: 'larger' }} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: '#d81b60' }}>
            Get Your Treatment Plan
          </Typography>
        </Toolbar>
      </AppBar>
      <div className='h-screen'>
        <Box
          maxWidth="100vw"
          minHeight="90vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          backgroundColor="black"
          sx={{ padding: 2 }}
        >
          <Stack
            direction={"column"}
            width={{ xs: "90%", sm: "1000px" }}
            height={{ xs: "80vh", sm: "600px" }}
            borderRadius={2}
            boxShadow={3}
            p={3}
            spacing={3}
            bgcolor="black"
          >
            <Stack
              direction={"column"}
              spacing={2}
              flexGrow={1}
              p={3}
              overflow="auto"
              maxHeight="100%"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#333",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#555",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#777",
                },
              }}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={msg.role === "assistant" ? "flex-start" : "flex-end"}
                  alignItems="center"
                >
                  {msg.role === "assistant" && (
                    <Avatar src={msg.profilePic} alt="Assistant" sx={{ marginRight: 1 }} />
                  )}
                  <Box
                    sx={{
                      backgroundColor: msg.role === "assistant" ? "#333" : "#005bb5",
                      color: "white",
                      borderRadius: "12px",
                      p: 2,
                      maxWidth: "80%",
                    }}
                  >
                    {msg.content}
                  </Box>
                  {msg.role === "user" && (
                    <Avatar src={"YOUR_USER_PROFILE_IMAGE_URL"} alt="User" sx={{ marginLeft: 1 }} />
                  )}
                </Box>
              ))}
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                placeholder="Type your message..."
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "#333",
                    color: "#fff",
                  },
                }}
                InputLabelProps={{
                  sx: { color: "#777" },
                }}
              />
              <IconButton
                onClick={sendMessage}
                sx={{
                  borderRadius: 50,
                  color: "#fff",
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </div>
    </>
  );
};

export default Home;
