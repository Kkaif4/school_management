"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-teal-600">EduManage</h1>
      <div className="hidden md:flex gap-6 text-slate-700 font-medium">
        <Link href="#features">Features</Link>
        <Link href="#how">How it Works</Link>
        <Link href="#demo">Demo</Link>
      </div>
      <Button className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
    </nav>
  )
}
