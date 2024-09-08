import { z } from "zod";
import { createIssueSchema, IssueSchema, singleIssueSchema, updateIssueSchema } from "./validation";

export type TSingleIssue = z.infer<typeof singleIssueSchema>

export type TIssueList = z.infer<typeof IssueSchema>

export type TCreateIssue = z.infer<typeof createIssueSchema | typeof updateIssueSchema>
