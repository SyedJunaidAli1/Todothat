"use client";
import {
  ChevronFirst,
  ChevronLast,
  ChevronDown,
  Folder,
  CalendarFold,
  CalendarDays,
  ClipboardCheck,
  InboxIcon,
  Search,
  CirclePlus,
  Trash,
} from "lucide-react";
import React, { createContext, useContext, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./Profile";

/* ---------- Context ---------- */
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

/* ---------- Sidebar ---------- */
interface AppSidebarProps {
  projects: { id: string; name: string }[];
  onAddProject: () => void;
  onAddTask: () => void;
  onSearch: () => void;
  onDeleteProject: (e: React.MouseEvent, id: string) => void;
}

function AppSidebar({
  projects,
  onAddProject,
  onAddTask,
  onDeleteProject,
  onSearch,
}: AppSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  /* derive active label from url -------------------- */
  const activeLabel = useMemo(() => {
    if (pathname.startsWith("/projects/")) {
      const id = pathname.split("/")[2];
      return projects.find((p) => p.id === id)?.name ?? "Inbox";
    }
    const parts = pathname.split("/");
    const last = parts.at(-1) ?? "inbox";
    return last.charAt(0).toUpperCase() + last.slice(1);
  }, [pathname, projects]);

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className="h-screen">
        <nav className="h-full flex flex-col border-r shadow-sm">
          {/* Header */}
          <div className="p-10 pb-2 flex justify-between items-center">
            <h1
              className={`overflow-hidden text-xl text-emerald-200 transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            >
              Todothat
            </h1>
            <button
              onClick={() => setExpanded((c) => !c)}
              className="p-1.5 rounded-lg text-black bg-gray-50 hover:bg-gray-300"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <ul className="flex-1 px-3">
            {/* Actions */}
            <SidebarItem
              icon={<CirclePlus />}
              text="Add Task"
              onClick={onAddTask}
            />
            <SidebarItem icon={<Search />} text="Search" onClick={onSearch} />

            {/* Main sections */}
            <Link href="/inbox">
              <span className="contents">
                <SidebarItem
                  icon={<InboxIcon />}
                  text="Inbox"
                  alert
                  active={activeLabel === "Inbox"}
                />
              </span>
            </Link>

            <Link href="/today">
              <span className="contents">
                <SidebarItem
                  icon={<CalendarFold />}
                  text="Today"
                  active={activeLabel === "Today"}
                />
              </span>
            </Link>

            <Link href="/upcoming">
              <span className="contents">
                <SidebarItem
                  icon={<CalendarDays />}
                  text="Upcoming"
                  active={activeLabel === "Upcoming"}
                />
              </span>
            </Link>

            <Link href="/completed">
              <span className="contents">
                <SidebarItem
                  icon={<ClipboardCheck />}
                  text="Completed"
                  active={activeLabel === "Completed"}
                />
              </span>
            </Link>

            {/* Projects group */}
            <SidebarItem
              icon={<Folder />}
              text="My Projects"
              prefixIcon={
                <CirclePlus
                  className="w-4 h-4 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddProject();
                  }}
                />
              }
            >
              {projects.map((project) => (
                <Link key={project.id} href={`/Projects/${project.id}`}>
                  <div className="contents">
                    <SidebarItem
                      icon={<Folder className="w-4 h-4" />}
                      text={
                        <div className="flex justify-between items-center w-full">
                          <span className="flex-1 truncate">
                            {project.name}
                          </span>
                          <Trash
                            className="w-4 h-4 ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={(e) => onDeleteProject(e, project.id)}
                          />
                        </div>
                      }
                      subItem
                      active={activeLabel === project.name}
                    />
                  </div>
                </Link>
              ))}
            </SidebarItem>
          </ul>

          <Profile expanded={expanded} />
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

/* ---------- SidebarItem ---------- */
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  prefixIcon?: React.ReactNode;
}

function SidebarItem({
  icon,
  text,
  active,
  alert,
  children,
  onClick,
  prefixIcon,
}: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (children) setIsOpen(!isOpen);
    if (onClick) onClick();
  };

  return (
    <>
      <li className="relative">
        <div
          className={`
          flex items-center justify-between py-2 px-4 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${active ? "bg-gradient-to-tr from-emerald-300 to-emerald-400" : "hover:bg-emerald-200"}
        `}
          onClick={handleClick}
        >
          <div className="flex items-center">
            {icon}
            <span
              className={`overflow-hidden transition-all ${expanded ? "w-52 pl-3" : "w-0"}`}
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

          {expanded && (
            <div className="flex items-center gap-1">
              {prefixIcon && (
                <div onClick={(e) => e.stopPropagation()}>{prefixIcon}</div>
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

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-4 py-2 ml-6 bg-emerald-200 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 flex items-center`}
          >
            {icon}
            <span className="ml-2">{text}</span>
            {children && <Folder className="ml-2 w-4 h-4" />}
          </div>
        )}

        {children && (
          <ul
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement,)
            )}
          </ul>
        )}
      </li>
    </>
  );
}

export default AppSidebar;
