import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { db } from "@/lib/db"


export async function POST(req: Request){
    try {
        const body = await req.json()
        const email = body.email 
        const session = await getServerSession(authOptions)
    
        // If user not signed in
        if (!session){
            return new Response("Unauthorized.", {status:401})
        }
        
        const idToAdd = await redis_helper("get/user:email:"+email)
        // If entered user does not exist
        if (!idToAdd) {
            return new Response("This person does not exist.", {status: 400})
        }

        // If entered user is the current user
        if (idToAdd === session.user.id){
            return new Response("You cannot add yourself as a friend.", {status:400})
        }

        // If user has already added them
        const isAlreadyAdded = await redis_helper("sismember/user:"+idToAdd+":friend_requests/" +session.user.id)
        if (isAlreadyAdded )
            return new Response("Friend request already sent.", {status:400})
        
        // If already friends
        const isAlreadyFriends = await redis_helper("sismember/user:"+session.user.id+":friends/" + idToAdd)
        if (isAlreadyFriends )
            return new Response("Already friends with this user.", {status:400})
        
        // valid request
        db.sadd("user:" + idToAdd + ":friend_requests", session.user.id)
        return new Response("OK")

    } catch(error:any){
        console.log(error.message)
    }
}


// helper function
export async function redis_helper(command:string , ...args: (string|number)[]){
    const RESTResponse = await fetch(process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL+"/" + command,
        {
            headers : {
                Authorization : "Bearer " + process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN
            },
            cache : "no-store"
        })  
        const data = await RESTResponse.json() 
        return data.result
}
