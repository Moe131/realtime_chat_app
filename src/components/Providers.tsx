"use client"

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ProviderProps {
    children : ReactNode
}

export default function Providers(props:ProviderProps){
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
             {props.children}
        </div>
    )
}