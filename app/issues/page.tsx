'use client'
import React, { Suspense, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { singleIssueSchema } from '@/lib/validation'
import { z } from 'zod'
import { fetchAllIssues, resetIssue } from '@/redux/issues'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import clsx from 'clsx'

type TSingleIssue = z.infer<typeof singleIssueSchema>

const toCapitalText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

const Page = () => {
  const { issueList, issueLoading } = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();
  const router = useRouter()

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

  const handleClick = (id: number) => {
    router.push(`/issues/${id}`)
  }

  if(issueLoading) return <div className='flex w-full justify-center'><Spinner color={"black"} size='10' /></div>

  return (
      <Suspense fallback={<Spinner color={"black"} />}>
        <div className='flex-row space-y-6'>
        <div className='flex flex-wrap gap-6'>
          {Array.isArray(issueList) && issueList.length === 0 && <p>No issues found</p>}
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
        </div>
      </div>
    </Suspense>
  )
}

export default Page