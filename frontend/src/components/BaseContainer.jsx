import ThreadsContainer from "./ContainerViews/ForumView/ThreadsContainer";
import GameApp from "./ContainerViews/GameApp/GameApp";
import GameContextProvider from "./ContainerViews/GameApp/GameContextProvider";

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