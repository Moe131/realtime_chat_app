"use client"

import Button from "@/components/ui/Button";
import React from "react";
import googleLogo from "../../assets/google.png"
import Image from "next/image";

export default function Login(){
    const [isLoading, setLoading] = React.useState(false)

    async function SignInWithGoogle(){
        setLoading(true)
        console.log("Loged ins")
    }

    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
      
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm items-center">
            <Button disabled={isLoading} onClick={()=> SignInWithGoogle()}>
                { isLoading ? null : (<Image className="w-6 mr-1" src={googleLogo} alt="Google logo"/> ) }
                GOOGLE
            </Button>
          
        </div>
      </div>
      

    )
}