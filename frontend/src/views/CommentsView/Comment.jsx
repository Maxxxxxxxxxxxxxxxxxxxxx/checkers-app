import SportsBarIcon from "@mui/icons-material/SportsBar";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { commentActions as Actions } from "@/providers/Comments/CommentsReducer";
import { useAuthUser } from "react-auth-kit";
import { useState, useLayoutEffect } from "react";
import { useMqtt } from "@/providers/Mqtt/MqttProvider";
import axios from "axios";
import KeycloakService from "@/services/KeycloakService";

export default function Comment({ state }) {
  const [isBeerGiven, setBeerGiven] = useState(false);
  let dispatch = useDispatch();
  let auth = useAuthUser();

  const { client, subscribe } = useMqtt();
  const [isEdit, setEdit] = useState(false);
  const [editState, setEditState] = useState({
    title: state.title,
    content: state.content,
  });

  const lastEditedMessage = `Last edited ${new Date(
    state.timestamp * 1000
  )}`.slice(0, 36);

  // console.log("comment state", state);
  // console.log(isBeerGiven);

  useLayoutEffect(() => {
    subscribe("beers");
    if (state.beers.find((beer) => beer.author == auth())) setBeerGiven(true);
  }, []);

  const giveBeer = () => {
    axios
      .post(`http://localhost:8081/comments/comment/${state.id}/beer/${auth()}`)
      .then((res) => {
        console.log("New beer: ", res.data);
        dispatch(Actions.GiveBeer({ beer: res.data, id: state.id }));
        setBeerGiven(true);
      });
  };

  const removeBeer = () => {
    axios
      .delete(
        `http://localhost:8081/comments/comment/${state.id}/beer/${auth()}`
      )
      .then((res) => {
        console.log("Deleted beer", res.data);
        dispatch(Actions.RemoveBeer({ author: auth(), id: state.id }));
        setBeerGiven(false);
      });
  };

  const handleBeerClick = () => (isBeerGiven ? removeBeer() : giveBeer());

  const submitEdit = () => {
    axios
      .put(`http://localhost:8081/comments/comment/${state.id}`, {
        author: auth(),
        title: editState.title,
        content: editState.content,
      })
      .then((res) => {
        client.publish(
          "comments/edit",
          JSON.stringify({
            ...state,
            title: res.data.title,
            content: res.data.content,
          })
        );
        setEdit(false);
      })
      .catch((err) => {
        alert("Connection error! Can't edit comment!");
        setEdit(false);
      });
  };

  const handleDelete = () =>
    axios
      .delete(`http://localhost:8081/comments/comment/${state.id}`)
      .then((res) => {
        console.log("Deleted comment");
        // dispatch(Actions.Delete(state.id))
        client.publish("comments/delete", state.id);
      });

  return (
    <div className="comment">
      <div className="comment__body">
        <div className="comment__head">
          {isEdit ? (
            <input
              type="text"
              className="comment__edit-title"
              defaultValue={state.title}
              onChange={(event) =>
                setEditState({ ...editState, title: event.target.value })
              }
            />
          ) : (
            <div className="comment__title"> {state.title} </div>
          )}
          <div className="comment__author"> {state.author} </div>
          <div className="comment__date">{lastEditedMessage}</div>
        </div>
        {isEdit ? (
          <textarea
            defaultValue={state.content}
            className="comment__edit-content"
            onChange={(event) =>
              setEditState({ ...editState, content: event.target.value })
            }
          ></textarea>
        ) : (
          <p className="comment__content">{state.content}</p>
        )}
      </div>
      <div
        className={`comment__rightside${
          state.author === auth() ? " comment__rightside--buttons" : ""
        }`}
      >
        <div className={isBeerGiven ? "beer beer--given" : "beer"}>
          <IconButton aria-label="beer" onClick={() => handleBeerClick()}>
            <SportsBarIcon></SportsBarIcon>
          </IconButton>
          <span className="beer__amount">{state.beers.length}</span>
        </div>
        <div className="comment__buttons">
          {(state.author === auth() || KeycloakService.isAdmin()) && (
            <button className="small-button" onClick={() => handleDelete()}>
              Delete
            </button>
          )}
          {(state.author === auth() || KeycloakService.isAdmin()) && (
            <button
              className="small-button"
              onClick={() => (isEdit ? submitEdit() : setEdit(true))}
            >
              {isEdit ? "Submit edit" : "Edit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
