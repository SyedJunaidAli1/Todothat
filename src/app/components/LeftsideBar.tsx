'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, } from '@/components/ui/sidebar'
import React, { useState } from 'react'


const LeftsideBar = () => {
  const [click, setClick] = useState("")
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row justify-between' >
        <h1 className='font-semibold text-2xl'>TODO App</h1>
        <button
        onClick={(e) => console.log("clicked")}
        >
          btn
        </button>
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
