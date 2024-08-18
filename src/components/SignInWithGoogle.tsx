"use client"
import { signIn } from "next-auth/react"
import React from "react"
import toast from "react-hot-toast"
import Button from "./ui/Button"
import Image from "next/image"
import googleLogo from "../assets/google.png"


export default function SignInWithGoogle(){
    const [isLoading, setLoading] = React.useState(false)

    async function SignInWithGoogle(){
        setLoading(true)
        try {
            await signIn("google")
        }
        catch (error) {
            toast.error("Something wrong")
        }
    }

return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center">
        <Button disabled={isLoading} onClick={()=> SignInWithGoogle()} className="flex w-full justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-m px-8 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            { isLoading ? null : (<Image className="w-6 mr-1" src={googleLogo} alt="Google logo"/> ) }
            GOOGLE
        </Button>
    </div>  
)
}
