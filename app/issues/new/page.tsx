'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createIssueSchema } from '@/lib/validation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type TCreateIssue = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
  const form = useForm<TCreateIssue>({
    resolver: zodResolver(createIssueSchema)
  })

  const onSubmit = (data: TCreateIssue) => console.log(data);
  const onInvalid = (error: any) => console.log(error);

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={10} {...field}/>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type='submit'>Create Issue</Button>
      </form>
    </Form>
  )
}

export default NewIssuePage