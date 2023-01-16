import View from "../View";
import Cookies from "universal-cookie";
import { Typography } from "@mui/material/index";
import "@/styles/Login/Login.css";
import Form from "./Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

export default function RegisterView() {
  let signIn = useSignIn();
  const navigate = useNavigate();

  const registerUser = async (loginData) => {
    axios.post("http://localhost:8080/user/register", loginData)
      .then(registerRes => {
        navigate("/login")
      })
      .catch(err => {
        alert("User already exists!")
      })
  };

  return (
    <View>
      <div className="login">
        <Typography
          variant="h4"
          sx={{ fontWeight: 1000 }}
          className="login__heading"
        >
          Register
        </Typography>
        <Form action={(data) => {console.log("data",data), registerUser(data)}}></Form>
      </div>
    </View>
  );
}
