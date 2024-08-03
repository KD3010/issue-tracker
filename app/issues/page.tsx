'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { singleIssueSchema, IssueSchema } from '@/lib/validation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { z } from 'zod'
import classNames from 'classnames'
import { fetchAllIssues } from '@/redux/issues'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

type TSingleIssue = z.infer<typeof singleIssueSchema>
type TIssues = z.infer<typeof IssueSchema>

const page = () => {
  const { issueList } = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchAllIssues((message: string) => {
      toast({
        variant: 'destructive',
        title: message
      })
    }))
  }, [])

  return (
    <div className='flex-row space-y-6'>
        <Button className='justify-self-end' asChild>
            <Link href={"/issues/new"}>Create New Issue</Link>
        </Button>
        <div className='flex flex-wrap gap-6'>
          {Array.isArray(issueList) && issueList.map((issue: TSingleIssue) => (
            <Card key={issue.id} className='max-w-[250px] hover:scale-105 cursor-pointer transition-scale duration-200'>
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
  )
}

export default page