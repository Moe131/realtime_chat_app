import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import React , {ReactNode} from "react"
import logo from "../../assets/logo.png"
import addIcon from "../../assets/addIcon.png"
import friendRequestLogo from "../../assets/friendRequests.png"
import Image, { StaticImageData } from "next/image"
import SignOutButton from "@/components/SignOutButton"
import { redis_helper } from "../api/friends/add/route"

interface LayoutProps {
    children : ReactNode
}

interface sideBarOption {
    id: number
    name :string
    href: string
    Icon: StaticImageData
}

const sideBarOptions:sideBarOption[] = [
    {
    id : 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: addIcon
    }
]

export default async function Layout ({children}: LayoutProps){
    const session = await getServerSession(authOptions)
    if (!session)
        redirect("/login")

    const unseenFriendRequests = (await redis_helper("smembers/user:"+session.user.id+":friend_requests")).length

    return (
        <div className="w-full flex h-screen">
            <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
                    <Image src={logo} alt="logo" className="h-8 w-auto text-indigo-600"/>
                    <h1 className="text-xl px-3 s:text-s"> Realtime Chat</h1>
                </Link>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                    Your Chats
                </div>

                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex1 flex-col gap-y-7">
                        <li> Chats that user have</li>
                        <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                                Overview
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1"> 
                                {sideBarOptions.map( (o) => {
                                    return (
                                        <li key={o.id}>
                                            <Link href={o.href}
                                                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                            >
                                                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                                    <Image className="w-5 h-5" src={o.Icon} alt="Icon" />
                                                </span>
                                                <span className="truncate">{o.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>

                        <li>
                            <Link href="dashboard/requests"
                                className="-mx-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            >
                                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                    <Image className="w-5 h-5" src={friendRequestLogo} alt="Icon" />
                                </span>
                                <span className="trunctuate">Friend Requests</span>
                                { unseenFriendRequests>0 ? <span className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">{unseenFriendRequests}</span> : null}
                            </Link>
                        </li>

                        <li className="-mx-6 mt-auto flex items-center">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="relative h-8 w-8 bg-gray-50">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        src = {session.user.image || ""}
                                        alt = "Profile Picture"
                                    />
                                </div>
                                <span className="sr-only">Your Profile</span>
                                <div className="flex flex-col max-w-40">
                                    <span aria-hidden="true"> {session.user.name}</span>
                                    <span className="text-ellipsis overflow-hidden ... text-xs text-zinc-400" aria-hidden="true">{session.user.email}</span>
                                </div> 
                            </div>
                            <SignOutButton />
                        </li>

                    </ul>
                </nav>
            </div>
            <aside className="max-h-screen container py-16 md:py-12 w-full">
                {children}
            </aside>
        </div>
    )
}