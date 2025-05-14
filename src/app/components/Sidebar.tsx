"use client";
import {
  ChevronFirst,
  ChevronLast,
  ChevronDown,
  Folder,
} from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import Profile from "./Profile";

const SidebarContext = createContext();
const Sidebar = ({ children, onItemSelect }) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r shadow-sm">
        <div className="p-10 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden text-xl transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            TODO App
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg text-black bg-gray-50 hover:bg-gray-300"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, onItemSelect }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

          <Profile expanded={expanded} />
      </nav>
    </aside>
  );
};

const SidebarItem = ({
  icon,
  text,
  active,
  alert,
  children,
  subItem,
  onSelect,
}) => {
  const { expanded, onItemSelect } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    }
    if (onSelect) {
      onSelect(text);
    } else if (onItemSelect) {
      onItemSelect(text);
    }
  };
  return (
    <li className="relative">
      <div
        className={`
          flex items-center justify-center py-2 px-4 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-emerald-300 to-emerald-400"
              : "hover:bg-emerald-200"
          }
          ${subItem ? "text-sm" : ""}
        `}
        onClick={handleClick}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-emerald-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {children && (
          <ChevronDown
            className={`ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            size={16}
          />
        )}
        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-4 py-2 ml-6 bg-emerald-200 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 flex flex-col`}
          >
            <div className="flex items-center">
              {text}
              {children && <Folder className="ml-2 w-4 h-4" />}
            </div>
            {children && (
              <ul className="mt-1 pl-4">
                {React.Children.map(children, (child, index) => (
                  <li key={index} className="flex items-center py-1 text-xs">
                    {child.props.icon}
                    <span className="ml-2">{child.props.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {children && (
        <ul
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {React.Children.map(children, (child, index) =>
            React.cloneElement(child, { ...child.props, subItem: true })
          )}
        </ul>
      )}
    </li>
  );
};

export { Sidebar, SidebarItem };
