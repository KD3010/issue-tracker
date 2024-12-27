'use client'
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { AiFillBug } from "react-icons/ai";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { signOut } from 'next-auth/react';
import { FaUserAlt } from "react-icons/fa";
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import IssueForm from '@/components/IssueForm/IssueForm';
import { useAppDispatch } from '@/lib/hooks';
import { fetchAllIssues } from '@/redux/issues';

const NavBar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch<any>();
  const [open, setOpen] = useState<boolean>(false);
  const links = [
    {label: 'Dashboard', href: '/'},
    {label: 'Issues', href: '/issues'},
    {label: 'Kanban', href: '/kanban'},
  ]

  const handleModalClose = () => {
    dispatch(fetchAllIssues(() => {
      setOpen(false)
    }))
  }

  return (
    <nav className='flex justify-between items-center h-14 border-b px-6'>
        <div className='flex items-center space-x-8'>
          <h1><AiFillBug /></h1>
          <ul className='flex items-center space-x-6'> 
            {links.map((link) => 
              <Link prefetch={false} key={link.href} className={classNames({
                'text-zinc-500 hover:text-zinc-800 translate-color': true,
                'text-zinc-900 font-semibold': link.href === pathname,
              })} href={link.href}>{link.label}
            </Link>)}
            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
              <DialogTrigger asChild><Button onClick={() => setOpen(true)} variant="default">Create</Button></DialogTrigger>
              <DialogContent className='max-w-[50%] p-6 max-h-[400px] overflow-y-auto'>
                <DialogHeader><DialogTitle>Create new issue</DialogTitle></DialogHeader>
                <div>
                  <IssueForm handleModalClose={handleModalClose} />
                </div>
              </DialogContent>
            </Dialog>
          </ul>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='bg-gray-950 rounded-[50%] h-9 w-9 flex items-center justify-center'><FaUserAlt color='white' /></DropdownMenuTrigger>
          <DropdownMenuContent className='px-2 py-2 w-[200px] cursor-pointer mr-7'>
            <DropdownMenuItem className='px-2 outline-none hover:bg-slate-100' onClick={() => signOut()}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
    </nav>
  )
}

export default NavBar