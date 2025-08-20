export default function HowItWorks() {
  const steps = [
    { num: "1️⃣", title: "Sign Up", desc: "Create your school account in minutes." },
    { num: "2️⃣", title: "Manage", desc: "Add students, assign teachers, and track performance." },
    { num: "3️⃣", title: "Track & Report", desc: "Generate reports and maintain digital records." },
  ]

  return (
    <section id="how" className="py-20 px-6 bg-white text-slate-800">
      <h2 className="text-3xl font-semibold text-center mb-12 text-slate-900">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl mb-4">{step.num}</div>
            <h4 className="font-bold mb-2">{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
