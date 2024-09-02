'use client'
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { AiFillBug } from "react-icons/ai";
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

const NavBar = () => {
  const pathname = usePathname();
    const links = [
        {label: 'Dashboard', href: '/'},
        {label: 'Issues', href: '/issues'}
    ]
  return (
    <nav className='flex justify-between items-center h-14 border-b px-6'>
        <div className='flex items-center space-x-8'>
          <h1><AiFillBug /></h1>
          <ul className='flex items-center space-x-6'> 
            {links.map((link) => 
              <Link key={link.href} className={classNames({
                'text-zinc-500 hover:text-zinc-800 translate-color': true,
                'underline': link.href === pathname,
              })} href={link.href}>{link.label}
            </Link>)}
            <Button className='px-4 py-1' asChild>
              <Link href={"/issues/new"}>Create New Issue</Link>
            </Button>
          </ul>
        </div>
        <UserButton />
    </nav>
  )
}

export default NavBar