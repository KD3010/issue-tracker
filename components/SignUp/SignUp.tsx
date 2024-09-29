'use client'
import axios from "axios";
import Link from "next/link"
import { FormEvent, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";

const defaultInputState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const SignIn = () => {

  const [formInputs, setFormInputs] = useState(defaultInputState)
  const router = useRouter()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormInputs({
      ...formInputs,
      [name]: value
    })
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData()
    Object.entries(formInputs).map((entry) => formData.append(entry[0], entry[1]));

    try {
      await axios.post("/api/user", Object.fromEntries(formData))
      toast.success("Signed Up succesfully")
    } catch(error) {
      console.error(error)
    } finally {
      router.push("/api/auth/signin")
    }
  }

  return (
    <>
      <div className='w-[100vw] h-[100vh] flex flex-col space-y-10 items-center justify-center'>
        <div className="flex flex-col items-center justify-center space-y-3">
          <h3 className='font-bold text-3xl'>Welcome! to Issue Tracker</h3>
          <p className='text-gray-500 w-[600px] text-center'>Streamline your project management with our intuitive tool, designed for seamless collaboration, task tracking, and agile workflow efficiency. Achieve more, faster, with everything in one place</p>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/api/auth/signin")} variant="outline">Sign In</Button>
            <Dialog>
              <DialogTrigger>
                <div className="bg-gray-900 text-white px-4 h-10 rounded-md flex items-center hover:bg-gray-800">Sign Up</div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[30rem]">
                <DialogHeader className="font-bold">Sign Up Here</DialogHeader>
                <div>
                  <form onSubmit={handleFormSubmit} className="flex flex-col space-y-3 items-center">
                    <input required name="name" onChange={handleInputChange} value={formInputs.name} type="text" placeholder="Full Name" className="w-[25rem] h-10 border-2 border-gray-600 rounded-md outline-none px-4"/>
                    <input required name="email" onChange={handleInputChange} value={formInputs.email} type="text" placeholder="Email" className="w-[25rem] h-10 border-2 border-gray-600 rounded-md outline-none px-4"/>
                    <input required name="password" onChange={handleInputChange} value={formInputs.password} type="password" placeholder="Password" className="w-[25rem] h-10 border-2 border-gray-600 rounded-md outline-none px-4"/>
                    <input required name="confirmPassword" onChange={handleInputChange} value={formInputs.confirmPassword} type="password" placeholder="Confirm Password" className="w-[25rem] h-10 border-2 border-gray-600 rounded-md outline-none px-4"/>
                    <input type="submit" value={"Sign Up"} className="w-[25rem] h-10 rounded-md bg-gray-600 text-white cursor-pointer active:translate-y-1 transition-all" />
                    <Link className="text-gray-400" href={"/api/auth/signin"}>Already have an account? Sign In</Link>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default SignIn