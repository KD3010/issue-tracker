'use client'
import Markdown from 'react-markdown'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames'
import { FaTrash } from "react-icons/fa";
import { HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { deleteIssue, fetchSingleIssue, resetIssue } from '@/redux/issues';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import Spinner from '@/components/ui/Spinner';
import IssueForm from '@/components/IssueForm/IssueForm';
import CommentSection from '@/components/CommentSection';

const formatDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  return formattedDate;

}

const Page = () => {
  const { issue, issueLoading }: {issue: any, issueLoading: boolean} = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();
  const router = useRouter();
  const params = useParams<{id: string}>()

  useEffect(() => {
    dispatch(fetchSingleIssue(params.id))

    return () => {
      dispatch(resetIssue());
    }
  }, [params.id, dispatch])

  const handleDeleteClick = () => {
    dispatch(deleteIssue(issue.id, (message: string) => {
      toast(message)
      router.push('/issues')
  }))
  }

  if(issueLoading) return <div className='flex w-full justify-center'><Spinner color={"black"} size='10' /></div>

  return (
    <div className='flex-col'>
      <div className='w-full mb-4 flex justify-between items-center'>
        <h1 className='text-2xl'><span className='text-blue-500 flex font-bold'>{`${issue?.project?.name}-${issue?.id}`} <p className='text-black ml-2'>{issue.title}</p></span></h1>
        <div className='flex space-x-2'>
            <EditIssueDialog issueId={params.id} />
            <Button 
              className='bg-red-500 flex gap-1 text-white cursor-pointer hover:bg-red-700 transition-all px-3'
              onClick={handleDeleteClick}>
                <FaTrash size={16} /> Delete
            </Button>
          </div>
      </div>
      <div className='flex border-b border-gray-400 pb-4'>
        <div className='basis-2/3 space-y-3 pr-2'>
          <article><b>Description</b> <p><Markdown>{issue.description}</Markdown></p></article>
          <p><b>Status</b> : <span className={classNames({
                    'bg-red-500': issue.status === 'OPEN',
                    'bg-gray-500': issue.status === 'CLOSED',
                    'bg-blue-500': issue.status === 'IN_PROGRESS',
                    'text-white px-2 py-1 rounded-md cursor-default': true,
          })}>{issue?.status?.charAt(0)?.toUpperCase() + issue?.status?.slice(1)?.toLowerCase()}</span></p>
          <div className='flex flex-col gap-2'>
            <div className='flex'><b>Target Start Date :</b> &nbsp; {formatDate(issue?.targetStartDate)}</div>
            <div className='flex'><b>Target End Date :</b> &nbsp; {formatDate(issue?.targetEndDate)}</div>
            <div className='flex'><b>Fix Version :</b>&nbsp; {issue?.fixVersion}</div>
          </div>
          
        </div>
        <div className='basis-1/3 pl-2'>
          <div>
            <h3 className='font-extrabold'>People</h3>
            <div className='flex space-x-4 font-light'><b className='font-semibold'>Reporter : </b>&nbsp; {issue?.reporter?.name}</div>
            <div className='flex space-x-4 font-light'><b className='font-semibold'>Assignee : </b>&nbsp; {issue?.assignee?.name}</div>
          </div>

          <div className='mt-4'>
            <h3 className='font-bold'>Dates</h3>
            <div className='flex space-x-4 font-light'><b className='font-semibold'>Created Date : </b>&nbsp; {formatDate(issue?.createdAt)}</div>
            <div className='flex space-x-4 font-light'><b className='font-semibold'>Updated Date : </b>&nbsp; {formatDate(issue?.updatedAt)}</div>
          </div>
        </div>
      </div>
      <CommentSection issueId={params.id} />
    </div>
  )
}

const EditIssueDialog = ({
  issueId
}: {
  issueId: any
}) => {
  const { issue, issueLoading }: {issue: any, issueLoading: boolean} = useAppSelector(state => state.Issues);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch<any>();

  if(issueLoading) return <Spinner color={"black"} />

  const handleModalClose = () => {
    dispatch(fetchSingleIssue(issueId, () => {
      setOpen(false);
    }));
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger onClick={() => setOpen(true)} asChild><Button className='bg-blue-500 hover:bg-blue-600 transition-all flex gap-1' variant="default"><HiPencil size={14} /> Edit</Button></DialogTrigger>
      <DialogContent className='max-w-[50%] p-6 max-h-[400px] overflow-y-auto'>
        
        <DialogHeader className='flex flex-col border-b border-gray-400'>
          <DialogTitle className='font-bold text-xl'>Edit Issue</DialogTitle>
          <p className='font-semibold -mt-2 text-blue-500'>{issue?.project?.name}-{issue?.id}</p>
        </DialogHeader>
        <div className='-mt-1'>
          <IssueForm issue={issue} handleModalClose={handleModalClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Page;