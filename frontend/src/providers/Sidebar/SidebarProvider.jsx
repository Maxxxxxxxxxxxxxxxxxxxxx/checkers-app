import useWindowDimensions from "@/hooks/useWindowDimensions";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";

const SidebarContext = createContext();
export const useSidebarContext = () => useContext(SidebarContext);

export default function SidebarContextProvider({ children }) {
    let { width } = useWindowDimensions();
    let [folded, setFold] = useState(false);
    let [sidebarMargin, setMargin] = useState("170px");

    useEffect(() => {
        width < 1000 ? setFold(true) : undefined
    }, [width])
    
    useEffect(() => {
        folded ? setMargin("3rem") : setMargin("170px")
    }, [folded])

    return (
        <SidebarContext.Provider value={{folded, setFold, sidebarMargin}}>
            {children}
        </SidebarContext.Provider>
    )
}