import Link from "next/link";

const Page = () => {
  return (
    <>
      <div>
        <section className="min-h-[75vh] w-full mx-auto max-w-[800px] px-4 sm:px-6 py-16">
          <main className="flex flex-col gap-6">
            <header>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="mt-2 text-sm">
                📅 Last updated: <strong>August 26, 2025</strong>
              </p>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">Introduction</h2>
              <p className="text-[15px]  leading-relaxed">
                Todothat (“we”, “us”, or “our”) is committed to protecting your
                privacy. This policy explains what information we collect, why
                we collect it, and what we do with it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">1. Information We Collect</h2>
              <p className="text-[15px]  leading-relaxed">
                We collect information you provide when you create an account
                (email, name) and the tasks and projects you create. If you sign
                in with Google, we may receive basic profile info (name, email,
                avatar).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-[15px]  leading-relaxed space-y-2">
                <li>Provide, maintain, and improve the service.</li>
                <li>
                  Send transactional emails (password resets, verification).
                </li>
                <li>Process requests and provide support.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">
                3. Data Sharing & Third Parties
              </h2>
              <p className="text-[15px]  leading-relaxed">
                We do not sell your personal information. We may share data with
                service providers that help us deliver the product (email
                providers, analytics). We carefully choose vendors and require
                them to process data only as necessary.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">4. Security</h2>
              <p className="text-[15px]  leading-relaxed">
                We take reasonable steps to protect user data (encryption,
                secure hosting). However, no system is 100% secure—if you
                suspect a breach, contact us immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">5. Your Choices</h2>
              <p className="text-[15px]  leading-relaxed">
                You can manage or delete your account by visiting account
                settings. For email preferences, use the unsubscribe link in
                emails or contact support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">6. Contact Us</h2>
              <p className="text-[15px]  leading-relaxed">
                If you have questions about this policy, email us at{" "}
                <Link
                  href="syedjunaidali790@gmail.com"
                  className="text-emerald-400 hover:underline"
                >
                  syedjunaidali790@gmail.com
                </Link>
                .
              </p>
            </section>

            <div className="w-full h-[1px] bg-neutral-50/15" />
            <footer className="flex justify-between items-center w-full">
              <p className="mt-2 text-sm font-medium italic ">v0.70</p>
              <Link
                href="https://github.com/SyedJunaidAli1"
                target="_blank"
                rel="noreferrer"
                className="opacity-none hover:text-emerald-400 transition"
              >
                Junaid
              </Link>
            </footer>
          </main>
        </section>
      </div>
    </>
  );
};

export default Page;
