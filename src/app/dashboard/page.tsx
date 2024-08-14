import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";


export default async function Dashboard(){
    const session = await getServerSession(authOptions) 
    return (
        <div className="max-w-sm flex-col justify-center px-6 py-12 lg:px-8">
           {JSON.stringify(session)}
        </div>
    )
}