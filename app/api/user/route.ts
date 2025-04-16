import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcryptjs")

export async function GET() {
    const users = await prisma.user.findMany();

    if(!users) {
        return NextResponse.json({
            message: "There's an error from our side."
        }, {status: 500})
    }

    return NextResponse.json(users, {status: 200});
}

export async function POST(req: NextRequest) {
    const {name, email, password, confirmPassword} = await req.json();

    // Validations
    // check if user already exists with the email
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    console.log(user, !!user)
    if(!!user) {
        return NextResponse.json({
            message: 'User with email already exists'
        }, { status: 400 })
    }

    // Check if password follows the requirements
    
    if(password !== confirmPassword) {
        return NextResponse.json({
            message: "Inavlid credentials, please try again!"
        }, { status: 404 })
    }

    const hashedPw = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPw
        }
    })

    if(!newUser) {
        return NextResponse.json({
            message: "Sorry, couldn't process your request, contact the administrator"
        }, { status: 500 })
    }

    return NextResponse.json({
        user: newUser
    }, { status: 201 })
}