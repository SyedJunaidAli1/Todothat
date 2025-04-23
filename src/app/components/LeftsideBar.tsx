'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, } from '@/components/ui/sidebar'
import React, { useState } from 'react'
import ThemeToggle from './ThemeToggle';

const LeftsideBar = () => {
  const [click, setClick] = useState("")
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row justify-between' >
        <h1 className='font-semibold text-2xl text-emerald-300'>TODO App</h1>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default LeftsideBar
