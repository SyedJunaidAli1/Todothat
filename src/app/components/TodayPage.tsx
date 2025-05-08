import { signIn, signUp } from "@/lib/methods/users";

const TodayPage = () => {
  return (
    <div>
      <h1 className="text-6xl">TodayPage</h1>
      <div className="flex justify-between">
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg" onClick={signIn}>
          Signin
        </button>
        <button className="p-3 border-2 border-white bg-emerald-400 rounded-lg" onClick={signUp}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default TodayPage;
