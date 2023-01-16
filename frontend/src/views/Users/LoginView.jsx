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

  const login = async (loginData) => {
    axios.put("http://localhost:8080/user/login", loginData)
      .then(loginResponse => {
        if(signIn({
          token: loginResponse.data.token,
          expiresIn: 360,
          tokenType: "Bearer",
          authState: loginData.username
        })) {
          navigate("/home")
        } else {
          alert("Sign in failed!")
        }
      });
  }
  
  return (
    <View>
      <div className="login">
        <Typography
          variant="h4"
          sx={{ fontWeight: 1000 }}
          className="login__heading"
        >
          Login
        </Typography>
        <Form action={(data) => {console.log("data",data), login(data)}}></Form>
      </div>
    </View>
  );
}
