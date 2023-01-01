import { Box, ButtonGroup, Button, Typography } from '@mui/material/index';
import { Link } from "react-router-dom";
import BoardPreview from './Preview/BoardPreview';

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=black`;
  let linkWhite = `/game?id=${gamestate.id}&player=white`;

  return (
    <Box className="element">
      <BoardPreview gamestate={gamestate} />
      <div className="element__label">
        <Typography>
          { gamestate.name }
          {/* game name */}
        </Typography>
      </div>
      {/* <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Link to={linkWhite}>
          <Button className="button--white">Play white</Button> 
        </Link>
        <Link to={linkBlack}>
          <Button className="button--black">Play black</Button>
        </Link>
      </ButtonGroup> */}
    </Box>
  )
}