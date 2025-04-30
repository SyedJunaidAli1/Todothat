'use client'
import { Sidebar, SidebarItem } from "./components/Sidebar";
import { CalendarDays, CalendarFold, CirclePlus, ClipboardCheck, Inbox, Search, Folder } from 'lucide-react';
import ThemeToggle from "./components/ThemeToggle";
import InboxPage from "./components/InboxPage";
import { useState } from 'react';
import Link from "next/link";

export default function Home() {
  const [activeItem, setActiveItem] = useState('');
  const handleItemSelect = (itemText) => {
    setActiveItem(itemText);
  };

  return (
    <div className="flex">
      <Sidebar onItemSelect={handleItemSelect}>
        <SidebarItem icon={<CirclePlus />} text="Add Task" active={activeItem === 'Add Task'} />
        <SidebarItem icon={<Search />} text="Search" active={activeItem === 'Search'} />

        <Link href="./components/InboxPage">
          <SidebarItem icon={<Inbox />} text="Inbox" alert active={activeItem === 'Inbox'} />
        </Link>


        <SidebarItem icon={<CalendarFold />} text="Today" active={activeItem === 'Today'} />
        <SidebarItem icon={<CalendarDays />} text="Upcoming" active={activeItem === 'Upcoming'} />
        <SidebarItem icon={<ClipboardCheck />} text="Completed" active={activeItem === 'Completed'} />
        <SidebarItem icon={<Folder />} text="My Projects" active={activeItem === 'My Projects'}>
          <SidebarItem icon={<Folder className="w-4 h-4" />} text="Project 1" active={activeItem === 'Project 1'} onSelect={handleItemSelect} />
          <SidebarItem icon={<Folder className="w-4 h-4" />} text="Project 2" active={activeItem === 'Project 2'} onSelect={handleItemSelect} />
          <SidebarItem icon={<Folder className="w-4 h-4" />} text="Project 3" active={activeItem === 'Project 3'} onSelect={handleItemSelect} />
        </SidebarItem>
      </Sidebar>
      <ThemeToggle />
      <InboxPage />
    </div>
  );
}