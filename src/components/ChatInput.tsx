"use client"

import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Props {
    chatPartner : User
    chatId : string
}

export default function ChatInput({chatPartner, chatId}: Props){
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>("")
    const [Loading, setLoading] = useState<boolean>(false)

    async function sendMessage(){
        if (!input) return 
        setLoading(true)
        try {
            await axios.post("/api/message/send", {text: input, chatId})
            setInput("")
            setLoading(false)
        } catch(error){
            toast.error("Something went wrong please try again later.")
        }
    }

    return (
        <div  className="border-t border-gray-200 px-2 pt-4 mb-2 sm:mb-0">
            <div className=" relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300">
                <TextareaAutosize 
                    ref={textAreaRef} 
                    onKeyDown={ (e) => {
                        if (e.key === "Enter" && !e.shiftKey){
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={ (e)=> setInput(e.target.value)}
                    placeholder={'Message '+ chatPartner.name}
                    className="px-4 py-6 block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 sm:py-4 sm:text-sm sm:leading-6"
                />
                
                <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className='flex-shrin-0'>
                        <Button disabled={Loading} onClick={sendMessage} type='submit'>SEND</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}