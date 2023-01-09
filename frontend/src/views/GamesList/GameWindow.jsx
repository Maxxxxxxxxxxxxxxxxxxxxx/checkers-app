import { Box, ButtonGroup, Button, Typography } from '@mui/material/index';
import { Link } from "react-router-dom";
import BoardPreview from '@/views/Preview/BoardPreview';
import { useNavigate } from 'react-router-dom';

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=black`;
  let linkWhite = `/game?id=${gamestate.id}&player=white`;

  let navigate = useNavigate();

  return (
    <Box className="element">
      <BoardPreview gamestate={gamestate} />
      <div className="element__label">
        <Typography>
          { gamestate.name }
        </Typography>
        <div className="element__buttons">
          <Button sx={{background: "rgb(127,166,80)"}} onClick={() => navigate(linkWhite)}>
            <span className="pawn-white-icon">

            </span>
          </Button>
          <Button sx={{background: "rgb(127,166,80)"}} onClick={() => navigate(linkBlack)}>
            <span className="pawn-black-icon">
            </span>
          </Button>
        </div>
      </div>
    </Box>
  )
}