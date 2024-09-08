import React, { ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { TSingleIssue } from '@/lib/types'

interface TDraggableProps {
    children: ReactNode
    id: string
    issue: TSingleIssue
}

const DragItem = (props: TDraggableProps) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
    data: props.issue
  })

  if(isDragging) {
    return <></>
  }
  
  return (
    <div 
      className='w-[100%] p-2 bg-white mt-3 border-solid border-2 border-gray-200 rounded-md'
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}>
        {props.children}
    </div>
  )
}

export default DragItem