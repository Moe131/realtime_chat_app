import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { notFound } from "next/navigation"
import React , {ReactNode} from "react"
import logo from "../../assets/logo.png"
import addIcon from "../../assets/addIcon.png"
import Image, { StaticImageData } from "next/image"

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
        return notFound()

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
                                <div className="flex flex-col">
                                    <span aria-hidden="true"> {session.user.name}</span>
                                    <span className="text-xs text-zinc-400" aria-hidden="true">{session.user.email}</span>
                                </div> 
                            </div>
                        </li>

                    </ul>
                </nav>
            </div>
            {children}
        </div>
    )
}