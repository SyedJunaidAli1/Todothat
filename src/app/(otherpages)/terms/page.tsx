import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Condition | Todothat – Get Organized, Stay Productive",
  description:
    "Manage your tasks, projects, and productivity with Todothat. Stay organized, prioritize, and get things done.",
  keywords: [
    "task manager",
    "todo app",
    "project management",
    "productivity",
    "Todothat",
  ],
};

const page = () => {
  return (
    <>
      <div>
        <section className="min-h-[85vh] w-full mx-auto max-w-[600px] px-4 sm:px-6 py-16">
          <main className="flex flex-col items-start justify-center gap-8">
            <header className="flex sm:flex-row justify-between items-center w-full gap-4 sm:gap-0"></header>

            <div>
              <h2 className="text-lg font-medium">Introduction</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                Welcome to our app. By accessing or using this application, you
                agree to comply with these Terms and Conditions. Please read
                them carefully before using our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Use of Service</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                You agree to use the app only for lawful purposes and in a way
                that does not infringe the rights of, restrict, or inhibit
                anyone else's use of the app. Misuse of the app may result in
                suspension or termination of access.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">User Accounts</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                To access certain features, you may need to create an account.
                You are responsible for maintaining the confidentiality of your
                login credentials and for all activities under your account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Intellectual Property</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                All content, design, and functionality in this app remain the
                property of the developer. You may not copy, reproduce, or
                distribute any part of the app without prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Limitation of Liability</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                The app is provided "as is" without warranties of any kind. We
                are not responsible for any loss, damage, or issues that may
                arise from using the app.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Changes to Terms</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                We may update these Terms from time to time. Any changes will be
                effective immediately when posted within the app. Continued use
                of the app after changes means you accept the new terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Contact Us</h2>
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                If you have any questions about these Terms & Conditions, feel
                free to contact us at{" "}
                <span className="text-emerald-400 font-semibold">
                  syedjunaidali790@gmail.com
                </span>
                .
              </p>
            </div>

            <div className="w-full h-[1px] bg-neutral-50/15"></div>
            <footer className="flex justify-between items-center w-full">
              <p className="mt-2 text-sm font-medium italic">v0.70</p>
              <Link
                href="https://github.com/SyedJunaidAli1"
                target="_blank"
                className="opacity-none hover:text-emerald-400  transition"
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

export default page;
