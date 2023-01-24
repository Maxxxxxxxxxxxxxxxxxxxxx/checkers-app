import { Toolbar, Typography } from "@mui/material/index";

import { useLayoutEffect, useState } from "react";
import "@/styles/Newgame/Newgame.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";
import BoardPreview from "../Preview/BoardPreview";
import View from "../View";
import { useForm } from "react-hook-form";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

export default function NewGameView() {
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [previewState, setPreviewState] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    axios
      .post("http://localhost:8080/games/new_game", {
        author: auth(),
        mode: data.mode ? data.mode : "easy",
        white: data.topPos === "w" ? "top" : "bottom",
        black: data.topPos === "b" ? "top" : "bottom",
        name: data.name ? data.name : `${auth()}'s game`,
      })
      .then((res) =>
        navigate(
          `/game?id=${res.data.id}&player=${data.playAs}`
        )
      );
  };

  useLayoutEffect(() => {
    axios
      .put("http://localhost:8080/games/preview", {
        author: auth(),
        name: `${auth()}'s game`,
        white: "top",
        black: "bottom",
        mode: "easy",
      })
      .then((res) => setPreviewState(res.data));
  }, []);

  return (
    <View>
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
          <form className="newgame__form" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder={`${auth()}'s game`}
              className="newgame__textfield"
              {...register("gameName", {
                required: false,
                max: 20,
                min: 3,
                maxLength: 20,
              })}
            />
            <div className="newgame__select-group">
              <select {...register("topPos")} className="newgame__selector">
                <option value="w">white on top</option>
                <option value="b">black on top</option>
              </select>
              <select {...register("mode")} className="newgame__selector">
                <option value="easy">Easy</option>
                <option value="hardcore">Hardcore</option>
              </select>
              <select {...register("playAs")} className="newgame__selector">
                <option value="w">Play as white</option>
                <option value="b">Play as black</option>
              </select>
            </div>
            <button className="small-button" type="submit">
              Submit
            </button>
          </form>
          {previewState ? (
            <BoardPreview gamestate={previewState} />
          ) : (
            <div className="board-preview"></div>
          )}
        </div>
      </div>
    </View>
  );
}
