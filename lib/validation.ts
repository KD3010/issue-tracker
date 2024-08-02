import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string({message: 'There must be a title for the issue'}).min(1).max(255),
    description: z.string().min(1, {message: 'There must be a short description for the issue'})
})