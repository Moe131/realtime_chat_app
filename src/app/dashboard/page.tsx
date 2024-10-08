import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import { getFriendsByUserId } from "./layout";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import redis_helper from "../helper/RedisHelper";

 function chatLinkConstructor(userId1: string, userId2:string){
    const array = [userId1, userId2].sort()
    return array[0]+"--"+array[1]
}

export default async function Dashboard(){
    const session = await getServerSession(authOptions)
    if (!session) notFound()
  
    const friends = await getFriendsByUserId(session.user.id)
  
    const friendsWithLastMessage = await Promise.all(
      friends.map(async (friend) => {
        const [lastMessageRaw] = await redis_helper("zrange/chat:"+chatLinkConstructor(session.user.id, friend.id) +":messages/-1/-1")  as string[]
  
        const lastMessage = JSON.parse(lastMessageRaw) as Message
  
        return {
          ...friend,
          lastMessage,
        }
      })
    )
  
    return (
      <div className='container py-12 px-10'>
        <h1 className='text-xl mb-8 boldmb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white'>Recent chats</h1>
        {friendsWithLastMessage.length === 0 ? (
          <p className='text-sm text-zinc-500'>Nothing to show here...</p>
        ) : (
          friendsWithLastMessage.map((friend) => (
            <div
              key={friend.id}
              className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
              <div className='absolute right-4 inset-y-0 flex items-center'>
                <ChevronRight className='h-7 w-7 text-zinc-400' />
              </div>
  
              <Link
                href={`/dashboard/chat/${chatLinkConstructor(
                  session.user.id,
                  friend.id
                )}`}
                className='relative sm:flex'>
                <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                  <div className='relative h-6 w-6'>
                    <Image
                      referrerPolicy='no-referrer'
                      className='rounded-full'
                      alt={`${friend.name} profile picture`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>
  
                <div>
                  <h4 className='text-lg font-semibold'>{friend.name}</h4>
                  <p className='mt-1 max-w-md'>
                    <span className='text-zinc-400'>
                      {friend.lastMessage.senderId === session.user.id
                        ? 'You: '
                        : ''}
                    </span>
                    {friend.lastMessage.text}
                  </p>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    )
}