import { auth } from "@/lib/auth";
import { signIn, signOut, signUp } from "@/lib/methods/users";
import { headers } from "next/headers";
import Link from "next/link";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <h1 className="text-6xl">Layer</h1>
      <div className="flex justify-between">
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg">
          <Link href="/Signin">Signin</Link>
        </button>
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg">
          <Link href="/Signup">Signup</Link>
        </button>
        <button
          className="p-3 border-2 border-white bg-emerald-400 rounded-lg"
          onClick={signOut}
        >
          SignOut
        </button>
        <p>{!session ? "Not Authenticated" : session.user.name}</p>
      </div>
    </div>
  );
};

export default page;
