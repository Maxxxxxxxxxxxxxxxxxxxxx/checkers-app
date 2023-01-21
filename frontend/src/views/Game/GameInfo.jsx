import { useGameContext } from "@/providers/Checkers/GameContextProvider";
import { Typography, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export default function GameInfo() {
  let { gamestate } = useGameContext();
  let [params] = useSearchParams();

  let currentColor = params.get("player");

  return (
    <div className="game-info">
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Playing as {currentColor === "w" ? "WHITE" : "BLACK"}
      </Typography>
      <Box sx={{ marginTop: "2rem" }} className="game-info__params">
        <Typography variant="p">
          Now moving: {gamestate.current_color === "w" ? "WHITE" : "BLACK"}
        </Typography>
        <Typography variant="p">Turn: {gamestate.turn}</Typography>
      </Box>
    </div>
  );
}
