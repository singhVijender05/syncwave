import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box sx={{ mt: 'auto', p: 2, backgroundColor: '#2C3E50', textAlign: 'center' }}>
      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
        Useful Links
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Link href="#" sx={{ color: 'white' }}>Home</Link>
        <Link href="#" sx={{ color: 'white' }}>About</Link>
        <Link href="#" sx={{ color: 'white' }}>Contact</Link>
        <Link href="#" sx={{ color: 'white' }}>Privacy Policy</Link>
      </Box>
      <Typography variant="body2" sx={{ color: 'white', mt: 2 }}>
        © 2024 Your Company
      </Typography>
    </Box>
  );
};

export default Footer;
