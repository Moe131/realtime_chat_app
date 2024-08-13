"use client"
import React, { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import Error from "next/error";

export default function AddFriendButton(){
    const [friendEmail, setFriendEmail] = React.useState<string>("")
    const [showSuccess, setShowSuccess] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")
    
    async function addFriend(e:FormEvent, email:string){
        e.preventDefault()
        try {
            await axios.post("/api/friends/add", {email : email})
            setError("")
            setShowSuccess(true)
        } catch( error:any) {
            if (error instanceof AxiosError){
                setError(error.response?.data)
                setShowSuccess(false)
            } 
            else{
                setError(error.message)
                setShowSuccess(false)
            } 
        }
    }

    return (
        <form className="" onSubmit={(e) => addFriend(e, friendEmail)}>
            <div className="mb-3">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add a friend by E-Mail</label>
                <input type="email" value={friendEmail} onChange={(e) => setFriendEmail(e.target.value)} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
            </div>
            <button type="submit" className=" text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
            <p className="mt-2 text-sm text-red-600"> {error}</p>
            {showSuccess ? (<p className="mt-2 text-sm text-green-600"> Friend Request Sent!</p>) : null }
        </form>
    )
}