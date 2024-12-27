'use client';
import React, { Suspense, useEffect, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FaPlus } from 'react-icons/fa6';
import { PiTrashSimple } from "react-icons/pi";
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoaderCircle } from 'lucide-react';

const CommentSection = ({issueId}: {
    issueId: string
}) => {
    const [commentValue, setCommentValue] = useState<string>('')
    const [comments, setComments] = useState({
        isLoading: false,
        data: []
    })
    const [pending, setPending] = useState(false)

    const fetchComments = async () => {
        setComments({...comments, isLoading: true})
        try {
            const response = await axios.get(`/api/issues/${issueId}/comments`)
            setComments({isLoading: false, data: response?.data?.comments})
        } catch (error) {
            console.error(error)
            setComments({...comments, isLoading: false})
        }
    }

    const handleAddComment = async () => {
        setPending(true)
        try {
            await axios.post(`/api/issues/${issueId}/comments`, {comment: commentValue})
            toast.success('Comment added successfully')
            setCommentValue('');
        } catch(error) {
            toast.error('Failed to add comment')
        } finally {
            setPending(false)
            fetchComments();
        }
    }

    const handleCommentDelete = async (comment: any) => {
        setComments({...comments, isLoading: true});
        try {
            // Delete comment
            await axios.delete(`/api/issues/${issueId}/comments/${comment?.id}`)
            toast.success('Comment deleted successfully')
        } catch (error) {
            toast.error('Failed to delete comment')
        } finally {
            setComments({...comments, isLoading: false})
            fetchComments();
        }
    }

    useEffect(() => {
        // Fetch comments
        fetchComments();
    }, [])

  return (
    <div className='mt-4'>
        <h2 className='font-bold text-lg'>Comments</h2>
        <div className='w-full flex flex-col gap-2'>
          <div className='mt-2 w-full'>
            <Input placeholder='Add a comment' onChange={(e) => setCommentValue(e.target.value)} className='w-full border border-gray-400' value={commentValue}/>
            <div className='flex gap-2 mt-2'>
                <Button className='flex items-center bg-blue-500 px-2 py-1 h-fit gap-1 hover:bg-blue-800 transition-all' onClick={handleAddComment}>
                    Add Comment
                    {pending ? <LoaderCircle size={16} className='animate-spin' /> : <p><FaPlus size={16} /></p>}
                </Button>
                <Button onClick={() => setCommentValue("")} className='px-2 py-1 h-fit border border-gray-500 bg-inherit hover:bg-gray-200 text-gray-600 hover:border-black hover:text-black'>Clear Text</Button>
            </div>
          </div>
        <div className='mt-2 w-full flex flex-col gap-2 py-2'>
            {comments.isLoading ? <LoaderCircle size={24} className='animate-spin' /> : comments.data.map((comment: any, i: number) => (
                <div key={i} className='border-b border-gray-400 pb-2'>
                    <p className='font-bold flex justify-between items-center '>
                        {comment?.user?.name} &nbsp;
                        <button onClick={() => handleCommentDelete(comment)} className='cursor-pointer text-red-500 border border-red-500 py-1/2 px-2 rounded-md text-sm font-normal flex items-center gap-1'>Delete <PiTrashSimple size={14} /></button>
                    </p>
                    <p className='mt-1'>{comment?.text}</p>
                </div>
            ))}
        </div>
        </div>
      </div>
  )
}

export default CommentSection