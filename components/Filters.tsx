"use client";
import React, { useRef } from 'react'
import FilterPill from './FilterPill';
import { Button } from './ui/button';
import SearchInput from './SearchInput';
import axios from 'axios';

const Filters = ({filters, handleSearch, handleFilterApply, isSearchAllowed = true}: {
    filters: any[],
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    handleFilterApply: () => void
    isSearchAllowed?: boolean
}) => {

  const filterData = useRef({id: "", data: []})
    
  const getAvailableOptions = async (id: string, callbackFn: Function) => {
    const selectedFilter = filters.filter(filter => filter.id === id);
    if(selectedFilter[0].id === filterData.current.id) {
      callbackFn && callbackFn(filterData.current.data);
      return;
    }

    if(selectedFilter.length) {
      const { options } = selectedFilter[0];
      if(options && Array.isArray(options)) {
        callbackFn && callbackFn(options)
        // @ts-ignore
        filterData.current = {...filterData.current, data: options}
      } else {
        const res = await axios.get(options);
        filterData.current = {...filterData.current, data: res.data.data}
        callbackFn && callbackFn(res.data.data)
      }
    }

    filterData.current = {...filterData.current, id: selectedFilter[0].id}
  }

  return (
    <div className='w-full flex justify-between items-center'>
        <div className='flex gap-2'>
            {filters?.map((filter: any, index: number) => (
            <div key={index}><FilterPill {...filter} getAvailableOptions={getAvailableOptions} /></div>
            ))}
            <Button className='bg-blue-500 hover:bg-blue-700' onClick={handleFilterApply}>Apply</Button>
        </div>
        {isSearchAllowed ? <div>
            <SearchInput handleSearch={handleSearch} placeHolder="Search by Id, Summary" />
        </div> : <></>}
    </div>
  )
}

export default Filters