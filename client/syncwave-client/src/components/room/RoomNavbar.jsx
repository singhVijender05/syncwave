import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search'; 
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '300px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex',pl:"10rem", justifyContent: 'space-between', width: '100%' }}>
          {/* Link at the Start */}
          <Typography variant="h6" component="a" href="#" style={{ textDecoration: 'underline', color: 'inherit' }}>
            Home
          </Typography>

          {/* Search Box with YouTube Icon and Search Icon in the Middle */}
          <Search sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <IconButton style={{display:"flex",justifyContent:"center",alignItems:"center" }}>
              <Avatar src="/icons8-youtube.svg" alt="logo" sx={{ width: '28px', height: '28px' }} />
            </IconButton>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
            {/* <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper> */}
          </Search>

          {/* Button at the End */}
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
