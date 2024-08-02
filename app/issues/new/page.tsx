'use client'
import Loading from './loading';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

type TCreateIssue = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<TCreateIssue>({
    resolver: zodResolver(createIssueSchema)
  })

  const onSubmit = async (data: TCreateIssue) => {
    setLoading(true);
    await axios.post('/api/issues', data)
    .then(response => {
      toast({
        title: response.data.message,
        description: `New issue with title ${response.data.issue.title} has been created at ${Date.now()}`
      });
      setTimeout(() => router.push('/api/issues'), 2000);
  }).catch(error => (
      toast({
        variant: 'destructive',
        title: 'Uh Oh! Looks like there is some issue',
        description: 'Please contact your provider to resolve the issue.'
      })
    )).finally(() => setLoading(false))
  }

  return (
      <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
                  <SimpleMDE {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type='submit'>Create Issue {loading && <Loading />}</Button>
      </form>
    </Form>
  )
}

export default NewIssuePage