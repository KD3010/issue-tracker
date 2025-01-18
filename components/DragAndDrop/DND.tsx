"use client"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import DropContainer from '../Droppable/DropContainer'
import { fetchAllIssues, updateIssue } from '@/redux/issues'
import { toast, ToastContainer } from 'react-toastify'
import DragItem from '../Draggable/DragItem'
import { TSingleIssue } from '@/lib/types'
import Loading from '../Loading/Loading'
import Filters from '../Filters'

const DND = () => {
  const { issueList, issueLoading } = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();
  const containers = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const [activeItem, setActiveItem] = useState<any>(null)
  const [parent, setParent] = useState<any>()
  const [selectedReporters, setSelectedReporters] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleFilterApply = () => {
    const payload = {
      reportedBy: selectedReporters.toString(),
      assignedTo: selectedAssignee.toString(),
      project: selectedProject.toString(),
      status: selectedStatus.toString()
    }

    dispatch(fetchAllIssues((message: string) => {}, payload))
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
        dispatch(fetchAllIssues((message: string) => {}), payload);
      else {
        dispatch(fetchAllIssues((message: string) => {}, { ...payload, search: value }));
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
    id: "project",
    label: "Project",
    selectedItems: selectedProject,
    setSelectedItems: setSelectedProject,
    options: 'api/projects'
  }
]

  useEffect(() => {
    dispatch(fetchAllIssues((message: string) => {
      message && toast.error(message);
    }))
  }, [parent])

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    //if dropped over same container
    if(over?.id.toString() === active?.data?.current?.status) {
      return;
    } else {
      setParent(over?.id)
      const updatedIssueData = {
        title: active?.data?.current?.title,
        description: active?.data?.current?.description,
        status: over?.id as "OPEN" | "IN_PROGRESS" | "CLOSED",
      }

      dispatch(updateIssue(Number(active?.id), updatedIssueData, () => {
        setParent('')
      }))
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current)
  }

  return (
    <>
    {issueLoading && <div className='absolute rounded-md w-[97%] min-h-[85vh] z-10 bg-black bg-opacity-40 flex justify-center items-center'>
      <Loading />
    </div>}
    <div className='flex flex-col gap-4 w-full'>
      <Filters filters={filters} handleSearch={handleSearch} handleFilterApply={handleFilterApply} isSearchAllowed={false} />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className='flex w-[100%] justify-between min-h-[75vh]'>
        {containers.map((containerId) => (
          <DropContainer key={containerId} id={containerId}>
            <h3 className='pb-2 border-b-2 border-solid border-gray-300'>{containerId}</h3>
            {issueList.map((issue: TSingleIssue) => (issue.status === containerId && <DragItem id={issue.id.toString()} issue={issue}>
              <DragItemContent issue={issue} />
            </DragItem>))}

            {parent === containerId && <DragItem id={activeItem.id} issue={activeItem}>
              <DragItemContent issue={activeItem} />  
            </DragItem>}
          </DropContainer>
        ))}
        </div>

        <DragOverlay>
          {activeItem && <DragItem id={"1"} issue={activeItem}>
            <DragItemContent issue={activeItem}/>  
          </DragItem>}
        </DragOverlay>
      </DndContext>
      <ToastContainer />
    </div>
    </>
  )
}

const DragItemContent = ({issue}: {
  issue: TSingleIssue
}) => {
  return (
    <div className='py-2 text-md'>
      <h1 className='font-bold'>
        <span className='text-blue-500'>{`${issue?.project?.name}-${issue.id}`}</span> : {issue.title}
      </h1>
      <p>{issue?.description?.length > 40 ? `${issue?.description?.substring(0, 40)}...` : issue?.description}</p>
    </div>
  )
}

export default DND