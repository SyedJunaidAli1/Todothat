'use client'
import { Sidebar, SidebarItem } from "./components/Sidebar";
import { CalendarDays, CalendarFold, CirclePlus, ClipboardCheck, Inbox, Search, Folder } from 'lucide-react';
import ThemeToggle from "./components/ThemeToggle";
import { useState } from 'react';

export default function Home() {
  const [activeItem, setActiveItem] = useState('Upcoming');

  const handleItemSelect = (itemText) => {
    setActiveItem(itemText);
  };

  return (
    <div className="flex">
      <Sidebar onItemSelect={handleItemSelect}>
        <SidebarItem icon={<CirclePlus />} text="Add Task" active={activeItem === 'Add Task'} />
        <SidebarItem icon={<Search />} text="Search" active={activeItem === 'Search'} />
        <SidebarItem icon={<Inbox />} text="Inbox" alert active={activeItem === 'Inbox'} />
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
    </div>
  );
}