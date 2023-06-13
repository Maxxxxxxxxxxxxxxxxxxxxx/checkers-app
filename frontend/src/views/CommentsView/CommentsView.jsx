import { useEffect, useState } from "react";
import { Typography, Toolbar, IconButton } from "@mui/material/index";
import { Menu } from "@mui/icons-material/index";
import AddIcon from "@mui/icons-material/Add";
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
  let [sorting, setSorting] = useState("newest");
  console.log(comments.data);

  const [searchPattern, setSearchPattern] = useState(/.*/);

  const handleChangeSorting = (event) => {
    console.log(event.target.value);
    setSorting(event.target.value);
  };

  const setPattern = (string) =>
    string ? setSearchPattern(new RegExp(string)) : setSearchPattern(/.*/);

  // useEffect(() => {
  //   dispatch(Actions.Sort(sorting))
  // }, [sorting])

  useEffect(() => {
    axios
      .get(`http://localhost:8081/games/game/${id}`)
      .then((res) => setGameName(res.data.name));
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
              Comments ({gameName})
              <Typography variant="p" color="gray" component="div">
                ({comments ? comments.data.length : "?"})
              </Typography>
            </Typography>
          </span>
          <span className="toolbar__rightside">
            {/* <select
              onChange={(e) => handleChangeSorting(e)}
              className="newgame__selector"
            >
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
              <option value="beers">By beers</option>
            </select> */}
            <form onChange={(event) => setPattern(event.target.value)}>
              <input
                className="toolbar__search"
                type="text"
                name="search"
                placeholder="Search"
              />
            </form>
          </span>
        </Toolbar>
        <section className="comments">
          <AddComment />
          {!comments.loading
            ? comments.data.map((comment) => {
                console.log(comments.data);
                if (
                  searchPattern.test(comment.title) ||
                  searchPattern.test(comment.content) ||
                  searchPattern.test(comment.author)
                )
                  return (
                    <Comment
                      key={Math.floor(Math.random() * 100000)}
                      state={comment}
                    ></Comment>
                  );
              })
            : "Loading..."}
        </section>
      </div>
    </View>
  );
}
