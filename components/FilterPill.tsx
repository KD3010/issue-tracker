"use client";
import React, { useState } from 'react'
import { Select, SelectContent, SelectTrigger } from './ui/select';
import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';

const FilterPill = ({id, label, selectedItems, setSelectedItems, getAvailableOptions}: {
    id: string,
    label: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void,
    getAvailableOptions: (id: string, callbackFn: Function) => void
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) {
            setSelectedItems([...selectedItems, e.target.value])
        } else {
            setSelectedItems(selectedItems.filter(item => item !== e.target.value))
        }
    }

  return (
    <Select 
        value={selectedItems.toString()} 
        onOpenChange={(open) => {
            setLoading(true);
            if(open) {
                getAvailableOptions(id, (data: []) => {
                    setOptions(data)
                    setLoading(false)
                })
            }
        }}
    >
        <SelectTrigger className='min-w-40 max-w-80 focus:ring-transparent'>
            <span className='mr-1'>{label}</span>
            {selectedItems?.length > 0 && <p className='text-blue-500 truncate'>= {selectedItems.toString()}</p>}
        </SelectTrigger>
        <SelectContent>
            {loading ? <div className='w-full flex justify-center'>
                <LoaderCircle size={20} className='animate-spin' /></div> : options?.map((option: any, index: number) => (
                <label key={index} className='flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer'>
                    <input checked={selectedItems.includes(id !== "status" ? option?.email : option)} type='checkbox' value={id === "status" ? option : option?.email } onChange={handleCheckChange} />
                    <span>{id === "status" ? option.split("-").join(" ") : option?.name}</span>   
                </label>  
            ))}
            <Button className='text-blue-500 hover:text-blue-700 decoration-transparent py-1 -ml-2' variant="link" onClick={() => setSelectedItems([])}>Clear</Button>
        </SelectContent>
    </Select>
  )
}

export default FilterPill