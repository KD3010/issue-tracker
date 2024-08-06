'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteIssue, fetchSingleIssue } from '@/redux/issues';
import React, { useEffect } from 'react';
import classNames from 'classnames'
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = ({params}: {params : {id: String}}) => {
  const { issue }: {issue: any} = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchSingleIssue(params.id, (message: string) => {
      toast.error(message);
    }))
  }, [])

  const handleDeleteClick = () => {
    dispatch(deleteIssue(issue.id, (message: string) => {
      toast.success(message);
      router.push('/issues')
  }))
  }

  return (
    <div className='space-y-4'>
      <h1><b>Title</b> <p>{issue.title}</p></h1>
      <article><b>Description</b> <p>{issue.description}</p></article>
      <p><b>Status</b> : <span className={classNames({
                'text-red-700': issue.statuses === 'OPEN',
                'text-gray-600': issue.statuses === 'CLOSED',
                'text-blue-800': issue.statuses === 'IN_PROGRESS',
      })}>{issue.statuses}</span></p>
      <div className='flex space-x-6'>
        <p><b>Created At </b>: {issue.createdAt}</p>
        <p><b>Updated At </b>: {issue.updatedAt}</p>
      </div>
      <div className='flex space-x-6'>
        <Button 
          onClick={() => toast.success('Should see toast')}
          className='bg-slate-200 flex gap-1 w-[90px] text-blue-700 cursor-pointer hover:bg-slate-300 transition-all'>
            <MdEdit size={16} />Edit
        </Button>
        <Button 
          className='bg-slate-200 flex gap-1 w-[90px] text-red-700 cursor-pointer hover:bg-slate-300 transition-all'
          onClick={handleDeleteClick}>
            <FaTrash size={16} /> Delete
        </Button>
        
      </div>
      <ToastContainer stacked />
    </div>
  )
}

export default Page;