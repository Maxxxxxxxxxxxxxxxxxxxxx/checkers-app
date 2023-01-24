import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuthUser } from "react-auth-kit";
import { commentActions as Actions, commentActions } from "@/providers/Comments/CommentsReducer";
import axios from "axios";
import { useMqtt } from "@/providers/Mqtt/MqttProvider";
import { useState, useEffect} from "react";

const AddComment = () => {
  const {
    register,
    handleSubmit,
  } = useForm();

  const { client, subscribe, unsubscribe } = useMqtt();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuthUser();
  const username = auth();

  // sub and listen to comments topic on mqtt broker
  // set handlers for all mqtt messages across the CommentsView
  useEffect(() => {
    if(client) {
        subscribe("comments")
        subscribe("comments/delete")
        subscribe("comments/edit")

        client.on("message", (topic, payload) => {
          console.log("RECEIVED MESSAGE ON TOPIC", topic, payload.toString());
          if(topic === "comments") {
            const data = JSON.parse(payload.toString());
            dispatch(commentActions.Add(data))
          }
          else if(topic === "comments/delete") {
            const data = payload.toString();
            dispatch(commentActions.Delete(data))
          }
          else if(topic === "comments/edit") {
            const data = JSON.parse(payload.toString());
            dispatch(commentActions.Edit(data))
          }
        })
    }
  }, [client])

  const onSubmit = (data) => {
    const { title, content } = data;

    if(!username) return navigate("/login");
    if(title.length <= 1) return alert("Title must be longer than one character!")
    if(content.length <= 3) return alert("Content must be at least 3 characters long!")

    const payload = {
      title,
      content,
      author: username
    }

    axios.post(`http://localhost:8080/games/game/${id}/comments`, payload).then(res => {
      // dispatch(Actions.Add(res.data))
      client.publish("comments", JSON.stringify(res.data))
    })

    document.getElementById('add-comment').reset();
  };

  return (
    <div className="add-comment">
      <form className="add-comment__form" onSubmit={handleSubmit(onSubmit)} id="add-comment">
        <div className="add-comment__container">
          <div className="add-comment__head">
            <input
              type="text"
              placeholder="title"
              {...register("title", { required: false, maxLength: 30 })}
            />
            <p> Add comment </p>
          </div>
          <textarea {...register("content", { required: false })} />
        </div>
        <button className="big-button" type="submit"> Add comment </button>
      </form>
    </div>
  );
};

export default AddComment;
