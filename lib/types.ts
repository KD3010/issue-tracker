import { z } from "zod";
import { createIssueSchema, IssueSchema, singleIssueSchema, updateIssueSchema, type SignupSchema, type UserSchema } from "./validation";

export type TSingleIssue = z.infer<typeof singleIssueSchema>

export type TIssueList = z.infer<typeof IssueSchema>

export type TCreateIssue = z.infer<typeof createIssueSchema | typeof updateIssueSchema>

export type TUser = z.infer<typeof UserSchema>

export type TSignupUser = z.infer<typeof SignupSchema>
