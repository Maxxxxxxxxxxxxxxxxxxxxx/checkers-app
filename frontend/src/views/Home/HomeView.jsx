import "@/styles/Home/Home.css";
import { Link } from 'react-router-dom';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { Fragment } from "react";
import Sidebar from "../Sidebar";
import ChatTab from "../ChatTab/ChatTab";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useSidebarContext } from "@/providers/Sidebar/SidebarProvider";

export default function HomeView() {
  let { sidebarMargin } = useSidebarContext();
  return (
    <Fragment>
      <Sidebar />
      <div className="view" style={{marginLeft: sidebarMargin}}>
        <div className="home-window">
          <div className="home-window__header"> 
            Checkers 
          </div>
          <div className="home-window__buttons">
            <Link to="/list">
              <button className="big-button">
                <div className="big-button__content">
                  <ViewListRoundedIcon />
                  Games
                </div>
              </button>
            </Link>
            <Link to="/newgame">
              <button className="big-button">
                <div className="big-button__content">
                  <AddBoxIcon />
                  New game
                </div>
              </button>
            </Link>
          </div>
        </div>
      <ChatTab />
      </div>
    </Fragment>
  )
}