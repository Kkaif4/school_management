// src/lib/menus.ts

export const adminMenu = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        title: "Home",
        href: "/admin",
        visible: ["admin"],
      },
      {
        icon: "/school1.png",
        title: "Schools",
        href: "/list/schools",
        visible: ["admin"],
      },
      {
        icon: "/teacher.png",
        title: "Teachers",
        href: "/list/teachers",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        title: "Students",
        href: "/list/students",
        visible: ["admin"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        title: "Profile",
        href: "/profile",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/setting.png",
        title: "Settings",
        href: "/settings",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/logout.png",
        title: "Logout",
        href: "/logout",
        visible: ["admin", "teacher"],
      },
    ],
  },
]

export const teacherMenu = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        title: "Home",
        href: "/teacher",
        visible: ["teacher"],
      },
      {
        icon: "/class.png",
        title: "Classes",
        href: "/list/classes",
        visible: ["teacher"],
      },
      {
        icon: "/lesson.png",
        title: "Lessons",
        href: "/list/lessons",
        visible: ["teacher"],
      },
      {
        icon: "/exam.png",
        title: "Exams",
        href: "/list/exams",
        visible: ["teacher"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        title: "Profile",
        href: "/profile",
        visible: ["teacher"],
      },
      {
        icon: "/setting.png",
        title: "Settings",
        href: "/settings",
        visible: ["teacher"],
      },
      {
        icon: "/logout.png",
        title: "Logout",
        href: "/logout",
        visible: ["teacher"],
      },
    ],
  },
]
