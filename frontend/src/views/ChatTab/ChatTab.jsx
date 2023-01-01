import {
  Toolbar,
  IconButton,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  TextField,
} from "@mui/material/index";
import { Menu } from "@mui/material/index";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SendIcon from "@mui/icons-material/Send";
import { useFormik } from "formik";
import "@/styles/ChatTab/ChatTab.css";
import { useEffect } from "react";

export default function ChatTab({ room }) {
  const formik = useFormik({
    initialValues: {
      msg: "",
    },
    onSubmit: (values) => {
      // TODO: handle send message over WS

      alert(values.msg);
    },
  });

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
        <div className="chat-view__display"></div>
        <form className="chat-view__input" onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="msg"
            onChange={formik.handleChange}
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
