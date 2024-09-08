'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteIssue, fetchSingleIssue, updateIssue } from '@/redux/issues';
import React, { Suspense, useEffect, useState } from 'react';
import classNames from 'classnames'
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { TCreateIssue } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/lib/validation';
import { Skeleton } from "@/components/ui/skeleton"

const Page = () => {
  const { issue }: {issue: any} = useAppSelector(state => state.Issues);
  const form = useForm<TCreateIssue>({
    resolver: zodResolver(createIssueSchema)
  })
  const [defaultValues, setDefaultValues] = useState<TCreateIssue>({
    title: issue.title,
    description: issue.description
  })
  const params = useParams<{id: string}>();
  
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useAppDispatch<any>();
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchSingleIssue(params.id, (message: string) => {
      toast.error(message);
    }))
  }, [isEdit, dispatch, params.id])

  const handleDeleteClick = () => {
    dispatch(deleteIssue(issue.id, (message: string) => {
      toast.success(message);
      router.push('/issues')
  }))
  }

  const onSubmit = (data: TCreateIssue) => {
    dispatch(updateIssue(issue.id, data, (response: any) => {
      response.status === 200 ? toast.success(response.message) : toast.error(response.message)
      setIsEdit(false);
  }))
  }

  if(isEdit) {
    return (
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            defaultValue={defaultValues.title}
            control={form.control}
            name='title'
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
            />
            <FormField 
            defaultValue={defaultValues.description}
            control={form.control}
            name='description'
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='space-x-4'>
            <Button type='submit' className='px-5'>Update</Button>
          </div>
        </form>
        <ToastContainer />
      </Form>
    )
  }

  return (
    <Suspense fallback={<IssueSkeleton />}>
      <div className='space-y-4'>
      <h1><span className='text-blue-500 font-bold'>{`Issue-${issue.id}`}</span> <p>{issue.title}</p></h1>
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
          onClick={() => setIsEdit(true)}
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
    </Suspense>
  )
}

const IssueSkeleton = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <Skeleton className='w-[100%] rounded-md' />
      <Skeleton className='w-[80%] rounded-md' />
      <Skeleton className='w-[100%] rounded-md' />
      <Skeleton className='w-[80%] rounded-md' />
      <Skeleton className='w-[100%] rounded-md' />
      <Skeleton className='w-[80%] rounded-md' />
    </div>
  )
}

export default Page;