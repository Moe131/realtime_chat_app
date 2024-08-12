"use client"

import Button from "@/components/ui/Button";
import React from "react";


export default function Dashboard(){

    const [loading, setLoading] = React.useState(false);

    return (
        <div>
            Dashboard
            <Button disabled={loading} title="click" onClick={() => setLoading(true)}/>
            <Button title="hello" onClick={() => setLoading(false)}/>
        </div>
    )
}