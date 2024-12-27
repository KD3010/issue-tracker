import React, { Suspense, useEffect, useState } from 'react'
import axios from 'axios';
import { Input } from './ui/input';
import Spinner from './ui/Spinner';
import { FaXmark } from 'react-icons/fa6';

let originalData: any[] = [];

const SearchableInput = ({className, url, setSelectedItems}: {
    className: string,
    url: string,
    setSelectedItems: any
}) => {
    const [listVisibility, setListVisibility] = useState(false);
    const [value, setValue] = useState('');
    const [list, setList] = useState<{
        isLoading: boolean,
        data: any[]
    }>({
      isLoading: false,
      data: []
    })
    
    useEffect(() => {
        if(value.length > 0) {
            setList({isLoading: false, data: list?.data?.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase()))});
        } else {
            setList({isLoading: false, data: originalData});
        }
    }, [value])

    useEffect(() => {
        return () => {
            setList({isLoading: false, data: []});
            setValue('');
            originalData = [];
        }
    }, [])
    
    const fetchData = async () => {
      setList({...list, isLoading: true});
      setListVisibility(true);
      if(list?.data?.length > 0) 
        return;
      else {
        try {
          const response = await axios.get(url);
          setList({isLoading: false, data: response?.data?.data});
          originalData = response?.data?.data;
        } catch (error) {
          // @ts-ignore
          toast.error(error?.message);
          setList({isLoading: false, data: []});
        }
      }
    }

    const handleChange = (e: any) => {
        setValue(e.target.value)
    }
  return (
    <div className={`${className} relative`}>
        <Input className='border border-gray-600' autoComplete='off' placeholder='Select Contributors' name='searchable-input' onFocus={fetchData} value={value} onChange={handleChange} />
        <Suspense fallback={<Spinner color='black' />}>
            {listVisibility && <ul className='w-full flex flex-col max-h-24 overflow-y-scroll absolute bottom-12 border border-gray-400 bg-white rounded-md'>
                <button className='self-start p-1' onClick={() => {
                    setListVisibility(false)
                }}><FaXmark /></button>
                {list?.data?.map((item: any, index: number) => (
                    <button 
                        onClick={() => {
                            setSelectedItems((a: any[]) => !(a.filter((x: any) => x.email === item.email).length > 0) ? [...a, item] : [...a])
                        }} 
                        key={index} 
                        className='p-2 hover:bg-gray-200 transition-all px-2 py-1 cursor-pointer w-full text-start'>
                            {item.name}
                    </button>
                ))}
            </ul>}
        </Suspense>
    </div>
  )
}

export default SearchableInput