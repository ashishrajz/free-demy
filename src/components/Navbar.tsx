import React from 'react'
import Link from 'next/link'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MoblieNavbar'
import AuthSync from "@/components/AuthSync";

import { currentUser } from '@clerk/nextjs/server'
import { Button } from './ui/button'


export const Navbar = async () => {
    


  return (
    <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-md'
>       <AuthSync />
        <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          
          

          <DesktopNavbar />
          <MobileNavbar
             />
        </div>
        </div>

    </nav>
  )
}
