"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const teacherMenuItems = [
  {
    title: "DASHBOARD",
    items: [
      {
        icon: "/home.png",
        label: "Dashboard",
        href: "/teacher",
      },
      {
        icon: "/calendar.png",
        label: "My Schedule",
        href: "/teacher/schedule",
      },
    ],
  },
  {
    title: "CLASSROOM",
    items: [
      {
        icon: "/class.png",
        label: "My Classes",
        href: "/teacher/classes",
      },
      {
        icon: "/student.png",
        label: "My Students",
        href: "/teacher/students",
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/teacher/lessons",
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/teacher/subjects",
      },
    ],
  },
  {
    title: "ASSESSMENTS",
    items: [
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/teacher/assignments",
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/teacher/exams",
      },
      {
        icon: "/result.png",
        label: "Grade Results",
        href: "/teacher/results",
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/teacher/attendance",
      },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/teacher/announcements",
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/teacher/messages",
      },
      {
        icon: "/parent.png",
        label: "Parent Contact",
        href: "/teacher/parents",
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/teacher/profile",
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/teacher/settings",
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
      },
    ],
  },
]

const TeacherMenu = () => {
  const pathname = usePathname()

  return (
    <div className="mt-4 text-sm">
      {teacherMenuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4 uppercase text-xs">
            {section.title}
          </span>
          {section.items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight transition-colors ${
                  isActive ? "bg-lamaSkyLight text-lamaSky font-medium" : ""
                }`}
              >
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default TeacherMenu
