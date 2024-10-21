"use client";
import 'regenerator-runtime/runtime';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Stack, TextField, AppBar, Toolbar, Typography, Paper, Divider, Fade, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/loader', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Error uploading file');
      }

      const createPlanResponse = await fetch('/api/treatment-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prescription: await uploadResponse.text() }),
      });

      if (!createPlanResponse.ok) {
        throw new Error('Error generating treatment plan');
      }

      const data = await createPlanResponse.json();
      const treatmentPlan = data.treatmentPlan || "Unable to generate treatment plan based on WHO standards.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `${treatmentPlan}` },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error processing the file." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ height: 60, backgroundColor: '#1e1e1e', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', borderBottom: '4px solid #d81b60' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/home')}>
            <ArrowBackIcon sx={{ color: '#d81b60', fontSize: 'larger' }} />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', color: '#d81b60' }}>
            Get Your Treatment Plan
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', padding: 2 }}>
        <Paper
          elevation={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: { xs: '100%', sm: '600px' },
            height: { xs: '85vh', sm: '75vh' },
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#121212',
            color: '#fff',
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            p={3}
            sx={{
              overflowY: 'auto',
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#555",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#777",
              },
            }}
          >
            {messages.map((message, index) => (
              <Fade in={true} timeout={500} key={index}>
                <Box
                  display="flex"
                  justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      backgroundColor: message.role === "assistant" ? "#1e1e1e" : "#d81b60",
                      color: "white",
                      borderRadius: "16px",
                      padding: "10px 15px",
                      maxWidth: "75%",
                      wordWrap: "break-word",
                      boxShadow: message.role === "assistant" ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 118, 255, 0.4)',
                    }}
                  >
                    {message.content}
                  </Box>
                </Box>
              </Fade>
            ))}
          </Stack>

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={1}>
              <CircularProgress color="white" size={24} />
            </Box>
          )}

          <Divider sx={{ backgroundColor: '#444' }} />

          <Stack direction="row" spacing={1} p={1} alignItems="center">
            <input
              accept=".pdf"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={handleUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#d81b60",
                  color: "white",
                  "&:hover": {
                    backgroundColor: '#d81b60',
                  },
                }}
                disabled={loading}
              >
                Upload PDF
              </Button>
            </label>
            {fileName && (
              <Typography variant="caption" sx={{ p: 1, color: '#ccc', ml: 1 }}>
                {fileName}
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
