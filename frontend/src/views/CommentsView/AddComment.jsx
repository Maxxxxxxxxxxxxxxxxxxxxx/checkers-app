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
  useEffect(() => {
    if(client) {
        subscribe("comments")
        subscribe("comments/delete")
        client.on("message", (topic, payload) => {
          if(topic === "comments") {
            const data = JSON.parse(payload.toString());
            dispatch(commentActions.Add(data))
          }
          else if(topic === "comments/delete") {
            const data = payload.toString();
            dispatch(commentActions.Delete(data))
          }
        })
    }
  }, [client])

  const onSubmit = (data) => {
    if (!username) return navigate("/login");
    const { title, content } = data;
    const payload = {
      title,
      content,
      author: username
    }

    axios.post(`http://localhost:8080/games/game/${id}/comments`, payload).then(res => {
      // dispatch(Actions.Add(res.data))
      client.publish("comments", JSON.stringify(res.data))
    })
  };

  return (
    <div className="add-comment">
      <form className="add-comment__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="add-comment__container">
          <div className="add-comment__head">
            <input
              type="text"
              placeholder="title"
              {...register("title", { required: true, maxLength: 30 })}
            />
            <p> Add comment </p>
          </div>
          <textarea {...register("content", { required: true, maxLength: 500 })} />
        </div>
        <button className="big-button" type="submit"> Add comment </button>
      </form>
      <button onClick={() => unsubscribe("beers")}>send ping mqtt</button>
    </div>
  );
};

export default AddComment;
