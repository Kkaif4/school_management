import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-28 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
      <h1 className="text-5xl font-bold mb-6 max-w-3xl">
        Simplify School Management with EduManage
      </h1>
      <p className="text-lg mb-8 max-w-2xl">
        Manage students, teachers, and schools all in one platform. Save time, reduce paperwork, and focus on what really matters — education.
      </p>
      <Button size="lg" className="bg-white text-teal-600 hover:bg-slate-200">
        Request a Demo
      </Button>
    </section>
  )
}
