"use client"

import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


interface FriendRequestsProps {
    sessionId: string
    requests : FriendRequest[]
}

export default function FriendRequests({sessionId, requests}:FriendRequestsProps) {
    const [friendRequests, setFriendRequests] = useState(requests)
    const router = useRouter()
    useEffect( ()=> {
        pusherClient.subscribe( "user__"+ sessionId+"__friend_requests")
        function friendRequestHandler(newRequest : FriendRequest){
            setFriendRequests( (prev)=> [...prev, newRequest])
        }
        pusherClient.bind("friend_requests", friendRequestHandler )
        return () => {
            pusherClient.unsubscribe( "user__"+ sessionId+"__friend_requests")
            pusherClient.unbind("firend_requests", friendRequestHandler )
        }
    } , [sessionId]) 

    async function acceptFriend(senderId:string,  ){
        await axios.post("/api/requests/accept", {id: senderId})
        setFriendRequests ( friendRequests.filter(
            (r) => r.senderId !== senderId
        ))
        router.refresh()
    }

    async function denyFriend(senderId:string,  ){
        await axios.post("/api/requests/deny", {id: senderId})
        setFriendRequests ( friendRequests.filter(
            (r) => r.senderId !== senderId
        ))
        router.refresh()
    }
    
    return(
        <div>
            {friendRequests.length === 0 ? 
            ( <p className='text-sm text-zinc-500'>Nothing to show here...</p>) 
            : 
            (
                friendRequests.map((req) => 
                <div key={req.senderId} className="flex gap-4 items-center">
                    <UserPlus className="text-black" />
                    <p className="font-medium text-lg">{req.senderEmail}</p>
                    <button
                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                        onClick={ () => acceptFriend(req.senderId)}
                    >
                        <Check className="font-semibold text-white w-6 h-6" />
                    </button>
                    <button
                        className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                        onClick={()=>denyFriend(req.senderId)}
                    >
                        <X className="font-semibold text-white w-6 h-6" />
                    </button>

                </div>
            ))
            } 
        </div>
    )
}