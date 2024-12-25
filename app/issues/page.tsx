'use client'
import React, { Suspense, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { singleIssueSchema } from '@/lib/validation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { z } from 'zod'
import classNames from 'classnames'
import { fetchAllIssues, resetIssue } from '@/redux/issues'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import Spinner from '@/components/ui/Spinner'

type TSingleIssue = z.infer<typeof singleIssueSchema>

const Page = () => {
  const { issueList } = useAppSelector(state => state.Issues);
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

  return (
      <Suspense fallback={<Spinner color={"black"} />}>
        <div className='flex-row space-y-6'>
        <div className='flex flex-wrap gap-6'>
          {Array.isArray(issueList) ? issueList.map((issue: TSingleIssue, index: number) => (
            <Card key={issue.id} className='max-w-[250px] hover:scale-105 transition-scale duration-200 cursor-pointer' onClick={() => handleClick(issue.id)}>
            <CardHeader className='py-2'>
              <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='mb-5'><Markdown>{`${issue.description.substring(0, 50)}${issue.description.length > 50 && '...'}`}</Markdown></CardDescription>
              <p >Status : <span className={classNames({
                'text-red-700': issue.status === 'OPEN',
                'text-gray-600': issue.status === 'CLOSED',
                'text-blue-800': issue.status === 'IN_PROGRESS',
              })}>{issue.status}</span></p>
              <p>Created at : {issue.createdAt.toString().substring(0, 10)}</p>
            </CardContent>
            </Card>
          )) : <Spinner color={"black"} />}
        </div>
      </div>
    </Suspense>
  )
}

export default Page