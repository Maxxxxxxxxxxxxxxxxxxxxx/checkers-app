import "./styles/App/App.css";
import GameView from "./views/Game/GameView";
import NotFoundPage from "./views/404/NotFoundPage";
import { Routes, Route } from "react-router-dom";
import HomeView from "./views/Home/HomeView";
import GameContextProvider from "@/providers/Checkers/GameContextProvider";
import GamesListView from "./views/GamesList/GamesList";

function App() {
  return (
    <Routes>
      <Route path={"/home"} element={<HomeView />}></Route>
      <Route
        path={"/game"}
        element={
          <GameContextProvider>
            <GameView />
          </GameContextProvider>
        }
      ></Route>
      <Route path={"/list"} element={<GamesListView />} />
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
}

export default App;
