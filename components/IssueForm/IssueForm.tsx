'use client'
import axios from 'axios';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createIssueSchema } from '@/lib/validation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { FaAngleDoubleDown, FaAngleDoubleUp, FaEquals, FaExclamationCircle } from 'react-icons/fa';
import { DialogClose } from '../ui/dialog';
import DynamicDropdown from '../DynamicDropdown';
import { getSession } from 'next-auth/react';

type TCreateIssue = z.infer<typeof createIssueSchema>

const getSessionDetails = async () => {
  const session = await getSession();
  return session?.user?.name;
}

const IssueForm = () => {
  const user = getSessionDetails();
  const [ currentProject, setCurrentProject ] = useState<any>({
    id: -1,
    name: '',
    organizationId: -1
  });
  const [ priority, setPriority ] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<any>({
    resolver: zodResolver(createIssueSchema)
  })
  const [date, setDate] = useState<{
    targetStartDate: string,
    targetEndDate: string
  }>({
    targetStartDate: '',
    targetEndDate: ''
  });

  const onSubmit = async (data: TCreateIssue) => {
    console.log(date, priority, currentProject)
    setLoading(true);
    const IssueData = {
      ...data,
      priority: priority,
      projectId: currentProject?.id,
      targetStartDate: date.targetStartDate,
      targetEndDate: date.targetEndDate
    }

    await axios.post('/api/issues', IssueData)
    .then(response => {
      toast({
        title: response.data.message,
        description: `New issue with title ${response.data.issue.title} has been created at ${Date.now()}`
      });
  }).catch(error => (
      toast({
        variant: 'destructive',
        title: 'Uh Oh! Looks like there is some issue',
        description: 'Please contact your provider to resolve the issue.'
      })
    )).finally(() => {
      setLoading(false)
    })
  }

  return (
      
      <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='border-b border-gray-400 pb-4 flex'>
          <div className='basis-1/2 pr-4'>
          <FormField 
            control={form.control}
            name='project'
            render={() => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                    <DynamicDropdown currentItem={currentProject} setCurrentItem={setCurrentProject}/>
                  
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name='priority'
            render={({field}) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger><button className='text-md border border-gray-400 px-3 py-1/2 rounded-md ml-4'>{priority || 'Minor'}</button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem {...field} onSelect={() => setPriority('Minor')}>
                        <FaAngleDoubleDown color='#008000' size={20} />
                        Minor
                      </DropdownMenuItem>
                      <DropdownMenuItem {...field} onSelect={() => setPriority('Normal')}>
                        <FaEquals size={20} color='#0000A8' />
                        Normal
                      </DropdownMenuItem>
                      <DropdownMenuItem {...field} onSelect={() => setPriority('Critical')}>
                        <FaAngleDoubleUp color='#FF4500' size={20} />
                        Critical
                      </DropdownMenuItem>
                      <DropdownMenuItem {...field} onSelect={() => setPriority('Blocker')}>
                        <FaExclamationCircle color='#8B0000' size={20} />
                        Blocker
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </FormControl>
              </FormItem>
            )}
          />
          </div>
          <div className='border-l border-gray-300 pl-4 basis-1/2'>
            <div className='flex gap-2'>
              <p><b className='font-bold'>Reporter</b> : {user}</p>
            </div>
          </div>
        </div>
        <div className='border-b border-gray-400 pb-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField 
              control={form.control}
              name='description'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <SimpleMDE {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div>
          <FormItem>
            <FormLabel>Start Date</FormLabel>
              <input name='targetStartDate' className='ml-2 border border-gray-400 px-1 py-[1px] rounded-md' type='date' onChange={(e) => setDate({...date, [e.target.name]: e.target.value})} />
          </FormItem>
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <input name="targetEndDate" className='ml-2 border border-gray-400 px-1 py-[1px] rounded-md' type='date' onChange={(e) => setDate({...date, [e.target.name]: e.target.value})} />
          </FormItem>
        </div>
        <DialogClose><Button disabled={loading} type='submit'>Create Issue {loading && <Spinner color={"black"} />}</Button></DialogClose>
      </form>
    </Form>
  )
}

export default IssueForm