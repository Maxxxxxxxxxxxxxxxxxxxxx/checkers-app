import View from "../View";
import Form from "../Users/Form";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Toolbar, IconButton, Menu, Typography } from "@mui/material/";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";
import KeycloakService from "@/services/KeycloakService";

export default function ProfileView() {
  const nav = useNavigate();
  const signOut = useSignOut();
  const auth = useAuthUser();

  const act = (data) => {
    if (KeycloakService.isAdmin())
      return alert("Can't modify admin credentials!");

    axios
      .put(`http://localhost:8081/user/users/edit/${auth()}`, data)
      .then((res) => {
        signOut();
        nav("/login");
      })
      .catch((err) => alert("Failed to modify user credentials!"));
  };

  return (
    <View>
      <div className="profile-view">
        <Toolbar variant="dense" className="toolbar">
          <span className="toolbar__leftside">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography
              className="toolbar__text"
              variant="p"
              color="inherit"
              component="div"
            >
              {`Editing ${auth()}`}
            </Typography>
          </span>
        </Toolbar>
        <section className="profile">
          <Form action={(data) => act(data)}></Form>
        </section>
      </div>
    </View>
  );
}
