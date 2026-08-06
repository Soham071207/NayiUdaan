export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            NayiUdaan AI
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            AI-powered career comeback platform for women.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            This frontend scaffold is prepared for resume intake, skill analysis, roadmap generation, returnship discovery, and interview coaching.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            "Resume Upload & Parsing",
            "Career Gap Detection",
            "AI Career Recovery Roadmap",
            "Career Comeback Score",
            "Returnship Discovery",
            "AI Interview Coach"
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur"
            >
              <p className="text-sm font-medium text-slate-200">{feature}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
