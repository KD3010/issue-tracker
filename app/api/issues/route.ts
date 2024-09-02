import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/db';
import { createIssueSchema, IssueSchema } from '@/lib/validation';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    const user = await currentUser();
    const allIssues = await prisma.issue.findMany({
        where: {
            authorId: user?.emailAddresses[0].emailAddress
        }
    });

    const validation = IssueSchema.safeParse(allIssues)
    if(!validation.success)
        return NextResponse.json(validation.error.message, { status: 400 })

    return NextResponse.json({
        message: 'Succesfully fetched the issues',
        allIssues
    }, { status: 200 })
}

export async function POST(request: NextRequest) {
    const user = await currentUser();
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);

    if(!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 })
    }
    const username =  `${user?.firstName} ${user?.lastName}`
    
    const newIssue = user && await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description,
            author: username,
            authorId: user.emailAddresses[0].emailAddress
        }
    });

    if(!newIssue) {
        return NextResponse.json({
            message: "Can't create issue, plesae try later" 
        }, {status: 401})
    }

    return NextResponse.json({message: 'New issue created succesfully', issue: newIssue}, { status: 201 })
}