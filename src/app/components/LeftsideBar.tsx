'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import ThemeToggle from './ThemeToggle';
import { CalendarDays, CalendarFold, CirclePlus, ClipboardCheck, Inbox, Search } from 'lucide-react';

const LeftsideBar = () => {
  const [click, setClick] = useState("")
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row justify-between' >
        <h1 className='font-semibold text-2xl text-emerald-300'>TODO App</h1>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent className=' mt-2'>
        <SidebarGroup className='flex gap-4' >
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><CirclePlus />Add task</button>
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><Search />Search</button>
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><Inbox />Inbox</button>
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><CalendarFold />Today</button>
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><CalendarDays />Upcoming</button>
          <button className='flex gap-3 text-left text-md rounded-lg hover:bg-emerald-300 focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300 active:bg-emerald-300'><ClipboardCheck />Completed</button>

        </SidebarGroup >
        <SidebarGroup >
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default LeftsideBar
