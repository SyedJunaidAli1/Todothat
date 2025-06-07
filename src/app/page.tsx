// "use client";
// import { PagesTopLoader } from "nextjs-toploader/pages";
// import { Sidebar, SidebarItem } from "./components/Sidebar";
// import {
//   CalendarDays,
//   CalendarFold,
//   CirclePlus,
//   ClipboardCheck,
//   Inbox,
//   Search,
//   Folder,
// } from "lucide-react";
// import ThemeToggle from "./components/ThemeToggle";
// import InboxPage from "./components/InboxPage";
// import CompletedPage from "./components/CompletedPage";
// import UpcomingPage from "./components/UpcomingPage";
// import TodayPage from "./components/TodayPage";
// import { useState } from "react";

// export default function Home() {
//   const [activeItem, setActiveItem] = useState("");
//   const handleItemSelect = (itemtext) => {
//     setActiveItem(itemtext);
//   };
//   const renderContent = () => {
//     switch (activeItem) {
//       case "Inbox":
//         return <InboxPage />;
//       case "Today":
//         return <TodayPage />;
//       case "Upcoming":
//         return <UpcomingPage />;
//       case "Completed":
//         return <CompletedPage />;
//       default:
//         return (
//           <div className="p-4">
//             <h2 className=" text-2xl font-bont">Welcome</h2>
//             <p>Select and item to view its content.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex w-full h-screen">
//       <PagesTopLoader color="#50C878" />
//       <Sidebar onItemSelect={handleItemSelect}>
//         <SidebarItem
//           icon={<CirclePlus />}
//           text="Add Task"
//           active={activeItem === "Add Task"}
//         />
//         <SidebarItem
//           icon={<Search />}
//           text="Search"
//           active={activeItem === "Search"}
//         />
//         <SidebarItem
//           icon={<Inbox />}
//           text="Inbox"
//           alert
//           active={activeItem === "Inbox"}
//         />
//         <SidebarItem
//           icon={<CalendarFold />}
//           text="Today"
//           active={activeItem === "Today"}
//         />
//         <SidebarItem
//           icon={<CalendarDays />}
//           text="Upcoming"
//           active={activeItem === "Upcoming"}
//         />
//         <SidebarItem
//           icon={<ClipboardCheck />}
//           text="Completed"
//           active={activeItem === "Completed"}
//         />
//         <SidebarItem
//           icon={<Folder />}
//           text="My Projects"
//           active={activeItem === "My Projects"}
//         >
//           <SidebarItem
//             icon={<Folder className="w-4 h-4" />}
//             text="Project 1"
//             active={activeItem === "Project 1"}
//             onSelect={handleItemSelect}
//           />
//           <SidebarItem
//             icon={<Folder className="w-4 h-4" />}
//             text="Project 2"
//             active={activeItem === "Project 2"}
//             onSelect={handleItemSelect}
//           />
//           <SidebarItem
//             icon={<Folder className="w-4 h-4" />}
//             text="Project 3"
//             active={activeItem === "Project 3"}
//             onSelect={handleItemSelect}
//           />
//         </SidebarItem>
//       </Sidebar>
//       <div className="flex-1">
//         <header className="p-4 flex justify-end">
//           <ThemeToggle />
//         </header>
//         <main className=" p-6">{renderContent()}</main>
//       </div>
//     </div>
//   );
// }

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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "@/lib/methods/tasks";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [activeItem, setActiveItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState("Inbox");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleItemSelect = (itemText: string) => {
    if (itemText === "Add Task") {
      setIsModalOpen(true);
    } else {
      setActiveItem(itemText);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const dueDateValue = dueDate ? new Date(dueDate) : undefined;
      await createTask(title, description, dueDateValue, project);
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      setProject("Inbox");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setProject("Inbox");
    setError("");
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
            <h2 className="text-2xl font-bold">Welcome</h2>
            <p>Select an item to view its content.</p>
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
        <main className="p-6">{renderContent()}</main>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="border-2 w-full max-w-md rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              <div>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your next task?"
                  className="w-full p-2 border rounded-md text-sm resize-none"
                  required
                />
              </div>

              <div>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full p-2 border rounded-md text-sm resize-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-auto text-sm rounded-md "
                />

                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-auto p-1 text-sm border bg-gray-00 rounded-md"
                >
                  <option value="Inbox">Inbox</option>
                  <option value="Project 1">Project 1</option>
                  <option value="Project 2">Project 2</option>
                  <option value="Project 3">Project 3</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm px-4"
                >
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
