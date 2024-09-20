"use client"

import { useState } from "react"

export default function LoginPage() {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")

        const handleSubmit = (e) => {
            e.preventDefault()
            console.log(email, password)
        }
    
    
}