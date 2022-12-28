import { Box, ButtonGroup, Button, Typography } from '@mui/material/index';

export default function GameWindow({ gamestate }) {
  let linkBlack = `/game?id=${gamestate.id}&player=black`;
  let linkWhite = `/game?id=${gamestate.id}&player=white`;

  return (
    <Box className="element">
      <img src="" alt="" className='layout'/>
      <Typography>
        {/* { gamestate.id } */}
        game name
      </Typography>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button className="button--white">Play white</Button>
        <Button className="button--black">Play black</Button>
      </ButtonGroup>
    </Box>
  )
}