import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redis_helper } from "../../friends/add/route"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"

export async function POST(req: Request){
    try {
        const body = await req.json()
        const id = body.id

        const session = await getServerSession(authOptions)
        if (!session)
            return new Response("Unauthorized", {status : 401})

        // Verify both users are not friends already
        const isAlreadyFriends = await redis_helper("sismember/user:"+session.user.id+":friends/" + id )
        if (isAlreadyFriends)
            return new Response("Already Friends", {status : 400})

        // Verify there is a friends requests to accept
        const hasFriendRequest = await  redis_helper("sismember/user:"+session.user.id+":friend_requests/" +id)
        if (! hasFriendRequest)
            return new Response("No Friend Request between users", {status : 400})

        await Promise.all ( [
            // Notfy partner of added friemd
            pusherServer.trigger("user__"+id+"__friends", "new_friend",""),
            pusherServer.trigger("user__"+session.user.id+"__friends", "new_friend",""),
            db.sadd("user:" + session.user.id + ":friends", id),
            db.sadd("user:" + id + ":friends", session.user.id),
            db.srem("user:" + session.user.id + ":friend_requests" , id)
        ])
        // Successfully added as friend

        return new Response("Ok")
        
    } catch(error){
        console.log(error)
    }
}