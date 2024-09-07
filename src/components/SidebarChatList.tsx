"use client"
import { pusherClient } from "@/lib/pusher"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import UnseenChatToast from "./UnseenChatToast"

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

    useEffect(()=> {
        pusherClient.subscribe("user__"+ sessionId + "__chats")
        pusherClient.subscribe("users__"+sessionId+"__friends")

        function chatHandler(newChat:any){
            const shouldNotify = pathname !== "/dashboard/chat/"+ chatLinkConstructor(sessionId, newChat.senderId)
            if (shouldNotify) {
                toast.custom((t) => (
                    <UnseenChatToast
                      t={t}
                      sessionId={sessionId}
                      senderId={newChat.senderId}
                      senderImg={newChat.senderImg}
                      senderMessage={newChat.text}
                      senderName={newChat.senderName}
                    />
                  ))
                  setUnseenMessages((prev) => [...prev, newChat])
                }
            else
                return
        }

        function newFriendHandler(){
           router.refresh()
        }
        pusherClient.bind("new_message", chatHandler)
        pusherClient.bind("new_friend", newFriendHandler)

        return () => {
            pusherClient.unsubscribe("user__"+ sessionId + "__chats")
            pusherClient.unsubscribe("users__"+sessionId+"__friends")
        }
    }, [pathname, router, sessionId])

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