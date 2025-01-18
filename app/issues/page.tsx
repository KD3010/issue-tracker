'use client'
import React, { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { singleIssueSchema } from '@/lib/validation'
import { z } from 'zod'
import { fetchAllIssues, resetIssue } from '@/redux/issues'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Spinner from '@/components/ui/Spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import clsx from 'clsx'
import Filters from '@/components/Filters'

type TSingleIssue = z.infer<typeof singleIssueSchema>

const toCapitalText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

const Page = () => {
  const { issueList, issueLoading } = useAppSelector(state => state.Issues);
  const [selectedReporters, setSelectedReporters] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchAllIssues((message: string) => {
      toast({
        variant: 'destructive',
        title: message
      })
    }))

    return () => {
      dispatch(resetIssue())
    }
  }, [])

  const handleFilterApply = () => {
    const payload = {
      reportedBy: selectedReporters.toString(),
      assignedTo: selectedAssignee.toString(),
      project: selectedProject.toString(),
      status: selectedStatus.toString()
    }

    dispatch(fetchAllIssues((message: string) => {
      toast({
        variant: 'destructive',
        title: message
      })
    }, payload))
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value;
      const payload = {
        reportedBy: selectedReporters.toString(),
        assignedTo: selectedAssignee.toString(),
        project: selectedProject.toString(),
        status: selectedStatus.toString()
      }
      if(!value?.length)
        dispatch(fetchAllIssues((message: string) => {
          toast({
            variant: 'destructive',
            title: message
          })
        }), payload);
      else {
        dispatch(fetchAllIssues((message: string) => {
          toast({
            variant: 'destructive',
            title: message
          })
        }, { ...payload, search: value }));
      }
    }
  }

  
const filters = [
  {
    id: "reportedBy",
    label: "Reporter",
    selectedItems: selectedReporters,
    setSelectedItems: setSelectedReporters,
    options: '/api/user/contributors'
  }, 
  {
    id: "assignedTo",
    label: "Assignee",
    selectedItems: selectedAssignee,
    setSelectedItems: setSelectedAssignee,
    options: '/api/user/contributors'
  },
  {
    id: "status",
    label: "Status",
    selectedItems: selectedStatus,
    setSelectedItems: setSelectedStatus,
    options: ["OPEN", "IN_PROGRESS", "CLOSED"]
  },
  {
    id: "project",
    label: "Project",
    selectedItems: selectedProject,
    setSelectedItems: setSelectedProject,
    options: 'api/projects'
  }
]

  const Loader = <div className='flex w-full justify-center'><Spinner color={"black"} size='10' /></div>

  return (
        <div className='flex-row space-y-6'>
        <div className='flex flex-wrap gap-6'>
          <Filters filters={filters} handleSearch={handleSearch} handleFilterApply={handleFilterApply} />
          {issueLoading ? Loader : (
            <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='font-bold w-60'>Id</TableHead>
                <TableHead className='font-bold w-32'>Status</TableHead>
                <TableHead className='font-bold'>Summary</TableHead>
                <TableHead className='font-bold w-60'>Reporter</TableHead>
                <TableHead className='font-bold w-60'>Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(issueList) && issueList.map((issue: TSingleIssue, index: number) => (
                <TableRow key={index}>
                  <TableCell className='text-blue-500 w-60 font-semibold'>
                    <Link href={`/issues/${issue?.id}`}>{issue?.project?.name}-{issue?.id}</Link>
                  </TableCell>
                  <TableCell className='w-32'><p className={clsx({
                    'text-red-500': issue?.status === 'OPEN',
                    'text-gray-500': issue?.status === 'CLOSED',
                    'text-blue-500': issue?.status === 'IN_PROGRESS',
                  })}>
                      {toCapitalText(issue?.status.split("_").join(" ").toString())}
                    </p></TableCell>
                  <TableCell className='truncate'>{issue?.title}</TableCell>
                  <TableCell className='w-60 text-nowrap'>{issue?.reporter?.name}</TableCell>
                  <TableCell className='w-60 text-nowrap'>{issue?.assignee?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </div>
      </div>
  )
}

export default Page