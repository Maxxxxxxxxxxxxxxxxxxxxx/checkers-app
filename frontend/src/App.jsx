import "./styles/App/App.css";
import GameView from "./views/Game/GameView";
import NotFoundPage from "./views/404/NotFoundPage";
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/Home/HomeView";
import GameContextProvider from "@/providers/Checkers/GameContextProvider";
import GamesListView from "./views/GamesList/GamesList";
import NewGameView from "./views/Newgame/NewGameView";
import LoginView from "./views/Users/LoginView";
import RegisterView from "./views/Users/RegisterView";
import { RequireAuth } from 'react-auth-kit'
import CommentsView from "./views/CommentsView/CommentsView";
import { Provider } from 'react-redux';
import CommentReducer from "./providers/Comments/CommentsReducer";
import { configureStore } from "@reduxjs/toolkit";
import MqttProvider from "./providers/Mqtt/MqttProvider";
import ProfileView from "./views/ProfileView/ProfileView";

function App() {
  return (
    <Routes>
      <Route path={"/home"} element={<HomeView />}></Route>
      <Route
        path={"/game"}
        element={
          <RequireAuth loginPath={'/login'}>
            <MqttProvider>
              <GameContextProvider>
                <GameView />
              </GameContextProvider>
            </MqttProvider>
          </RequireAuth>
        }
      ></Route>
      <Route path={"/list"} element={<GamesListView />} />
      <Route path={"/newgame"} element={
        <RequireAuth loginPath={'/login'}>
          <NewGameView />
        </RequireAuth>
      } />
      <Route path={"/profile"} element={
        <RequireAuth loginPath={'/login'}>
          <ProfileView />
        </RequireAuth>
      } />
      <Route path={"/register"} element={<RegisterView />} />
      <Route path={"/login"} element={<LoginView />} />
      <Route path={"/comments/:id"} element={
        <MqttProvider>
          <Provider store={configureStore({
            reducer: {
              comments: CommentReducer,
            },
          })}>
            <CommentsView />
          </Provider>
        </MqttProvider>
      } />
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
}

export default App;
