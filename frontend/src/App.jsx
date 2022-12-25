import "./styles/App/App.css";
import GameView from "./views/Game/GameView";
import NotFoundPage from "./views/404/NotFoundPage";
import { Routes, Route } from "react-router-dom";
import GameContextProvider from "./providers/GameContextProvider";

function App() {
  return (
    <Routes>
      {/* <Route path="/home" element={<HomeView />}></Route> */}
      <Route
        path={"/game"}
        element={
          <GameContextProvider>
            <GameView />
          </GameContextProvider>
        }
      ></Route>
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
}

export default App;
