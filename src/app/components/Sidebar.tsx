"use client";
import { ChevronFirst, ChevronLast, ChevronDown, Folder } from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import Profile from "./Profile";

const SidebarContext = createContext<{
  expanded: boolean;
  onItemSelect?: (text: string) => void;
}>({ expanded: true });

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  children?: React.ReactNode;
  subItem?: boolean;
  onSelect?: (text: string) => void;
  prefixIcon?: React.ReactNode;
}

const Sidebar = ({
  children,
  onItemSelect,
}: {
  children: React.ReactNode;
  onItemSelect?: (text: string) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r shadow-sm">
        <div className="p-10 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden text-xl text-emerald-200 transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Todothat
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
  prefixIcon,
}: SidebarItemProps) => {
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
          flex items-center justify-between py-2 px-4 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-emerald-300 to-emerald-400"
              : "hover:bg-emerald-200"
          }
          ${subItem ? "text-sm" : ""}
        `}
        onClick={handleClick}
      >
        {/* Left side: icon + label */}
        <div className="flex items-center m-auto">
          {icon}
          <span
            className={`overflow-hidden transition-all ${
              expanded ? "w-52 pl-3" : "w-0"
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
        </div>

        {/* Right side: prefixIcon + chevron */}
        {expanded && (
          <div className="flex items-center gap-1">
            {prefixIcon && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelect) onSelect(text);
                  else if (onItemSelect) onItemSelect(text);
                }}
                className="hover:text-emerald-700"
              >
                {prefixIcon}
              </div>
            )}
            {children && (
              <ChevronDown
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                size={16}
              />
            )}
          </div>
        )}
      </div>

      {/* Tooltip when collapsed */}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-4 py-2 ml-6 bg-emerald-200 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 flex items-center justify-center`}
        >
          {icon}
          <span className="ml-2">{text}</span>
          {children && <Folder className="ml-2 w-4 h-4" />}
        </div>
      )}

      {/* Sub-items */}
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
