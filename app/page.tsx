'use client';

import icon from "../public/pfp2.jpg"
import { useEffect, useRef, useState } from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { sendMessage } from './lib/sendMessage'
import './customScrollbar.css'

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello, how can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#2c2c2c"
    >
      <Stack
        direction="column"
        width="600px"
        height="750px"
        border="1px solid #444"
        bgcolor="#3c3c3c"
        p={2}
        spacing={3}
        borderRadius={4}
        className="custom-scrollbar"
      >
        {/* Header Section */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          mb={2}
          border = "1px solid #87777e"

        >
          <Box
            component="img"
            src= {icon.src}
            alt="Robot"
            width={27}
            height={27}
            borderRadius="60%"
            
          />
          <Typography variant="h6" color="#f18686">
            Hi, I'm Milo!
          </Typography>
        </Stack>

        {/* Chat Section */}
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          className="custom-scrollbar"
        >
          {messages.map((message: Message, index: number) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? '#007bff' : '#a333c8'
                }
                color="white"
                borderRadius={16}
                p={3.5}
                maxWidth="73%"
                fontSize="0.95rem"
                lineHeight="1.4"
              >
                {message.content.split('\n').map((text, i) => (
                  <Typography
                    key={i}
                    variant="body1"
                    component="p"
                    sx={{ marginBottom: 1.5 }} // Adjust margin between sentences/paragraphs
                  >
                    {text}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>

        {/* Input Section */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type a message"
            fullWidth
            value={input}
            onChange={(event) => setInput(event.target.value)}
            variant="outlined"
            InputProps={{
              style: {
                color: 'white',
                backgroundColor: '#4c4c4c',
                borderRadius: 8,
              },
            }}
            InputLabelProps={{
              style: { color: 'lightgray' },
            }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#007bff',
              '&:hover': {
                bgcolor: '#0056b3',
              },
            }}
            onClick={() => {
              if (!isLoading) {
                sendMessage(
                  messages,
                  input,
                  setInput,
                  setMessages,
                  isLoading,
                  setIsLoading
                );
                console.log(messages);
              }
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
