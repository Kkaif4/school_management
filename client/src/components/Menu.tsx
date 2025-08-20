"use client"
import Image from "next/image"
import Link from "next/link"
import { adminMenu, teacherMenu } from "@/lib/menus"

type Role = "admin" | "teacher"

export default function Menu({ role }: { role: Role }) {
  let menuData: any[] = []

  switch (role) {
    case "admin":
      menuData = adminMenu
      break
    case "teacher":
      menuData = teacherMenu
      break
    default:
      menuData = []
  }

  return (
    <div className="mt-4 text-sm">
      {menuData.map((group) => (
        <div className="flex flex-col gap-2" key={group.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {group.title}
          </span>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
            >
              <Image src={item.icon} alt={item.title} width={20} height={20} />
              <span className="hidden lg:block">{item.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}
