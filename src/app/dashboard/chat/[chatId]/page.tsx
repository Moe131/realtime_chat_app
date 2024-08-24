import { redis_helper } from "@/app/api/friends/add/route"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
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
        const reversedDbMessages = dbMessages.reverse()
        return reversedDbMessages
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
    const chatPartner = await db.get("user:"+ chatPartnerId)
    const initialMessages = await getChatMessages(chatId)

    return (
        <div> {chatId}</div>
    )
}