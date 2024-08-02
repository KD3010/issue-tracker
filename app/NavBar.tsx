'use client'
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { AiFillBug } from "react-icons/ai";

const NavBar = () => {
  const pathname = usePathname();
    const links = [
        {label: 'Dashboard', href: '/'},
        {label: 'Issues', href: '/issues'}
    ]
  return (
    <nav className='flex space-x-6 items-center h-14 border-b px-6'>
        <h1><AiFillBug /></h1>
        <ul className='flex space-x-6'> 
            {links.map((link) => 
              <Link key={link.href} className={classNames({
                'text-zinc-500 hover:text-zinc-800 translate-color': true,
                'underline': link.href === pathname,
              })} href={link.href}>{link.label}
            </Link>)}
        </ul>
    </nav>
  )
}

export default NavBar