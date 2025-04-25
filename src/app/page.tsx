import { Sidebar, SidebarItem } from "./components/Sidebar";
import { CalendarDays, CalendarFold, CirclePlus, ClipboardCheck, Inbox, Search } from 'lucide-react';
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar >
        <SidebarItem icon={<CirclePlus />} text="Add Task" />
        <SidebarItem icon={<Search />} text="Search" />
        <SidebarItem icon={<Inbox />} text="Inbox" alert />
        <SidebarItem icon={<CalendarFold />} text="Today" />
        <SidebarItem icon={<CalendarDays />} text="Upcoming" active />
        <SidebarItem icon={<ClipboardCheck />} text="Completed" />
      </Sidebar>
      <ThemeToggle />
    </div>
  );
}
