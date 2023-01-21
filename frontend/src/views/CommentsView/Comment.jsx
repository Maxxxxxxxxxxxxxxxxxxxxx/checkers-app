import SportsBarIcon from "@mui/icons-material/SportsBar";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { commentActions as Actions } from "@/providers/Comments/CommentsReducer";
import { useAuthUser } from "react-auth-kit";
import { useState, useEffect } from "react";
import { useMqtt } from "@/providers/Mqtt/MqttProvider";
import axios from "axios";

export default function Comment({ state }) {
  const [isBeerGiven, setBeerGiven] = useState(false);
  let dispatch = useDispatch();
  let auth = useAuthUser();
  const { client, subscribe } = useMqtt();

  console.log("comment state", state)
  console.log(isBeerGiven)

  useEffect(() => {
    subscribe("beers")
    if(state.beers.find(beer => beer.author == auth())) setBeerGiven(true)
  }, [])

  const giveBeer = () => {
    axios
      .post(`http://localhost:8080/comments/comment/${state.id}/beer/${auth()}`)
      .then(res => {
        console.log("New beer: ", res.data)
        dispatch(Actions.GiveBeer({ beer: res.data, id: state.id }))
        setBeerGiven(true)
      })
  }

  const removeBeer = () => {
    axios
      .delete(`http://localhost:8080/comments/comment/${state.id}/beer/${auth()}`)
      .then(res => {
        console.log("Deleted beer", res.data)
        dispatch(Actions.RemoveBeer({ author: auth(), id: state.id }))
        setBeerGiven(false)
      })
  }

  const handleBeerClick = () => isBeerGiven ? removeBeer() : giveBeer();

  const handleDelete = () => axios
    .delete(`http://localhost:8080/comments/comment/${state.id}`)
    .then(res => {
      console.log("Deleted comment")
      // dispatch(Actions.Delete(state.id))
      client.publish("comments/delete", state.id)
    })

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
      <div className="comment__rightside">
        <div className={ isBeerGiven ? "beer beer--given" : "beer" }>
          <IconButton aria-label="beer" onClick={() => handleBeerClick()}>
            <SportsBarIcon></SportsBarIcon>
          </IconButton>
          <span className="beer__amount">{state.beers.length}</span>
        </div>
        { state.author === auth() && <button className="small-button" onClick={() => handleDelete()}>Delete</button>}
      </div>
    </div>
  );
}
