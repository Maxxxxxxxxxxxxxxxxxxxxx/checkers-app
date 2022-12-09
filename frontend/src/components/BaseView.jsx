import SideBar from './SideBar';
import BaseContainer from './BaseContainer';

export default function BaseView({ view }) {
  return (
    <div className="base-view">
      <SideBar />
      <BaseContainer view={view}/>
    </div>
  )
}