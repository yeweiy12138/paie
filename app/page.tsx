"use client"

import { useState, useEffect } from "react"
import Login from "@/components/login"
import PartsManagement from "@/components/parts-management"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn")
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (username: string, password: string) => {
    if (username && password) {
      setIsLoggedIn(true)
      localStorage.setItem("isLoggedIn", "true")
    } else {
      alert("请输入用户名和密码")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <PartsManagement onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}