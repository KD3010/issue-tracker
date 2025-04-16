import NextAuth, { type TokenSet } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
const bcrypt = require("bcryptjs")

const authOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
          name: "Email" as string,
          credentials: {
            username: {
              label: "Email",
              type: "email",
            },
            password: {
              label: "Password",
              type: "password"
            }
          },
          async authorize(credentials): Promise<any> {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.username
              }
            })

            if(credentials?.username === user?.email){
              const isCorrectPassword = await bcrypt.compare(credentials?.password, user?.password)
              if(!isCorrectPassword) {
                return null;
              }

              return user;
            }
            else
              return null
          }
          
        })
      ],
      callbacks: {
        session: async ({ session, token }: {
          session: any,
          token: TokenSet
        }) => {
          if (session?.user) {
            session.user.id = token.sub;
          }
          return session;
        }
      }
}



const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};