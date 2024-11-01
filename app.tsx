"use client"

import { useState, useEffect } from "react"
import Login from "./login"
import PartsManagement from "./parts-management"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 检查本地存储中是否有登录状态
    const storedLoginStatus = localStorage.getItem("isLoggedIn")
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (username: string, password: string) => {
    // 这里应该实现实际的登录逻辑，比如调用API验证用户凭据
    // 为了演示，我们只检查用户名和密码是否非空
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