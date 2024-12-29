import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/db';
import { createIssueSchema, IssueSchema } from '@/lib/validation';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
    const currentUser = await getServerSession();
    const allIssues = currentUser && await prisma.issue.findMany({
        where: {
            reporterId: currentUser?.user?.email as string 
        },
        include: {
            project: true,
            reporter: true,
            assignee: true
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
    const body = await request.json();
    const currentUser = await getServerSession();

    const validation = createIssueSchema.safeParse(body);

    if(!validation.success) {
        return NextResponse.json(validation.error.message, { status: 400 })
    }

    let data: any;
    if(body.targetStartDate && body.targetEndDate) {
        data = {
            title: body.title,
            description: body.description,
            reporterId: currentUser?.user?.email as string,
            priority: body.priority,
            projectId: body.projectId,
            targetStartDate: body.targetStartDate,
            targetEndDate: body.targetEndDate,
            assigneeId: body.assignee,
            fixVersion: body.fixVersion
        }
    } else {
        data = {
            title: body.title,
            description: body.description,
            reporterId: currentUser?.user?.email as string,
            priority: body.priority,
            projectId: body.projectId,
            assigneeId: body.assignee,
            fixVersion: body.fixVersion
        }
    }

    const newIssue = await prisma.issue.create({
        data: data
    });

    if(!newIssue) {
        return NextResponse.json({
            message: "Can't create issue, plesae try later" 
        }, {status: 401})
    }

    return NextResponse.json({message: 'New issue created succesfully', issue: newIssue}, { status: 201 })
}