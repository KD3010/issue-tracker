import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
    let users;
    try {
        users = await prisma.user.findMany({
            where: {
                role: {
                    in: ["CONTRIBUTOR"]
                }
            }
        });
    } catch(error) {
        console.log(error);
        return NextResponse.json({message: "Oops! this is from our side. Sorry for the inconvinience"})
    }
    return NextResponse.json({ data: users });
}