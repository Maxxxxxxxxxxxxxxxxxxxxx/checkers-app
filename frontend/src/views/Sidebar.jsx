import "@/styles/SideBar/Sbar.css";
import { Typography } from "@mui/material/index";
import { Link } from "react-router-dom";
import { Menu } from "@mui/icons-material/index";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import AppsTwoToneIcon from "@mui/icons-material/AppsTwoTone";
import { useSidebarContext } from "@/providers/Sidebar/SidebarProvider";

export default function Sidebar({children}) {
  let { folded, setFold } = useSidebarContext();

  return folded === false ? (
    <div className="view-wrapper">
      <div className="sidebar">
        <div className="sidebar__upper">
          <Typography className="logo" variant="p" component="div">
            Checkers.com
          </Typography>
          <div className="sidebar__links">
            <Link to="/home" className="sidebar__link">
              <HomeIcon className="sidebar__link-icon" />
              Home
            </Link>
            <Link to="/list" className="sidebar__link">
              <AppsTwoToneIcon className="sidebar__link-icon" />
              Games
            </Link>
            <Link to="/newgame" className="sidebar__link">
              <AddBoxIcon className="sidebar__link-icon" />
              New
            </Link>
          </div>
        </div>
        <div className="sidebar__lower">
          <div
            className="sidebar__link sidebar__link--lower fold-button"
            onClick={() => setFold(true)}
          >
            <div className="sidebar__icon-wrapper">
              <SwitchRightIcon className="sidebar__link-icon sidebar__link-icon--lower" />
            </div>
            Collapse
          </div>
          <div className="sidebar__link sidebar__link--lower">
            <div className="sidebar__icon-wrapper">
              <SettingsIcon className="sidebar__link-icon sidebar__link-icon--lower" />
            </div>
            Settings
          </div>
          <div className="sidebar__link sidebar__link--lower">
            <div className="sidebar__icon-wrapper">
              <HelpIcon className="sidebar__link-icon sidebar__link-icon--lower" />
            </div>
            Help
          </div>
        </div>
      </div>
      {children}
    </div>
  ) : (
    <div className="view-wrapper">
      <div className="sidebar sidebar--folded">
        <div className="sidebar__upper">
          <Typography className="logo logo--folded" variant="p" component="div">
            C
          </Typography>
          <div className="sidebar__links">
            <Link to="/home" className="sidebar__link sidebar__link--folded">
              <HomeIcon className="sidebar__link-icon sidebar__link-icon--folded" />
            </Link>
            <Link to="/list" className="sidebar__link sidebar__link--folded">
              <AppsTwoToneIcon className="sidebar__link-icon sidebar__link-icon--folded" />
            </Link>
            <Link to="/newgame" className="sidebar__link sidebar__link--folded">
              <AddBoxIcon className="sidebar__link-icon sidebar__link-icon--folded" />
            </Link>
          </div>
        </div>
        <div className="sidebar__lower">
          <div
            className="sidebar__link sidebar__link--folded sidebar__link--lower fold-button"
            onClick={() => setFold(false)}
          >
            <div className="sidebar__icon-wrapper">
              <SwitchLeftIcon className="sidebar__link-icon sidebar__link-icon--folded sidebar__link-icon--lower" />
            </div>
          </div>
          <div className="sidebar__link sidebar__link--folded sidebar__link--lower">
            <div className="sidebar__icon-wrapper">
              <SettingsIcon className="sidebar__link-icon sidebar__link-icon--folded sidebar__link-icon--lower" />
            </div>
          </div>
          <div className="sidebar__link sidebar__link--folded sidebar__link--lower">
            <div className="sidebar__icon-wrapper">
              <HelpIcon className="sidebar__link-icon sidebar__link-icon--folded sidebar__link-icon--lower" />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
