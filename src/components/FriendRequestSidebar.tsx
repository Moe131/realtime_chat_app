"use client"

import Image from "next/image";
import Link from "next/link";
import friendRequestLogo from "../assets/friendRequests.png"
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

interface Props {
    unseenFriendRequests : number
    sessionId : string
}

export default function FriendRequestSidebar({unseenFriendRequests, sessionId}:Props){
    const [unseenRequests, setUnseenRequests] = useState(unseenFriendRequests)
    useEffect(()=> {
        pusherClient.subscribe( "user__"+ sessionId+"__friend_requests")
        function friendRequestHandler(){
            setUnseenRequests( (prev)=> prev+ 1)
        }
        pusherClient.bind("friend_requests", friendRequestHandler )
        return () => {
            pusherClient.unsubscribe( "user__"+ sessionId+"__friend_requests")
            pusherClient.unbind("firend_requests", friendRequestHandler )
        }
    }, [sessionId])
    
    return (
        <Link href="/dashboard/requests"
        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
    >
        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
            <Image className="w-5 h-5" src={friendRequestLogo} alt="Icon" />
        </span>
        <span className="trunctuate">Friend Requests</span>
        { unseenRequests>0 ? <span className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">{unseenRequests}</span> : null}
    </Link>
    )
}