import AddFriendButton from "@/components/AddFriendButton";
import React from "react";

export default function Add(){
    return (
        <main className="max-w-sm mx-auto pt-8 px-2">
            <h1 className="text-xl pb-4 boldmb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white"> Add a friend</h1>
            <AddFriendButton/>
        </main>
    )
}