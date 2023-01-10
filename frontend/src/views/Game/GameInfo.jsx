import { useGameContext } from "@/providers/Checkers/GameContextProvider";
import { Typography } from "@mui/material";

export default function GameInfo() {
    let { gamestate } = useGameContext();

    return (
        <div className="game-info">
            <Typography variant="h4" sx={{textAlign: "center"}}>
                { gamestate.name }
            </Typography>
            <div className="game-info__params">
                <Typography variant="p">
                    Move: { gamestate.current_color === "w" ? "WHITE" : "BLACK" }
                </Typography>
            </div>
        </div>
    )
}