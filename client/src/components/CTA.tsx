import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section id="demo" className="py-20 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white text-center">
      <h2 className="text-3xl font-semibold mb-6">Ready to Transform School Management?</h2>
      <Button size="lg" className="bg-white text-teal-600 hover:bg-slate-200">
        Get Started Today
      </Button>
    </section>
  )
}
