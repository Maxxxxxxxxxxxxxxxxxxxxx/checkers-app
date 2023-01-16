import { Box, Button, Typography } from '@mui/material/index';
import BoardPreview from '@/views/Preview/BoardPreview';
import { useNavigate } from 'react-router-dom';

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=b`;
  let linkWhite = `/game?id=${gamestate.id}&player=w`;

  let navigate = useNavigate();

  return (
    <Box className="element">
      <BoardPreview gamestate={gamestate} />
      <div className="element__info">
        <Typography variant="h4" sx={{fontWeight: 1000, fontSize: "1.5rem"}} className="element__name">
          { gamestate.name }
        </Typography>
        <div className="element__labels">
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
          <Typography variant="p" sx={{color: "grey", fontWeight: 1000}}>Comments (0)</Typography>
        </div>
      </div>
    </Box>
  )
}