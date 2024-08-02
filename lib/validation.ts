import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'})
})

export const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "CLOSED"])

export const singleIssueSchema = z.object({
    id: z.number(),
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'}),
    statuses: statusEnum,
    createdAt: z.date(),
    updatedAt: z.date()
})

export const IssueSchema = singleIssueSchema.array();