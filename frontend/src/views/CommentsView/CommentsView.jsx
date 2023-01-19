import { useEffect, useState } from "react";
import { Typography, Toolbar, IconButton } from "@mui/material/index";
import { Menu } from "@mui/icons-material/index";
import AddIcon from '@mui/icons-material/Add';
import "@/styles/CommentsView/CommentsView.css";
import View from "../View";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  commentActions as Actions,
  getComments,
} from "@/providers/Comments/CommentsReducer";
import Comment from "./Comment";
import axios from "axios";
import AddComment from "./AddComment";

export default function CommentsView() {
  let dispatch = useDispatch();
  let { id } = useParams();
  let comments = useSelector((state) => state.comments);
  let [gameName, setGameName] = useState(""); 

  useEffect(() => {
    axios.get(`http://localhost:8080/games/game/${id}`)
      .then(res => setGameName(res.data.name))

    dispatch(getComments(id));
  }, []);

  return (
    <View>
      <div className="comments-view">
        <Toolbar variant="dense" className="toolbar">
          <span className="toolbar__leftside comments-view__toolbar">
            <Menu />
            <Typography
              className="toolbar__text"
              variant="p"
              color="inherit"
              component="div"
            >
              Comments ({ gameName })
              <Typography variant="p" color="gray" component="div">
                ({ comments ? comments.data.length : "?" })
              </Typography>
            </Typography>
          </span>
          <span className="toolbar__rightside">
            <IconButton sx={{color: "white"}} aria-label="Add comment">
              <AddIcon></AddIcon>
            </IconButton>
            <form action="">
              <input className="toolbar__search" type="text" name="search" placeholder="Search" />
            </form>
          </span>
        </Toolbar>
        <section className="comments">
          <AddComment />
          {!comments.loading
            ? comments.data.map((comment) => (
                <Comment
                  key={Math.floor(Math.random() * 100000)}
                  state={comment}
                ></Comment>
              ))
            : "Loading..."}
        </section>
      </div>
    </View>
  );
}
