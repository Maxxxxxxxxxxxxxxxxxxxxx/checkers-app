import {
  Toolbar,
  IconButton,
  Typography,
  Breadcrumbs,
} from "@mui/material/index";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SendIcon from "@mui/icons-material/Send";
import "@/styles/ChatTab/ChatTab.css";
import { useState } from "react";
import { useChat } from "@/providers/Chat/ChatContext";
import Message from "./Message";

export default function ChatTab({ room }) {
  let [msg, setMsg] = useState("");
  let { messageHistory, sendMessage } = useChat();

  let onSubmit = async (event) => {
    event.preventDefault();
    setMsg(event.target.msg.value);
    console.log(messageHistory);
    sendMessage(event.target.msg.value);
    document.getElementById('form').reset();
  }

  let handleChange = (event) => setMsg(event.target.value);

  return (
    <div className="chat-view">
      <Toolbar variant="dense" className="toolbar">
        <span className="toolbar__leftside">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <ChatBubbleIcon />
          </IconButton>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="/"
            color="inherit"
            sx={{ fontWeight: 1000 }}
            className="toolbar__route"
          >
            <Typography variant="p" className="toolbar__route">
              Chat
            </Typography>
            <Typography variant="p" className="toolbar__route">
              Global
            </Typography>
          </Breadcrumbs>
        </span>
      </Toolbar>
      <div className="chat-view__container">
        <div className="chat-view__display">
          {messageHistory.map(message => {
            return <Message content={message.data} />
          })}
        </div>
        <form
          className="chat-view__input"
          id="form"
          onSubmit={onSubmit}
          autoComplete="off"
        >
          <input
            type="text"
            name="msg"
            onChange={handleChange}
            className="chat-view__textfield"
            placeholder="Aa"
          />
          <IconButton edge="start" color="inherit" type="submit">
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}
