'use client';
import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FaPlus } from 'react-icons/fa6';

const CommentSection = ({issueId}: {
    issueId: string
}) => {

    const [comment, setCommentValue] = useState<string>('')

  return (
    <div className='mt-4'>
        <h2 className='font-bold text-lg'>Comments</h2>
        <div className='w-full flex gap-2'>
          <div className='mt-2 w-full'>
            <Input placeholder='Add a comment' onChange={(e) => setCommentValue(e.target.value)} className='w-full' value={comment}/>
            <Button className='flex mt-2 items-center bg-blue-500 px-2 py-1 h-fit gap-1 hover:bg-blue-800 transition-all'>Add Comment <FaPlus /></Button>
          </div>
        </div>
      </div>
  )
}

export default CommentSection