import "@/styles/Home/Home.css";
import { Link } from 'react-router-dom';

export default function HomeView() {
  return (
    <div className="view">
      <div className="home-window">
        <div className="home-window__header"> 
          Checkers 
        </div>
        <div className="home-window__buttons">
          <Link to="/games">
            <button className="big-button">
              <div className="big-button__content">
                Games
              </div>
            </button>
          </Link>
          <Link to="/newgame">
            <button className="big-button">
              <div className="big-button__content">
                New game
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}