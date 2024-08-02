import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string().min(1, {
        message: 'Issue title must be atleast 1 Character'
    }).max(255),
    description: z.string()
})