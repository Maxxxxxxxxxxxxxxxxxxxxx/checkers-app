import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SidebarContextProvider from './providers/Sidebar/SidebarProvider';
import Sidebar from './views/Sidebar';
import ChatProvider from './providers/Chat/ChatContext';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(255, 255, 255, 0.87)',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <SidebarContextProvider>
        <ChatProvider>
          <Sidebar>
            <App /> 
          </Sidebar>
        </ChatProvider>
      </SidebarContextProvider>
    </ThemeProvider>
  </BrowserRouter>
)
