import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function POST(req:Request){
    try {
        const body = await req.json()
        const id = body.id
        const session = await getServerSession(authOptions)

        if (!session){
            return new Response("Unauthorized", {status: 401})
        }

        await db.srem("user:"+ session.user.id+":friend_requests", id)
        return new Response("Ok")


    } catch(error){
        console.log(error)
    }
}