import ThreadsContainer from "../views/Forum/ThreadsContainer";
import GameApp from "../views/Game/GameApp";
import GameContextProvider from "../providers/GameContextProvider";

export default function BaseContainer({ view }) {
  switch (view) {
    case 'forum':
      var content = <ThreadsContainer />
    case 'game':
      var content = <GameContextProvider><GameApp /></GameContextProvider>
    case 'login':
      break;
  }
  return (
    <div className="base-container">
      { content }
    </div>
  )
}