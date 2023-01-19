import SportsBarIcon from "@mui/icons-material/SportsBar";
import { IconButton } from "@mui/material";

export default function Comment({ state }) {
  // console.log(state);

  return (
    <div className="comment">
      <div className="comment__body">
        <div className="comment__head">
          <div className="comment__title"> {state.title} </div>
          <div className="comment__author"> {state.author} </div>
          <div className="comment__date">
            {" "}
            {`Last edited ${new Date(state.timestamp * 1000)}`.slice(0, 36)}{" "}
          </div>
        </div>
        <p className="comment__content">{state.content}</p>
      </div>
      <div className="beer">
        <IconButton aria-label="beer">
          <SportsBarIcon></SportsBarIcon>
        </IconButton>
        <span className="beer__amount">{state.beers.length}</span>
      </div>
    </div>
  );
}
