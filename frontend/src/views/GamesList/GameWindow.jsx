import { Box, ButtonGroup, Button, Typography } from '@mui/material/index';
import { Link } from "react-router-dom";
import BoardPreview from '@/views/Preview/BoardPreview';

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=black`;
  let linkWhite = `/game?id=${gamestate.id}&player=white`;

  return (
    <Box className="element">
      <BoardPreview gamestate={gamestate} />
      <div className="element__label">
        <Typography>
          { gamestate.name }
        </Typography>
      </div>
    </Box>
  )
}