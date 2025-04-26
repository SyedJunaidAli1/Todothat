'use client'
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import ThemeToggle from "./ThemeToggle";


const SidebarContext = createContext()
const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true)
  return (
    <aside className="h-screen">
      <nav className=" h-full flex flex-col border-r shadow-sm">
        <div className=" p-4 pb-2 flex justify-between items-center">
          <h1 className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>TODO App</h1>
          <button onClick={() => setExpanded((curr) => !curr)} className=" p-1.5 rounded-lg text-black bg-gray-50 hover:bg-gray-300">
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3">
          <img src="file.svg" alt="" className=" w-10 h-10 rounded-md" />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className=" font-semibold">Hola</h4>
              <span className="text-xs text-shadow-gray-600">
                Hola@123gmail.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

const SidebarItem = ({ icon, text, active, alert }) => {
  const { expanded } = useContext(SidebarContext)
  return (
    <li className={`
      relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
      ${active ? "bg-gradient-to-tr from-emerald-300 to bg-emerald-400"
        : "hover:bg-emerald-200"
      }`}>

      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {alert && (<div className={`absolute right-2 w-2 h-2 rounded bg-emerald-400 ${expanded ? "" : "top-2"}`} />)}

      {!expanded && (<div className={`absolute left-full rounded-md px-4 py-1 ml-6 bg-emerald-200 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 `}
      >
        {text}
      </div>)}
    </li>
  )
}


export { Sidebar, SidebarItem };
