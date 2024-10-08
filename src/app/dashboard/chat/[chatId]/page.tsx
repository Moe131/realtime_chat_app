import redis_helper from "@/app/helper/RedisHelper"
import ChatInput from "@/components/ChatInput"
import Messages from "@/components/Messages"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound } from "next/navigation"

interface PageProps {
    params : {
        chatId : string
    }
}

async function getChatMessages(chatId: string) {
    try {
        const results : string[] = await redis_helper("zrange/chat:"+ chatId + ":messages/0/-1")
        const dbMessages = results.map((message) => JSON.parse(message) as Message)
        return dbMessages
    }catch(error){
        console.log(error)
        notFound()
    }
}

export default async function Chat({params} : PageProps){
    const {chatId} = params
    const session = await getServerSession(authOptions)

    if (!session) 
        notFound()

    const [userId1, userId2 ] = chatId.split("--")

    if (session.user.id !== userId1 && session.user.id !== userId2 )
        notFound()
    const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
    const chatPartnerRaw = await redis_helper("get/user:"+ chatPartnerId) as string 
    const chatPartner = JSON.parse(chatPartnerRaw) as User
    const initialMessages = await getChatMessages(chatId)

    return (
        <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]"> 
            <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                <div className="px-4 relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image
                                fill
                                referrerPolicy= "no-referrer"
                                src = {chatPartner.image}
                                alt = {chatPartner.name + "Profile Pcitre"}
                                className=" rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-700 mr-3 font-semibold">{chatPartner.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{chatPartner.email}</span>
                    </div>
                </div>
            </div>

            <Messages sessionId={session.user.id} partnerImg={chatPartner.image} sessionImg={session.user.image} initialMessages={initialMessages} chatId={chatId}/>
            <ChatInput chatPartner={chatPartner} chatId={chatId}/>
        </div>
    )
}