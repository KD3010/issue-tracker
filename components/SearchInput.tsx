"use client";
import React, { useState } from 'react'
import { Input } from './ui/input';

const SearchInput = ({handleSearch, placeHolder}: {
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    placeHolder?: string
}) => {

    const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Input className='focus-visible:ring-transparent' placeholder={placeHolder ?? "Search"} onKeyDown={handleSearch} value={searchValue} onChange={(e: any) => setSearchValue(e.target.value)} />
  )
}

export default SearchInput