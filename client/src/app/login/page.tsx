"use client"

import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [role, setRole] = useState("admin")

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-slate-800">
            School Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <LoginForm role="admin" />
            </TabsContent>

            <TabsContent value="teacher">
              <LoginForm role="teacher" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
