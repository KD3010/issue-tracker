"use client"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { DndContext, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'
import DropContainer from '../Droppable/DropContainer'
import { fetchAllIssues } from '@/redux/issues'
import { UnknownAction } from '@reduxjs/toolkit'
import { toast, ToastContainer } from 'react-toastify'
import DragItem from '../Draggable/DragItem'
import { TSingleIssue } from '@/lib/types'

const DND = () => {
  const {issueList} = useAppSelector(state => state.Issues);
  const dispatch = useAppDispatch<any>();
  const containers = ["OPEN", " IN_PROGRESS", "CLOSED"];
  const [activeItem, setActiveItem] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchAllIssues((message: string) => {
      toast.error(message)
    }))
  }, [dispatch])

  const handleDragEnd = () => {}

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current)
  }
  const handleDragMove = () => {}

  return (
    <>
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className='flex w-[100%] justify-between min-h-[85vh]'>
      {containers.map((containerId) => (
        <DropContainer key={containerId} id={containerId}>
          <h3 className='pb-2 border-b-2 border-solid border-gray-300'>{containerId}</h3>
          {issueList.map((issue: TSingleIssue) => (issue.statuses === containerId && <DragItem id={issue.id.toString()} issue={issue}>
            <DragItemContent issue={issue} />
          </DragItem>))}
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
    </>
  )
}

const DragItemContent = ({issue}: {
  issue: TSingleIssue
}) => {
  return (
    <div className='h-[60px]'>
      <h1 className='text-lg font-bold'>
        <span className='text-blue-500'>{`Issue-${issue.id}`}</span> : {issue.title}
        </h1>
      <p>{issue.description.substring(0, 50) + "..."}</p>
    </div>
  )
}

export default DND