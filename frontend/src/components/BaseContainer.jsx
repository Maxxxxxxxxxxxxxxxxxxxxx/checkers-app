import ThreadsContainer from "./ContainerViews/ForumView/ThreadsContainer";
import GameApp from "./ContainerViews/GameApp/GameApp";

export default function BaseContainer({ view }) {
  switch (view) {
    case 'forum':
      var content = <ThreadsContainer />
    case 'game':
      var content = <GameApp />
    case 'login':
      break;
  }
  return (
    <div className="base-container">
      { content }
    </div>
  )
}