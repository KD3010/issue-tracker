import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const page = () => {
  return (
    <div>
        <Button asChild>
            <Link href={"/issues/new"}>Create New Issue</Link>
        </Button>
    </div>
  )
}

export default page