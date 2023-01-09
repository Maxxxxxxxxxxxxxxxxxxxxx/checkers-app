import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";
// import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export default function ChatProvider({ children }) {
  const [socketUrl, setSocketUrl] = useState("ws://localhost:8080/chat/global");
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  return (
    <ChatContext.Provider value={{ sendMessage, messageHistory }}>
      {children}
    </ChatContext.Provider>
  );
}
