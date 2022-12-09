import React from 'react';
import Button from '@mui/material/Button';
import Navlink from './Navlink';
import '../styles/SideBar/SideBar.css';

export default function SideBar() {
  return (
    <div className="base-sidebar">
      <div className="logo">
        CHECKERS
      </div>
      <div className="options">
        <Navlink href={"/game"} message={"Play"}/>
        <Navlink href={"/friends"} message={"Social"}/>
        <Navlink href={"/home"} message={"Home"}/>
      </div>
      <div className="loginSignup">
        <Button variant="contained" onClick>Sign up</Button>
        <Button variant="contained">Sign in</Button>
      </div>
    </div>
  )
}