import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, _: NextResponse) {
    return Response.json({message: 'Backend connected!'})
}