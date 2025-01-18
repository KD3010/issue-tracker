import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/db';
import { createIssueSchema, IssueSchema } from '@/lib/validation';
import { getServerSession } from 'next-auth';
import type { Status } from '@prisma/client';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams;
    console.log(query.get("project"))
    const reportedBy = query.get("reportedBy")?.split(",") || [];
    const assignedTo = query.get("assignedTo")?.split(",") || [];
    const project = query.get("project")?.split(",") || [];
    const status = query.get("status")?.split(",") || [];

    const reportedByQuery = reportedBy?.length > 0 ? { reporterId : { in: reportedBy } } : {};
    const assignedToQuery = assignedTo?.length > 0 ? { assigneeId: { in: assignedTo } } : {};
    const projectQuery = project?.length > 0 ? { project : { name: { in : project } } } : {};
    const statusQuery = status?.length > 0 ? { status : { in: status as Status[] } } : {};

    const currentUser = await getServerSession();
    const allIssues = currentUser && await prisma.issue.findMany({
        where: {
            ...reportedByQuery,
            ...assignedToQuery,
            ...statusQuery,
            ...projectQuery,
            OR: [
                {
                    title: {
                        contains: query.get('search') || '',
                        mode: "insensitive"
                    }
                },
                {
                    OR: [
                        {
                            id: {
                                equals: query.get('search')?.split("-")[1] ? parseInt(query.get('search')?.split("-")[1] ?? '') : undefined
                            }
                        },
                        {
                            project: {
                                name: {
                                    contains: query.get('search')?.split("-")[0] ?? '',
                                    mode: 'insensitive'
                                }
                            }
                        }
                    ]
                }
            ]
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