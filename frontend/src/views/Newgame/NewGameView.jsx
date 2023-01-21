import { Toolbar, Typography } from "@mui/material/index";

import { Fragment, useEffect, useState } from "react";
import "@/styles/Newgame/Newgame.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";
import BoardPreview from "../Preview/BoardPreview";
import View from "../View";
import { useForm } from "react-hook-form";
import { useAuthUser } from "react-auth-kit";

export default function NewGameView() {
  const [previewState, setPreviewState] = useState();
  const [params, setParams] = useState({
    white: "top",
    black: "bottom",
  });
  
  useEffect(() => {
    axios
      .put("http://localhost:8080/games/preview", {
        ...params,
        name: "dummy",
        mode: "easy",
      })
      .then((res) => setPreviewState(res.data));
    }, [params]);
    
  const auth = useAuthUser()

  console.log("user", auth());

  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
    // defaultValues: {
    //   name: `${auth().username}'s game`
    // }
  });

  const onSubmit = async (data) => {
    
  };

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
              placeholder="Game name"
              className="newgame__textfield"
              {...register("name", { required: "Enter game name" })}
            />
            <div className="newgame__checkbox-group">
              <input
                type="checkbox"
                {...register("mode", { required: "Enter username" })}
              />{" "}
              Hard mode
            </div>
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
