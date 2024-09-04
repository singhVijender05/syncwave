import React, { useState, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

// Sample room data
const rooms = [
  { id: 1, name: 'Room 1', status: 'Active', url: 'http://example.com/room1' },
  { id: 2, name: 'Room 2', status: 'Inactive', url: 'http://example.com/room2' },
  { id: 3, name: 'Room 3', status: 'Active', url: 'http://example.com/room3' },
];

const MyRooms = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleClick = (event, room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyUrl = () => {
    if (selectedRoom) {
      navigator.clipboard.writeText(selectedRoom.url);
      alert('URL copied to clipboard!');
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRoom) {
      // Implement your delete logic here
      alert(`Room ${selectedRoom.name} deleted!`);
    }
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1, px: 2,py:8, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#2C3E50', color: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
        <Button variant="contained" sx={{backgroundColor:'yellow',color:'black',font:'icon'}}>Create Room</Button>
        <Button variant="outlined" sx={{color:'white',backgroundColor:'green'}} >Refresh</Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        {rooms.map((room) => (
          <Box key={room.id} sx={{ mb: 1, p: 1, border: '1px solid #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2C3E50' }}>
            <IconButton onClick={(e) => handleClick(e, room)} sx={{ mr: 2 }}>
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
            <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
              {room.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {room.status === 'Active' ? (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Avatar alt="User 1" src="/static/images/avatar/1.jpg" />
                  <Avatar alt="User 2" src="/static/images/avatar/2.jpg" />
                  <Avatar alt="User 3" src="/static/images/avatar/3.jpg" />
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'red' }}>
                  Inactive
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleCopyUrl}>Copy URL</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default MyRooms;
