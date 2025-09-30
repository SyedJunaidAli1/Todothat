📌 Todothat

Organize • Prioritize • Get things done

Todothat is a modern and minimal task management app designed to help you stay productive and organized. Inspired by apps like Todoist and Asana, it provides a clean interface, powerful task/project management, and a smooth user experience.

✨ Features

📥 Inbox – Capture tasks quickly

📅 Today & Upcoming – Focus on what matters now

✅ Completed tasks – Track your progress

📂 Projects – Organize tasks into custom projects

🔎 Search – Find tasks instantly

🎨 Dark/Light mode – Seamless theme toggle

📬 Email notifications (via Knock) for overdue tasks

🔐 Authentication – Sign up, sign in, reset password, and email verification

🛠 Tech Stack

Frontend:

Next.js 15, React, TypeScript

shadcn/ui, Tailwind CSS

React Query

Backend:

BetterAuth (authentication)

Trigger.dev(notification)

Knock (notifications), Resend (email)

Neon + Drizzle ORM (database)

🚀 Getting Started
1. Clone the repo
git clone https://github.com/SyedJunaidAli1/Todothat
cd todothat

2. Install dependencies
bun install

3. Environment variables

Create a .env file in the root directory and add:

DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

RESEND_API_KEY=

KNOCK_API_KEY=
NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=
NEXT_PUBLIC_KNOCK_FEED_ID=

TRIGGER_API_KEY=
TRIGGER_SECRET_KEY=

4. Run the development server
bun run dev

5. Build for production
bun run build
bun start

🌍 Live Demo

🔗 todothat.space

🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

📜 License

This project is licensed under the MIT License