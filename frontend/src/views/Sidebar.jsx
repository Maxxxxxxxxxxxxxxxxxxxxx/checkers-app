import "@/styles/SideBar/Sbar.css";
import { Typography, Button, IconButton, Box } from "@mui/material/index";
import { Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HomeIcon from "@mui/icons-material/Home";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import AppsTwoToneIcon from "@mui/icons-material/AppsTwoTone";
import { useSidebarContext } from "@/providers/Sidebar/SidebarProvider";
import { useNavigate } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";

import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar({ children }) {
  let { folded, setFold } = useSidebarContext();
  let navigate = useNavigate();
  let signOut = useSignOut();

  const getUsername = useAuthUser();

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
          {getUsername() ? (
            <Box
              className="sidebar__auth sidebar__auth--logged-in"
              sx={{ color: "white" }}
            >
              <Box
                className="sidebar__auth__wrapper"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bolder",
                  justifySelf: "flex-start",
                }}
              >
                <IconButton
                  aria-label="user"
                  className="sidebar__icon-button"
                >
                  <AccountCircleIcon
                    sx={{ color: "white" }}
                  ></AccountCircleIcon>
                </IconButton>
                {getUsername()}
              </Box>
              <Link className="sidebar__auth__logout" to="/login" onClick={() => signOut()}>
              <IconButton
                  aria-label="user"
                  className="sidebar__icon-button"
                  onClick={() => navigate("/profile")}
                >
                  <LogoutIcon
                    sx={{ color: "grey" }}
                  ></LogoutIcon>
                </IconButton> 
                Log out
              </Link>
            </Box>
          ) : (
            <Box sx={{ marginLeft: "20px"}}className="sidebar__auth">
              <Button sx={{width: "80%", justifySelf: "center" }} variant="contained" onClick={() => navigate("/register")}>
                Sign up
              </Button>
              <Button sx={{width: "80%", justifySelf: "center" }} variant="outlined" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </Box>
          )}
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
          { getUsername() ? (
            <Box
              className="sidebar__auth sidebar__auth--logged-in"
              sx={{ color: "white" }}
            >
              <Box
                className="sidebar__auth__wrapper"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bolder",
                  justifySelf: "flex-start",
                }}
              >
                <IconButton
                  aria-label="register"
                  className="sidebar__icon-button"
                  onClick={() => navigate("/profile")}
                >
                  <AccountCircleIcon
                    sx={{ color: "white" }}
                  ></AccountCircleIcon>
                </IconButton>
                {/* {getUsername()} */}
              </Box>
              <Link className="sidebar__auth__logout" to="/login" onClick={() => signOut()}>
              <IconButton
                  aria-label="user"
                  className="sidebar__icon-button"
                >
                  <LogoutIcon
                    sx={{ color: "grey" }}
                  ></LogoutIcon>
                </IconButton> 
              </Link>
            </Box>
          ) : <Box sx={{ width: "20px", gap: "0.2rem" }} className="sidebar__auth">
            <IconButton
              aria-label="register"
              onClick={() => navigate("/register")}
              className="sidebar__icon-button"
            >
              <PersonAddIcon sx={{ color: "white" }}></PersonAddIcon>
            </IconButton>
            <IconButton
              aria-label="login"
              onClick={() => navigate("/login")}
              className="sidebar__icon-button"
            >
              <LoginIcon sx={{ color: "white" }}></LoginIcon>
            </IconButton>
          </Box>}
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
