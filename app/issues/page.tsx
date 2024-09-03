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
import { fetchAllIssues } from '@/redux/issues'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading/Loading'

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
  }, [])

  const handleClick = (id: number) => {
    router.push(`/issues/${id}`)
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className='flex-row space-y-6'>
        <div className='flex flex-wrap gap-6'>
          {Array.isArray(issueList) && issueList.map((issue: TSingleIssue, index: number) => (
            <Card key={issue.id} className='max-w-[250px] hover:scale-105 transition-scale duration-200' onClick={() => handleClick(issue.id)}>
            <CardHeader className='h-[6rem]'>
              <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='mb-5'>{`${issue.description.substring(0, 50)}${issue.description.length > 50 && '...'}`}</CardDescription>
              <p >Status : <span className={classNames({
                'text-red-700': issue.statuses === 'OPEN',
                'text-gray-600': issue.statuses === 'CLOSED',
                'text-blue-800': issue.statuses === 'IN_PROGRESS',
              })}>{issue.statuses}</span></p>
              <p>Created at : {issue.createdAt.toString().substring(0, 10)}</p>
            </CardContent>
            </Card>
          ))}
        </div>
    </div>
    </Suspense>
  )
}

export default Page