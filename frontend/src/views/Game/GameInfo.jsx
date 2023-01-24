import { useGameContext } from "@/providers/Checkers/GameContextProvider";
import { Typography, Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GameInfo() {
  let { gamestate } = useGameContext();
  let [params] = useSearchParams();
  const [endMessage, setEndMessage] = useState("");

  useEffect(() => {
    if(gamestate.is_end) {
      setEndMessage("Game ended!")
    }
  }, [gamestate])

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
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          { endMessage }
        </Typography>
      </Box>
    </div>
  );
}
