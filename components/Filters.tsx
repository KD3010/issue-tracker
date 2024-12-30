"use client";
import React from 'react'
import FilterPill from './FilterPill';
import { Button } from './ui/button';
import SearchInput from './SearchInput';
import axios from 'axios';

const Filters = ({filters, handleSearch, handleFilterApply}: {
    filters: any[],
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleFilterApply: () => void
}) => {
    
  const getAvailableOptions = async (id: string, callbackFn: Function) => {
    if(id === "reportedBy" || id === "assignedTo") {
      const res = await axios.get("/api/user/contributors");
      const users = res.data.data;
      callbackFn && callbackFn(users);
    } else if(id === "status") {
      callbackFn && callbackFn(["OPEN", "IN_PROGRESS", "CLOSED"])
    }
  }

  return (
    <div className='w-full flex justify-between items-center'>
        <div className='flex gap-2'>
            {filters?.map((filter: any, index: number) => (
            <div key={index}><FilterPill {...filter} getAvailableOptions={getAvailableOptions} /></div>
            ))}
            <Button className='bg-blue-500 hover:bg-blue-700' onClick={handleFilterApply}>Apply</Button>
        </div>
        <div>
            <SearchInput handleSearch={handleSearch} placeHolder="Search by Id, Summary" />
        </div>
    </div>
  )
}

export default Filters