import prisma from "@/prisma/db";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(_: NextRequest, context: {params: {commentId: Number}}) {
    const {params : { commentId }} = context;

    try {
        await prisma.comment.delete({
            where: {
                id: Number(commentId)
            }
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Failed to delete comment"
        }, {
            status: 500
        });
    }

    return NextResponse.json({
        message: "Comment deleted successfully"
    });
}