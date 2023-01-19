import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SidebarContextProvider from './providers/Sidebar/SidebarProvider';
import Sidebar from './views/Sidebar';
import ChatProvider from './providers/Chat/ChatContext';
import { AuthProvider } from 'react-auth-kit'
import MqttContextProvider from './providers/Mqtt/MqttProvider';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(255, 255, 255, 0.87)',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider 
    authType="cookie"
    authName="auth"
    cookieDomain={window.location.hostname}
  >
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SidebarContextProvider>
          <ChatProvider>
            <Sidebar>
              <MqttContextProvider>
                <App /> 
              </MqttContextProvider>
            </Sidebar>
          </ChatProvider>
        </SidebarContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
)
