import { auth } from "@/lib/auth";
import { signIn, signUp } from "@/lib/methods/users";
import { headers } from "next/headers";
import SignOut from '../components/SignOut';

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return (
    <div>
      <h1 className="text-6xl">testPage</h1>
      <div className="flex justify-between">
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg" onClick={signIn}>
          Signin
        </button>
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg" onClick={signUp}>
          Signup
        </button>
        <p>{!session ? "Not Authenticated" : session.user.name}</p>
      </div>
      <SignOut />
    </div>
  );
};

export default page;
