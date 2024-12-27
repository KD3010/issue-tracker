'use client'
import Markdown from 'react-markdown'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { Suspense, useEffect } from 'react';
import classNames from 'classnames'
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { deleteIssue, fetchSingleIssue, resetIssue, updateIssue } from '@/redux/issues';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { TCreateIssue, TSingleIssue } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateIssueSchema } from '@/lib/validation';
import { Textarea } from '@/components/ui/textarea';
import { DialogTitle } from '@radix-ui/react-dialog';
import Spinner from '@/components/ui/Spinner';

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
    <div className='space-y-4'>
      <h1 className='text-2xl'><span className='text-blue-500 flex font-bold'>{`${issue?.project?.name}-${issue?.id}`} <p className='text-black ml-2'>{issue.title}</p></span></h1>
      <article><b>Description</b> <p><Markdown>{issue.description}</Markdown></p></article>
      <p><b>Status</b> : <span className={classNames({
                'text-red-700': issue.status === 'OPEN',
                'text-gray-600': issue.status === 'CLOSED',
                'text-blue-800': issue.status === 'IN_PROGRESS',
      })}>{issue.status}</span></p>
      <div className='flex space-x-6'>
        <p><b>Created At </b>: {issue.createdAt?.toString()}</p>
        <p><b>Updated At </b>: {issue.updatedAt?.toString()}</p>
      </div>
      <div className='flex space-x-6'>
        <EditIssueDialog />
        <Button 
          className='bg-slate-200 flex gap-1 w-[90px] text-red-700 cursor-pointer hover:bg-slate-300 transition-all'
          onClick={handleDeleteClick}>
            <FaTrash size={16} /> Delete
        </Button>
        
      </div>
    </div>
  )
}

const EditIssueDialog = () => {
  const { issue, issueLoading}: {issue: TSingleIssue, issueLoading: boolean} = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();

  const form = useForm<TCreateIssue>({
    resolver: zodResolver(updateIssueSchema)
  })

  const onSubmit = (data: TCreateIssue) => {
    data.title = data?.title || issue?.title;
    data.description = data?.description || issue?.description;
    dispatch(updateIssue(issue?.id, data, ((response: any) => {
      response?.status === 200 ? toast.success(response?.data?.message) : toast.error(response);
     })))
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div 
          className='bg-slate-200 flex gap-1 w-[90px] text-blue-700 cursor-pointer hover:bg-slate-300 transition-allflex justify-center items-center py-2 px-1 rounded-md'>
          <MdEdit size={16} />Edit
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[50rem]'>
        <DialogHeader className='font-bold text-blue-700'>
          <DialogTitle>Edit Issue - {issue?.id}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form?.control} name='title'
              render={({field}) => (
                <FormItem>
                  <FormLabel className='font-bold text-md'>Title</FormLabel>
                  <FormControl>
                    <Input defaultValue={issue?.title} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField control={form?.control} name='description'
              render={({field}) => (
                <FormItem>
                  <FormLabel className='font-bold text-md'>Description</FormLabel>
                  <FormControl>
                    <Textarea defaultValue={issue?.description} rows={10} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={issueLoading} type='submit'>Update</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const IssueSkeleton = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <Skeleton className='w-[100%] rounded-md bg-gray-200' />
      <Skeleton className='w-[80%] rounded-md' />
      <Skeleton className='w-[100%] rounded-md' />
      <Skeleton className='w-[80%] rounded-md' />
      <Skeleton className='w-[100%] rounded-md' />
      <Skeleton className='w-[80%] rounded-md' />
    </div>
  )
}

export default Page;