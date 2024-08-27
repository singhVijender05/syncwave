import { Box } from '@mui/material'
import Container from '@mui/material/Container'
import React from 'react'
import RoomNavbar from '../components/room/RoomNavbar.jsx'
import MyDrawer from '../components/room/MyDrawer.jsx'
import VideoPlayer from '../components/room/VideoPlayer.jsx'
import RoomUsers from '../components/room/RoomUsers.jsx'
import ChatContainer from '../components/room/ChatContainer.jsx'

function Room() {
  return (
    <Box>
       <RoomNavbar/>
       <Box component={"main"} display={'flex'} mt={'2rem'}>
        <MyDrawer/>
        <Container>
        <Box component={"div"} width={"100%"} display={"flex"} border={"1px solid red"}>
          <VideoPlayer/>
          <Box width={"40%"}>
            <ChatContainer/>
          </Box>
        </Box>

        <Box mt={'2rem'} width={'60%'} >
          <RoomUsers/>
        </Box>
        </Container>
       </Box>
    </Box>
  )
}

export default Room