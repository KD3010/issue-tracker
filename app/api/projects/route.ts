import prisma from "@/prisma/db";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    try {
        const projects = session?.user?.email && await prisma.project.findMany({
            where: {
                Contributors: {
                    some: {
                        user: {
                            email: session?.user?.email,
                        }
                    }
                }
            }

        });

        return NextResponse.json({
            message: "Projects fetched successfully",
            data: projects,
        })
    } catch (error) {
        return NextResponse.json({
            error: "Oops! Something went wrong",
        });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const newProject = await prisma.$transaction(async tx => {
        // Step 1: Create a new project
        const project = await tx.project.create({
            data: {
                name: body.name,
                created_byId: body.creator,
            },
        });

        await tx.contributor.createMany({
            data: body.contributors.map((contributor: string) => {
                return {
                    projectId: project.id,
                    userId: contributor,
                }
            })
        })

        return project; // Return the created project
    })

    return NextResponse.json({
        message: "Project created successfully",
        data: newProject,
    })
}