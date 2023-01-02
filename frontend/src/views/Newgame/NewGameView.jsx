import { Fragment, useEffect, useState } from "react";
import { Toolbar, IconButton, Typography, Skeleton } from "@mui/material/index";
import ChatTab from "../ChatTab/ChatTab";
import Sidebar from "../Sidebar";
import '@/styles/Newgame/Newgame.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';
import BoardPreview from "../Preview/BoardPreview";
import { useFormik } from 'formik';
import { FormLabel, RadioGroup, FormControlLabel, Radio} from "@mui/material/index";

export default function NewGameView() {
  let [gamestate, setGamestate] = useState([]);

  let formik = useFormik({
    initialValues: {
      mode: 'easy',
      name: 'New Game',
      white: 'top',
      black: 'bottom'
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  // useEffect(() => {
  //   axios.get("")
  // }, [])

  return (
    <Fragment>
      <Sidebar></Sidebar>
      <div className="view">
        <div className="newgame">
          <Toolbar variant="dense" className="toolbar">
              <span className="toolbar__leftside">
                <AddBoxIcon />
                <Typography
                  className="toolbar__text"
                  variant="p"
                  color="inherit"
                  component="div"
                >
                  New game
                </Typography>
              </span>
          </Toolbar>
          <div className="newgame__container">
            <form className="newgame__form" onSubmit={formik.onSubmit}>
              <FormLabel id="demo-radio-buttons-group-label">Mode</FormLabel>
              <RadioGroup
                defaultValue="easy"
                name="radio-buttons-group"
              >
                <FormControlLabel value="hardcore" control={<Radio />} label="Hardcore" />
                <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              </RadioGroup>
            </form>
            <div className="board-preview">
            </div>
          </div>
        </div>
        <ChatTab></ChatTab>
      </div>
    </Fragment>
  );
}
