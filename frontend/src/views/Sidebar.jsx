import "@/styles/SideBar/Sbar.css";
import { Typography } from "@mui/material/index";
import { Link } from "react-router-dom";
import { Menu } from "@mui/icons-material/index";
import AddBoxIcon from '@mui/icons-material/AddBox';
import HomeIcon from '@mui/icons-material/Home';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Typography className="logo" variant="p" component="div">
        Checkers.com
      </Typography>
      <div className="sidebar__links">
        <Link to="/home" className="sidebar__link">
          <HomeIcon className="sidebar__link-icon"/>
          Home
        </Link>
        <Link to="/list" className="sidebar__link">
          <Menu className="sidebar__link-icon"/> 
          Games
        </Link>
        <Link to="/newgame" className="sidebar__link">
          <AddBoxIcon className="sidebar__link-icon" />
          New
        </Link>
      </div>
    </div>
  )
}