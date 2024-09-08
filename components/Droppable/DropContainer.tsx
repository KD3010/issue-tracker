import React, { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'

interface TDroppableProps {
    children: ReactNode,
    id: string
}

const DropContainer = (props: TDroppableProps) => {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id
  })

  return (
    <div 
      className={`basis-[32%] bg-slate-100 rounded-md p-4 ${isOver && 'border-dashed border-green-600 border-2'} transition-colors`} 
      ref={setNodeRef}>
        {props.children}
    </div>
  )
}

export default DropContainer