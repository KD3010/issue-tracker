"use client";
import { Button } from '@/components/ui/button'
import Kanban from '@/public/kanban method.gif'
import { Suspense, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleInputChange = (e: any) => {
    setProjectName(e.target.value);
  }

  const handleCreateProject = async () => {
    setLoading(true);
    // create project logic
    const session = await getSession();
    try {
      session && await axios.post('/api/projects', { name: projectName, creator: session?.user?.email });
      toast.success('Project created successfully');
      setOpen(!open);
    } catch (error) {
      // @ts-ignore
      toast.error(error?.message);
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="flex basis-1/2 items-center justify-center">
        <img width={550} src={Kanban.src} alt="hero" />
      </div>
      <div className='basis-1/2 flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold'>Effortlessly Track, Manage, and Resolve Issues with Issue Tracker</h1>
        <p className='text-gray-600'>Streamline your workflow, enhance collaboration, and deliver projects on time with our powerful issue tracking solution.</p>

        <div className='flex w-full'>
          <Dialog>
            <div className='flex mt-4 flex-col md:flex-row gap-4'>
              <DialogTrigger><Button variant="default" onClick={() => setOpen(!open)}>Create a Project</Button></DialogTrigger>
              <Button variant="outline" className='border-gray-600'>Create an Organization</Button>
            </div>

            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader><DialogTitle>Create a Project</DialogTitle></DialogHeader>
              <div className='w-full flex flex-col justify-center'>
                  <Input placeholder='Enter project name' onChange={handleInputChange}/>
                  <DialogClose>
                    <Button variant="outline" className='mt-4 border-gray-600' onClick={handleCreateProject}>
                      Create {loading && <Spinner color='black' />}
                    </Button>
                  </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </div>
  )
}
