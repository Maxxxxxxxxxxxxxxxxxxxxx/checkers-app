import { useSidebarContext } from "@/providers/Sidebar/SidebarProvider";
import ChatTab from "./ChatTab/ChatTab";

export default function View({children}) {
  let { sidebarMargin } = useSidebarContext();

  return (
      <div className="view" style={{marginLeft: sidebarMargin}}>
        {children}
        <ChatTab></ChatTab>
      </div>
  )
}