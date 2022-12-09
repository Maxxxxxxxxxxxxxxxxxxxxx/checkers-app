import './styles/App/App.css';
import BaseView from './components/BaseView';
import GameApp from './components/ContainerViews/GameApp/GameApp';
import NotFoundPage from './components/NotFoundPage';
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
