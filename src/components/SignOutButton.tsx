"use client"

import React from "react"
import Button from "./ui/Button"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { Loader2, LogOut } from 'lucide-react'


interface SignOutButtonProps  {
}

export default function SignOutButton(){
    const [isSigningOut, setSigningOut] = React.useState<boolean>(false)

    return (
        <Button 
            className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
            onClick={async () => {
                try {
                    setSigningOut(true)
                    await signOut()
                } catch (error) {
                    toast.error("There was an issue in signing out.")
                } finally {
                }
            }}
        >
            <>
            {isSigningOut ?
             (<Loader2 className='animate-spin h-4 w-4' />) : 
             (<LogOut className='w-4 h-4' />)}
            </>
        </Button>
    )
}