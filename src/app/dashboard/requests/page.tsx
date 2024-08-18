import { redis_helper } from "@/app/api/friends/add/route";
import FriendRequests from "@/components/FriendRequests";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Requests(){
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    // IDs of people who sent freind requests to this user
    const requestSenderIDs = (await redis_helper("smembers/user:"+ session.user.id + ":friend_requests")) as String[]
    const incomingFriendRequests = await Promise.all(
        requestSenderIDs.map( async (id) => {
        const sender = await redis_helper("get/user:"+id) as string
        const request = ({senderId: id, senderEmail : JSON.parse(sender).email} ) as FriendRequest
        return request
        }))

    return (
        <main className="max-w-lg mx-auto py-8 px-8">
            <h1 className="text-xl mb-8 boldmb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white"> Friend Requests</h1>
            <div className="flex flex-col gap-4">
                <FriendRequests sessionId={session.user.id} requests={incomingFriendRequests}/>
            </div>
        </main>
    )
}