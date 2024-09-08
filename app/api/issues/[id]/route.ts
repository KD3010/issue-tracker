import { createIssueSchema, singleIssueSchema } from "@/lib/validation";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, context: {params: {id: Number}}) {
    
    const {params : { id }} = context;
    
    const singleIssue = await prisma.issue.findUnique({
        where: {
            id: Number(id)
        }
    })

    const validation = singleIssueSchema.safeParse(singleIssue);

    if(!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400});

    return NextResponse.json({message: `Issue with id ${id} fetched succesfully`, singleIssue}, {status: 200})
}

export async function DELETE(_: NextRequest, context: {params: {id: Number}}) {
    const {params: { id }} = context;

    await prisma.issue.delete({
        where: {
            id: Number(id)
        }
    })

    return NextResponse.json({message: `Issue with ID ${id} deleted succesfully`}, {status: 200})
}

export async function PUT(req: NextRequest, context: {params: {id: Number}}) {
    const {params: { id }} = context;
    const body = await req.json();

    const validation = createIssueSchema.safeParse(body)

    if(!validation.success)
        return NextResponse.json(validation?.error?.errors, {status: 400})
    
    const updatedIssue = await prisma.issue.update({
        where: {id: Number(id)},
        data: body
    })

    return NextResponse.json({message: 'Issue updated succesfully', issue: updatedIssue}, {status: 200})
}