import React from "react";
import { useState } from "react";
import ChatBox from "./ChatBox";
import RoomHistory from "./RoomHistory";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


function ChatContainer() {
  const [value, setValue] = useState("chats");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="white"
        variant="fullWidth"
        indicatorColor="primary"
        aria-label="secondary tabs example"
      >
        <Tab value="chats" label="Chats" />
        <Tab value="history" label="History" />
      </Tabs>
      {value=="chats" ? <ChatBox /> : <RoomHistory />}
    </>
  );
}

export default ChatContainer;
