import AddFriendButton from "@/components/AddFriendButton";
import React from "react";

export default function Add(){
    return (
        <main className="container py-12 px-10">
            <h1 className="text-2xl mb-8 boldmb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white"> Add a friend</h1>
            <AddFriendButton/>
        </main>
    )
}