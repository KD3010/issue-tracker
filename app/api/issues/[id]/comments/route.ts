import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, context: {params: {id: number}}) {
    
    const {params : { id }} = context;
    
    const comments = await prisma.comment.findMany({
        where: {
            issueId: Number(id)
        },
        include : {
            user: true,
            attachmets: true
        }
    })

    return NextResponse.json({
        message: "Comments fetched successfully",
        comments
    });
}

export async function POST(req: NextRequest, context: {params: {id: number}}) {
    const {params : { id }} = context;
    const { comment } = await req.json();

    const session = await getServerSession();

    const newComment = await prisma.comment.create({
        data: {
            issueId: Number(id),
            text: comment,
            userId: session?.user?.email as string
        }
    })

    return NextResponse.json({
        message: "Comment added successfully",
        newComment
    });
}
