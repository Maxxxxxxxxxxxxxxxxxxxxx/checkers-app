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

function App() {
  return (
    <Routes>
      <Route path={"/home"} element={<HomeView />}></Route>
      <Route
        path={"/game"}
        element={
          <RequireAuth loginPath={'/login'}>
            <GameContextProvider>
              <GameView />
            </GameContextProvider>
          </RequireAuth>
        }
      ></Route>
      <Route path={"/list"} element={<GamesListView />} />
      <Route path={"/newgame"} element={
        <RequireAuth loginPath={'/login'}>
          <NewGameView />
        </RequireAuth>
      } />
      <Route path={"/register"} element={<RegisterView />} />
      <Route path={"/login"} element={<LoginView />} />
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
}

export default App;
