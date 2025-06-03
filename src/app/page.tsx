"use client";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { Sidebar, SidebarItem } from "./components/Sidebar";
import {
  CalendarDays,
  CalendarFold,
  CirclePlus,
  ClipboardCheck,
  Inbox,
  Search,
  Folder,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import InboxPage from "./components/InboxPage";
import CompletedPage from "./components/CompletedPage";
import UpcomingPage from "./components/UpcomingPage";
import TodayPage from "./components/TodayPage";
import { useState } from "react";

export default function Home() {
  const [activeItem, setActiveItem] = useState("");
  const handleItemSelect = (itemtext) => {
    setActiveItem(itemtext);
  };
  const renderContent = () => {
    switch (activeItem) {
      case "Inbox":
        return <InboxPage />;
      case "Today":
        return <TodayPage />;
      case "Upcoming":
        return <UpcomingPage />;
      case "Completed":
        return <CompletedPage />;
      default:
        return (
          <div className="p-4">
            <h2 className=" text-2xl font-bont">Welcome</h2>
            <p>Select and item to view its content.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex w-full h-screen">
      <PagesTopLoader color="#50C878" />
      <Sidebar onItemSelect={handleItemSelect}>
        <SidebarItem
          icon={<CirclePlus />}
          text="Add Task"
          active={activeItem === "Add Task"}
        />
        <SidebarItem
          icon={<Search />}
          text="Search"
          active={activeItem === "Search"}
        />
        <SidebarItem
          icon={<Inbox />}
          text="Inbox"
          alert
          active={activeItem === "Inbox"}
        />
        <SidebarItem
          icon={<CalendarFold />}
          text="Today"
          active={activeItem === "Today"}
        />
        <SidebarItem
          icon={<CalendarDays />}
          text="Upcoming"
          active={activeItem === "Upcoming"}
        />
        <SidebarItem
          icon={<ClipboardCheck />}
          text="Completed"
          active={activeItem === "Completed"}
        />
        <SidebarItem
          icon={<Folder />}
          text="My Projects"
          active={activeItem === "My Projects"}
        >
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 1"
            active={activeItem === "Project 1"}
            onSelect={handleItemSelect}
          />
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 2"
            active={activeItem === "Project 2"}
            onSelect={handleItemSelect}
          />
          <SidebarItem
            icon={<Folder className="w-4 h-4" />}
            text="Project 3"
            active={activeItem === "Project 3"}
            onSelect={handleItemSelect}
          />
        </SidebarItem>
      </Sidebar>
      <div className="flex-1">
        <header className="p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <main className=" p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
