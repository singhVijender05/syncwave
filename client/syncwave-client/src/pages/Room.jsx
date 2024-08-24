import { Box } from '@mui/material'
import React from 'react'
import RoomNavbar from '../components/room/RoomNavbar.jsx'
import RoomHero from '../components/room/RoomHero.jsx'

function Room() {
  return (
    <Box>
       <RoomNavbar/>
       <RoomHero/>
    </Box>
  )
}

export default Room