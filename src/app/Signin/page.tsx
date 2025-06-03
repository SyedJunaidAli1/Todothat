"use client";
import { useState } from "react";
import { signIn } from "@/lib/methods/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from 'nextjs-toploader/app';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn(email, password);
      if (!res || res.error) {
        throw new Error("Invalid credentials");
      }
      toast.success("You're Loggen in 🎉");
      router.push("/"); // ✅ this will now work
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Card className=" border shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Sign In
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Don't have an account? <br />
              <a href="/Signup" className="text-emerald-400 hover:underline">
                Sign Up
              </a>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
