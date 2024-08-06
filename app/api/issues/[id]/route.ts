import { singleIssueSchema } from "@/lib/validation";
import prisma from "@/prisma/db";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, context: {params: {id: Number}}) {
    console.log(context);
    
    const {params : { id }} = context;
    
    const singleIssue = await prisma.issue.findUnique({
        where: {
            id: Number(id)
        }
    })

    const validation = singleIssueSchema.safeParse(singleIssue);

    if(!validation.success)
        return Response.json(validation.error.errors, {status: 400});

    return Response.json({message: `Issue with id ${id} fetched succesfully`, singleIssue}, {status: 200})
}

export async function DELETE(_: NextRequest, context: {params: {id: Number}}) {
    const {params: { id }} = context;

    await prisma.issue.delete({
        where: {
            id: Number(id)
        }
    })

    return Response.json({message: `Issue with ID ${id} deleted succesfully`}, {status: 200})
}