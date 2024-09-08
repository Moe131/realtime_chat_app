// helper function
export default async function redis_helper(command:string , ...args: (string|number)[]){
    const RESTResponse = await fetch(process.env.UPSTASH_REDIS_REST_URL+"/" + command,
        {
            headers : {
                Authorization : "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN
            },
            cache : "no-store"
        })  
        const data = await RESTResponse.json() 
        return data.result
}