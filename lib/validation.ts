import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}),
    project: z.string().optional(),
    priority: z.enum(["Minor", "Normal", "Critical", "Blocker"]).optional(),
    targetStartDate: z.string().optional(),
    targetEndDate: z.string().optional()
})

export const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])

export const updateIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255).optional(),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}).optional(),
    status: statusEnum.optional(),
    priority: z.enum(["Minor", "Normal", "Critical", "Blocker"]).optional(),
    project: z.string().optional(),
})

export const singleIssueSchema = z.object({
    id: z.number(),
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}),
    status: statusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
    priority: z.enum(["Minor", "Normal", "Critical", "Blocker"]),
    project: z.object({
        id: z.number(),
        name: z.string()
    }),
    targetStartDate: z.string().optional(),
    targetEndDate: z.string().optional()
})

export const IssueSchema = singleIssueSchema.array();

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    issues: IssueSchema
})

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string()
})