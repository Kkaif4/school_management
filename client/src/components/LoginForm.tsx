"use client"

import { FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
  role: "admin" | "teacher"
}

export default function LoginForm({ role }: LoginFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    console.log(`Logging in as ${role}:`, { email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input
          id={`${role}-email`}
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input
          id={`${role}-password`}
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="rounded-md"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-md"
      >
        Login as {role === "admin" ? "Admin" : "Teacher"}
      </Button>
    </form>
  )
}
