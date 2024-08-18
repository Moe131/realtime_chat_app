import { Check, UserPlus, X } from "lucide-react";
import React from "react";


interface FriendRequestsProps {
    sessionId: string
    requests : FriendRequest[]
}

export default function FriendRequests({sessionId, requests}:FriendRequestsProps) {
    return(
        <div>
            {requests.length === 0 ? 
            ( <p className='text-sm text-zinc-500'>Nothing to show here...</p>) 
            : 
            (
            requests.map((req) => 
                <div key={req.senderId} className="flex gap-4 items-center">
                    <UserPlus className="text-black" />
                    <p className="font-medium text-lg">{req.senderEmail}</p>
                    <button
                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                    >
                        <Check className="font-semibold text-white w-6 h-6" />
                    </button>
                    <button
                        className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                    >
                        <X className="font-semibold text-white w-6 h-6" />
                    </button>

                </div>
            ))
            } 
        </div>
    )
}