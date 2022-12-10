import './styles/App/App.css';
import BaseView from './components/BaseView';
import GameApp from './views/Game/GameApp';
import NotFoundPage from './views/404/NotFoundPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/home" element={<BaseView view={ "home" }/>}></Route>
      <Route path="/game" element={<BaseView view={ "game" } />}></Route>
      <Route path="/forum" element={<BaseView view={ "forum" } />}></Route>
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  )
}

export default App
