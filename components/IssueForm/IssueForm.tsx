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
import { Suspense, useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { FaAngleDoubleDown, FaAngleDoubleUp, FaEquals, FaExclamationCircle } from 'react-icons/fa';
import DynamicDropdown from '../DynamicDropdown';
import { getSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/hooks';

type TCreateIssue = z.infer<typeof createIssueSchema>

const getSessionDetails = async () => {
  const session = await getSession();
  return session?.user;
}

const IssueForm = ({issue, handleModalClose}: {
  issue?: any,
  handleModalClose: () => void
}) => {
  const dispatch = useAppDispatch<any>();
  const [userData, setUserData] = useState<any>();
  const [currentProject, setCurrentProject] = useState<any>({
    id: -1,
    name: '',
    organizationId: -1,
  });
  const [priority, setPriority] = useState<string>('');
  const [fixVersion, setFixVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<{
    targetStartDate: string;
    targetEndDate: string;
  }>({
    targetStartDate: '',
    targetEndDate: '',
  });
  const [contributorList, setContributorList] = useState<{
    isLoading: boolean;
    data: any[];
  }>({ isLoading: false, data: [] });
  const [selectedAssignee, setSelectedAssignee] = useState<any>();

  const form = useForm<any>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
    },
  });

  const api_url = '/api/user/contributors';

  useEffect(() => {
    getSessionDetails().then((data) => setUserData(data));
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      setContributorList((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await axios.get(api_url);
        setContributorList({ isLoading: false, data: response.data.data });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching contributors',
        });
        setContributorList({ isLoading: false, data: [] });
      }
    };
    fetchContributors();
  }, []);

  useEffect(() => {
    if (issue) {
      setCurrentProject(issue.project || { id: -1, name: '', organizationId: -1 });
      setPriority(issue.priority || '');
      setFixVersion(issue.fixVersion || '');
      setDate({
        targetStartDate: issue.targetStartDate || '',
        targetEndDate: issue.targetEndDate || '',
      });
      setSelectedAssignee(issue.assignee || null);
      setStatus(issue.status || '');
    }
  }, [issue]);

  const onSubmit = async (data: TCreateIssue) => {
    setLoading(true);
    const issueData = {
      ...data,
      priority,
      projectId: currentProject?.id,
      targetStartDate: date.targetStartDate,
      targetEndDate: date.targetEndDate,
      assignee: selectedAssignee?.email,
      fixVersion,
    };

    if(issue) {
      delete issueData.projectId;
      issueData.status = status;
      await axios.put(`/api/issues/${issue.id}`, issueData)
      .then((response) => {
        toast({
          title: response.data.message,
          description: `Issue "${response.data.issue.title}" updated successfully.`,
        });
      }).catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error updating issue',
          description: 'Please contact support for assistance.',
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      await axios
      .post('/api/issues', issueData)
      .then((response) => {
        toast({
          title: response.data.message,
          description: `Issue "${response.data.issue.title}" updated successfully.`,
        });

        dispatch({ type: 'ADD_ISSUE', payload: response.data.issue });
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Error updating issue',
          description: 'Please contact support for assistance.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
    }

    handleModalClose();
  };

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

          {issue && (
            <label className='mt-2 flex'>
              <p>Status : &nbsp;</p>
              <DropdownMenu>
                <DropdownMenuTrigger className='text-md border border-gray-400 px-3 py-1/2 rounded-md ml-1/2'>{status}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatus('OPEN')}>OPEN</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus('IN_PROGRESS')}>IN_PROGRESS</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus('CLOSED')}>CLOSED</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </label>
          )}
          </div>
          <div className='border-l border-gray-300 pl-4 basis-1/2'>
            <div className='flex gap-2'>
              <p><b className='font-bold'>Reporter</b> : {userData?.name}</p>
            </div>
            <label className='flex gap-2 items-center mt-2'>
              <p>Assignee: </p>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <input className='px-2 py-1 border border-gray-400 rounded-md' 
                  value={setSelectedAssignee?.length > 0 ? selectedAssignee?.name : ''} />
                </DropdownMenuTrigger>
                <Suspense fallback={<div>Loading...</div>}>
                <DropdownMenuContent className='w-56'>
                    {contributorList?.data?.map((contributor, i) => (
                      <DropdownMenuItem key={i} onSelect={() => setSelectedAssignee(contributor)}>
                        {contributor.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </Suspense>
              </DropdownMenu>
            </label>
            <label className='flex gap-2 items-center mt-2'>
              <p>Fix Version: </p>
              <input className='px-2 py-1 border border-gray-400 rounded-md w-24' onChange={(e: any) => setFixVersion(e.target.value)} value={fixVersion} />
            </label>
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
              <input value={date?.targetStartDate} name='targetStartDate' className='ml-2 border border-gray-400 px-1 py-[1px] rounded-md' type='date' onChange={(e) => setDate({...date, [e.target.name]: e.target.value})} />
          </FormItem>
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <input value={date?.targetEndDate} name="targetEndDate" className='ml-2 border border-gray-400 px-1 py-[1px] rounded-md' type='date' onChange={(e) => setDate({...date, [e.target.name]: e.target.value})} />
          </FormItem>
        </div>
        <Button disabled={loading} type='submit'>{issue ? 'Update Issue' : 'Create Issue'} {loading && <Spinner color={"black"} />}</Button>
      </form>
    </Form>
  )
}

export default IssueForm