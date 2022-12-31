import { Toolbar, IconButton, Typography, Box, Breadcrumbs, Link } from "@mui/material/index";
import { Menu } from "@mui/material/index";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import "@/styles/ChatTab/ChatTab.css";

export default function ChatTab({ room }) {

  return (
    <div className="chat-view">
      <Toolbar variant="dense" className="toolbar">
        <span className="toolbar__leftside">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <ChatBubbleIcon />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb" separator="/" color="inherit" sx={{'font-weight': 1000}} className="toolbar__route">
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
        
      </div>
    </div>
  )
}