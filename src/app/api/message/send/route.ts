import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redis_helper } from "../../friends/add/route"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"
import { pusherServer } from "@/lib/pusher"

export async function POST(req:Request){
    try {
        const {text, chatId} = await req.json()
        const session = await getServerSession(authOptions)

        if (!session){
            return new Response("Unauthorized" , {status:401})
        }
        const [userId1 , userId2] = chatId.split("--")

        if (session.user.id !== userId1 && session.user.id !== userId2){
            return new Response("Unauthorized" , {status:401})
        }

        const partnerId = userId1 === session.user.id ? userId2 : userId1
        const friendList = await redis_helper("smembers/user:"+ session.user.id + ":friends") as string[]

        const isFriend = friendList.includes(partnerId)
        if (!isFriend){
            return new Response("Unauthorized", {status:401})
        }

        const timestamp = Date.now()
        const message: Message = {
            id : nanoid(),
            senderId : session.user.id,
            receiverId: partnerId,
            text,
            timestamp
        }

        // send the message
        // send to web scoket
        pusherServer.trigger("chat__"+chatId, "messages", message)

        pusherServer.trigger("user__"+partnerId+"__chats", "new_message", {
            ...message,
            senderImg : session.user.image,
            senderName : session.user.name
            })

        // store message in database
        db.zadd("chat:"+chatId+":messages", {
            score : timestamp,
            member : JSON.stringify(message)
        })
        return new Response("Ok")

    } catch(error){
        console.log(error)
    }
}