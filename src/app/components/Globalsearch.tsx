"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/methods/tasks";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "nextjs-toploader/app";
import {
  InboxIcon,
  CalendarFold,
  CalendarDays,
  ClipboardCheck,
  CirclePlus,
  Folder,
} from "lucide-react";

const GlobalSearch = forwardRef<{ open: () => void }, {}>((_, ref) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  /* expose open() to parent via ref */
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  /* Command + K / Ctrl + K */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  /* fetch tasks for search */
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", "Inbox"],
    queryFn: () => getTasks(undefined, undefined, undefined, false),
    staleTime: 30_000,
  });

  const go = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/inbox")}>
            <InboxIcon className="mr-2 h-4 w-4" /> Go to Inbox
          </CommandItem>
          <CommandItem onSelect={() => go("/today")}>
            <CalendarFold className="mr-2 h-4 w-4" /> Go to Today
          </CommandItem>
          <CommandItem onSelect={() => go("/upcoming")}>
            <CalendarDays className="mr-2 h-4 w-4" /> Go to Upcoming
          </CommandItem>
          <CommandItem onSelect={() => go("/completed")}>
            <ClipboardCheck className="mr-2 h-4 w-4" /> Go to Completed
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go("/dashboard/?modal=add-task")}>
            <CirclePlus className="mr-2 h-4 w-4" /> Add Task
          </CommandItem>
          <CommandItem onSelect={() => go("/dashboard/?modal=add-project")}>
            <Folder className="mr-2 h-4 w-4" /> Add Project
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Tasks">
          {tasks.map((t) => (
            <CommandItem
              key={t.id}
              onSelect={() => {
                setOpen(false);
                /* open task detail / edit modal here */
                router.push(`/inbox?task=${t.id}`);
              }}
            >
              {t.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
});

export default GlobalSearch;
