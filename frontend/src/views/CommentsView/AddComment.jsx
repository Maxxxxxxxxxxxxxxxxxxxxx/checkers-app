import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuthUser } from "react-auth-kit";
import { commentActions as Actions } from "@/providers/Comments/CommentsReducer";
import axios from "axios";
import { useMqtt } from "@/providers/Mqtt/MqttProvider";

const AddComment = () => {
  const {
    register,
    handleSubmit,
  } = useForm();

  const { test } = useMqtt();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate
  const auth = useAuthUser()
  const username = auth();

  const onSubmit = (data) => {
    if (!username) return navigate("/login");
    const { title, content } = data;

    axios.post(`http://localhost:8080/comments/${id}`, {
      author: username,
      title,
      content
    }).then(res => {
      dispatch(Actions.Add(res.data))
      console.log(res.data)
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
          <button onClick={() => test()}>send ping mqtt</button>
        </div>
        <button className="big-button" type="submit"> Add comment </button>
      </form>
    </div>
  );
};

export default AddComment;
