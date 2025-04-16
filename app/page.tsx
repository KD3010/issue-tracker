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
import SearchableInput from '@/components/SearchableInput';
import { FaXmark } from "react-icons/fa6";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [open, setOpen] = useState(false);

  const api_url = "/api/user"
  
  const handleInputChange = (e: any) => {
    setProjectName(e.target.value);
  }

  const handleCreateProject = async () => {
    setLoading(true);
    // create project logic
    const session = await getSession();
    try {
      session && await axios.post('/api/projects', { name: projectName, creator: session?.user?.email, contributors: selectedContributors.map((contributor: any) => contributor?.email) });
      toast.success('Project created successfully');
      setOpen(!open);
    } catch (error) {
      // @ts-ignore
      toast.error(error?.message);
    }
    setLoading(false)
  }

  const handleRemoveSelection = (index: number) => {
    setSelectedContributors(selectedContributors?.filter((_, i) => i !== index));
  }

  return (
    <div className='flex flex-col md:flex-row min-h-[85vh]'>
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
              {/* <Button variant="outline" className='border-gray-600'>Create an Organization</Button> */}
            </div>

            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader><DialogTitle>Create a Project</DialogTitle></DialogHeader>
              <div className='w-full flex flex-col justify-center'>
                  <Input className='border border-gray-600' placeholder='Enter project name' onChange={handleInputChange}/>
                  <SearchableInput setSelectedItems={setSelectedContributors} className='mt-4'  url={api_url}/>
                  {selectedContributors?.length > 0 && <div className='mt-2'>
                    <div className='flex flex-wrap w-full gap-2'>
                      {selectedContributors?.map((contributor: any, i: number) => (
                        <button 
                          key={i} 
                          className='px-1 border border-gray-400 flex gap-2 items-center rounded-sm hover:bg-gray-100' 
                          onClick={() => handleRemoveSelection(i)}>
                            {contributor?.name} <FaXmark size={14} color='red' />
                        </button>
                      ))}
                    </div>
                  </div>}
                  <DialogClose>
                    <Button variant="default" className='mt-4 w-full border-gray-600' onClick={handleCreateProject}>
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
