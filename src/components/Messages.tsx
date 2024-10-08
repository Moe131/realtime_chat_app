"use client"
import { pusherClient } from "@/lib/pusher"
import { format } from "date-fns"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface Props {
    initialMessages : Message[]
    sessionId : string
    sessionImg : string | null | undefined
    partnerImg : string
    chatId : string
}

export default function Messages({initialMessages, sessionId, sessionImg, partnerImg, chatId}:Props){
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    useEffect( ()=> {
        pusherClient.subscribe("chat__"+chatId)
        function messageHandler(message:Message){
            setMessages( (prev)=> [...prev, message])
        }
        pusherClient.bind("messages", messageHandler)
        return () => {
            pusherClient.unsubscribe("chat__"+chatId)
            pusherClient.unbind("messages", messageHandler)
        }
    }, []) 

    function formatTimestamp(timestamp:number){
        return format(timestamp, "HH:mm")
    }

    return(
        <div id="messages" className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef} >
                {
                messages.map((message, index) => {
                    const isCurrentUser = message.senderId === sessionId
                    const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId
                    return (
                        <div 
                            className="chat-message my-2"
                            key = {message.id+"-"+message.timestamp}
    
                        >
                            <div className={"flex items-end " + (isCurrentUser ? "justify-end" : "")}>
                                <div className={"flex flex-col space-y-2 text-base max-w-xs mx-2 " + (isCurrentUser ? "order-1 items-end" : "order-2 items-start")}>
                                    <span className={"px-4 py-2 rounded-lg inline-block " + (isCurrentUser ? " bg-indigo-600 text-white " : " bg-gray-200 text-gray-900 ") + (!hasNextMessageFromSameUser && isCurrentUser? " rounded-br-none " : " ") + (!hasNextMessageFromSameUser && !isCurrentUser ? " rounded-bl-none " : " ")}>
                                        {message.text + " "}
                                        <span className="ml-2 text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
                                    </span>
                                </div>
                                <div className={"relative w-6 h-6 " + (isCurrentUser ? " order-2 " : " orders-1 ") + (hasNextMessageFromSameUser ? " invisible " : "") }>
                                    <Image 
                                        fill 
                                        src={isCurrentUser ? sessionImg || "" : partnerImg}
                                        alt="Profile Pictre"
                                        referrerPolicy ="no-referrer"
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>  
        </div>
    )
}