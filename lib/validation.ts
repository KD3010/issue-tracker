import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'})
})

export const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])

export const updateIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255).optional(),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}).optional(),
    statuses: statusEnum.optional()
})

export const singleIssueSchema = z.object({
    id: z.number(),
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}),
    statuses: statusEnum,
    createdAt: z.date(),
    updatedAt: z.date()
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