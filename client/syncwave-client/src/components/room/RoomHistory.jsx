import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

const RoomHistory = () => {
  const history = [
    {
      id: 1,
      user: 'John Doe',
      videoTitle: 'Amazing Nature',
      videoUrl: 'https://youtu.be/abcdef',
      thumbnailUrl: 'https://img.youtube.com/vi/abcdef/0.jpg',
    },
    {
      id: 2,
      user: 'Jane Smith',
      videoTitle: 'Incredible Space',
      videoUrl: 'https://youtu.be/ghijkl',
      thumbnailUrl: 'https://img.youtube.com/vi/ghijkl/0.jpg',
    },
  ];

  return (
    <Box sx={{ height: '90%', width: '100%', display: 'flex', flexDirection: 'column', border: '1px solid black' }}>
      <List sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'white', color: 'black' }}>
        {history.map((entry) => (
          <ListItem key={entry.id} sx={{ alignItems: 'flex-start' }}>
            <Avatar
              src={entry.thumbnailUrl}
              alt={entry.videoTitle}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="a" href={entry.videoUrl} target="_blank" sx={{ textDecoration: 'none', color: 'blue' }}>
                  {entry.videoTitle}
                </Typography>
              }
              secondary={`Played by: ${entry.user}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoomHistory;
