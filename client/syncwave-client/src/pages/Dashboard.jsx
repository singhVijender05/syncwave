import React from 'react';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../components/dashboard/AppBar';
import MyRooms from '../components/dashboard/MyRooms';
import Footer from '../components/dashboard/Footer';

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <Box sx={{ flex: '1 0 auto',display:'flex' }}>
        <MyRooms />
      </Box>
      <Footer />
    </Box>
  );
}

export default Dashboard;
