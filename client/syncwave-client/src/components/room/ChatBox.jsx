import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ChatBox = () => {
  const messages = [
    { id: 1, text: 'Hello everyone!' },
    { id: 2, text: 'Welcome to the room.' },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#333', color: 'white' }}>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemText primary={msg.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, display: 'flex' }}>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          sx={{ bgcolor: 'white' }}
        />
        <Button variant="contained" color="primary" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
