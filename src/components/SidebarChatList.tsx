"use client"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface PageProps {
    friends : User[]
    sessionId : string
}

export function chatLinkConstructor(userId1: string, userId2:string){
    const array = [userId1, userId2].sort()
    return array[0]+"--"+array[1]
}

export default function SidebarChatList( {friends, sessionId}: PageProps){
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

    useEffect( ()=> {
        if (pathname?.includes("chat")){
            setUnseenMessages((prev)=> {
                return prev?.filter((msg)=>!pathname.includes(msg.senderId))
            })
        }
    }, [pathname])

    return (
        <ul role="list" className="max-h-[25-rem] overflow-y-auto -mx-2 space-y-1">
            {friends.sort().map((friend) => { 
                const unseenMessagesCount = unseenMessages.filter((unseenMsg)=>{
                    return unseenMsg.senderId === friend.id
                }).length
                return ( 
                    <li key={friend.id}> 
                        <a
                            href={"/dashboard/chat/" + chatLinkConstructor(sessionId, friend.id)}
                            className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        >
                            <span className="relative h-6 w-6">
                                <Image fill className="rounded-full" src={friend.image} alt="Icon" />
                            </span>
                            {friend.name}
                            {unseenMessagesCount>0 ?
                            <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">{unseenMessagesCount}</div>
                            : null
                            }
                        </a>
                    </li> 
                    )
                } 
            ) 
            }
        </ul>
    )
}