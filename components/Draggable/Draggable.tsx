import React, { ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { TSingleIssue } from '@/lib/types'

interface TDraggableProps {
    children: ReactNode
    id: string
    issue: TSingleIssue
}

const Draggable = (props: TDraggableProps) => {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
    data: props.issue
  })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 1000px)`
  } : undefined
  return (
    <div 
      className='w-[100%] p-2 bg-transparent'
      ref={setNodeRef} 
      {...attributes} 
      {...listeners}>
        {props.children}
    </div>
  )
}

export default Draggable