import Link from "next/link";

const Page = () => {
  return (
    <>
      <div>
        <section className="min-h-[75vh] w-full mx-auto max-w-[700px] mt-12 px-4 sm:px-6 py-16">
          <main className="flex flex-col items-start justify-center gap-8">
            <header className="w-full">
              <h1 className="text-3xl sm:text-4xl font-bold">About Todothat</h1>
              <p className="mt-2 text-sm">
                A lightweight task manager to help you organize, prioritize and
                get things done — with privacy and simplicity in mind.
              </p>
            </header>

            <div>
              <h2 className="text-lg font-medium">What this app does</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                Todothat helps you capture tasks quickly, group them by project,
                and focus on what matters. Create tasks, set due dates, and
                receive gentle reminders so nothing slips through the cracks.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Design & Principles</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                Minimal UI, fast performance, and predictable behavior. We
                prefer small, incremental features over large rewrites — the
                goal is a reliable tool you enjoy using every day.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Support & Roadmap</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                The app is actively maintained. New features are prioritized by
                user feedback and real-world usage. If you find a bug or have a
                feature request, please open an issue on the GitHub repo.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Contact</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                For support or partnership inquiries, email{" "}
                <Link
                  href="syedjunaidali790@gmail.com"
                  className="text-emerald-400 hover:underline"
                >
                  syedjunaidali790@gmail.com
                </Link>
                . You can also reach the maintainer on GitHub:
              </p>

              <p className="mt-3">
                <Link
                  href="https://github.com/SyedJunaidAli1"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-medium"
                >
                  SyedJunaidAli1
                </Link>
              </p>
            </div>

            <div className="w-full h-[1px] bg-neutral-50/15" />

            <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
              <p className="text-sm font-medium italic text-muted-foreground">
                v0.70
              </p>
              <div className="text-sm text-muted-foreground">
                <span>Organize • Prioritize • Get things done</span>
              </div>
            </footer>
          </main>
        </section>
      </div>
    </>
  );
};

export default Page;
