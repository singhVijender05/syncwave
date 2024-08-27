import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const RoomUsers = () => {
  const users = [
    {
      id: 1,
      nickname: 'John Doe',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      status: 'active',
    },
    {
      id: 2,
      nickname: 'Jane Smith',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      status: 'inactive',
    },
    {
      id: 3,
      nickname: 'Alice Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
      status: 'active',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        overflowX: 'auto',
        padding: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
      }}
    >
      {users.map((user) => (
        <Box
          key={user.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: '16px',
            textAlign: 'center',
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.nickname}
            sx={{
              width: 64,
              height: 64,
              border: `2px solid ${user.status === 'active' ? 'green' : 'gray'}`,
            }}
          />
          <Typography variant="subtitle2" sx={{ marginTop: '4px' }}>
            {user.nickname}
          </Typography>
          <Typography variant="caption" sx={{ color: user.status === 'active' ? 'green' : 'gray' }}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RoomUsers;
