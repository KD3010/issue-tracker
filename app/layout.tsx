import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './NavBar'
import StoreProvider from './StoreProvider'
import AuthProvider from './AuthProvider'
import { getServerSession } from 'next-auth'
import SignUp from '@/components/SignUp/SignUp'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'A basic version of JIRA for collaborative development',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();
  return (
      <html lang="en">
      <body className={inter.className}>
          <StoreProvider>
            <AuthProvider>
              {session ? <>
                <NavBar />
                <main  className='p-6'>{children}</main>
              </> : <SignUp />}
            </AuthProvider>
          </StoreProvider>
          <ToastContainer stacked hideProgressBar />
      </body>
      </html>
  )
}
