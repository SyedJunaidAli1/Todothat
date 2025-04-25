import { ChevronFirst, MoreVertical } from "lucide-react";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ children }) => {
  return (
    <aside className="h-screen w-60">
      <nav className=" h-full flex flex-col border-r shadow-sm">
        <div className=" p-4 pb-2 flex justify-between items-center">
          <h1 className=" w-32">TODO App</h1>
          <button className=" p-1.5 rounded-lg text-black bg-gray-50 hover:bg-gray-300">
            <ChevronFirst />
          </button>
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <div className="border-t flex p-3">
          <img src="file.svg" alt="" className=" w-10 h-10 rounded-md" />
          <div className="flex justify-between items-center w-52 ml-3">
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
  return (
    <li className={`
      relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors 
      ${active ? "bg-gradient-to-tr from-emerald-300 to bg-emerald-400"
        : "hover:bg-emerald-200"
      }`}>
        
      {icon}
      <span className="w-52 ml-3">{text}</span>
      {alert && (<div className={`absolute right-2 w-2 h-2 rounded bg-emerald-400`} />)}
    </li>
  )
}


export { Sidebar, SidebarItem };
