export default function Features() {
  const items = [
    { title: "👩‍🏫 Teacher Dashboard", desc: "Manage classes, students, and reports with ease." },
    { title: "🎓 Student Profiles", desc: "Track performance, attendance, and documents." },
    { title: "🏫 School Admin Tools", desc: "Create schools, manage teachers, and streamline operations." },
  ]

  return (
    <section id="features" className="py-20 px-6 bg-slate-50 text-slate-800">
      <h2 className="text-3xl font-semibold text-center mb-12 text-slate-900">Features</h2>
      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="p-6 rounded-2xl shadow bg-white hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
