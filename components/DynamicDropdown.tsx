"use client";
import React, { useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import axios from 'axios';
import { toast } from 'react-toastify';

let cachedProjectData: string[] | null = null;

const DynamicDropdown = ({currentItem, setCurrentItem}: {
    setCurrentItem: (item: any) => void,
    currentItem: any
}) => {

    const getAllProjects = async () => {
        try {
          const response = await axios.get('/api/projects');
          cachedProjectData = response?.data?.data;
        } catch (error) {
          toast.error('Uh Oh! Looks like there is some issue. Please contact your provider to resolve the issue.')
        }
    }

    useEffect(() => {
        if(cachedProjectData === null) {
            getAllProjects();
        }
    }, [])

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <button className='text-md border border-gray-400 px-3 py-1/2 rounded-md ml-4'>
            {currentItem?.name !== "" ? currentItem?.name : 'Select Project'}
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {cachedProjectData?.map((project: any, index: number) => (  
                <DropdownMenuItem key={index} onSelect={() => setCurrentItem(project)}>{project?.name}</DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DynamicDropdown