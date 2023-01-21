import { Box, Button, Typography } from "@mui/material/index";
import BoardPreview from "@/views/Preview/BoardPreview";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=b`;
  let linkWhite = `/game?id=${gamestate.id}&player=w`;

  let [comments, setComments] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/games/game/${gamestate.id}/comments`)
      .then((res) => setComments(res.data));
  }, []);

  return (
    <Box className="element">
      <BoardPreview gamestate={gamestate} />
      <div className="element__info">
          <Typography
            variant="h4"
            sx={{ fontWeight: 1000, fontSize: "2.5rem" }}
            className="element__name"
          >
            {gamestate.name}
          </Typography>
          <div className="element__labels">
            <div className="element__buttons">
              <button
                className="big-button element__btn"
                onClick={() => navigate(linkBlack)}
              >
                Play as black
              </button>
              <button
                className="big-button element__btn"
                onClick={() => navigate(linkWhite)}
              >
                Play as white
              </button>
            </div>
            <Typography
              className="element__comments-link"
              variant="p"
              sx={{ color: "grey", fontWeight: 1000, alignSelf: "flex-end" }}
              onClick={() => navigate(`/comments/${gamestate.id}`)}
            >
              Comments ({comments.length})
            </Typography>
          </div>
      </div>
    </Box>
  );
}
