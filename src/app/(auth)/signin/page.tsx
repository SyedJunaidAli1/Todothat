"use client";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/methods/users";
import { toast } from "sonner";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success("You're Loggen in 🎉");
      router.push("/"); // Redirect to dashboard or home
    } catch (err: any) {
      if (err.message.includes("verify your email")) {
        setError(
          "Please verify your email address. <a href='/verify-email' class='text-blue-500 underline'>Resend verification email</a>"
        );
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Card className="border shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <p
                className="text-red-500 text-sm text-center"
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center">
              Forgot password?{" "}
              <a
                href="/forgot-password"
                className="text-emerald-500 hover:underline"
              >
                Reset it
              </a>
            </p>
            <p className="text-sm text-center">
              No Account?{" "}
              <a href="/signup" className="text-emerald-500 hover:underline">
                Sign Up
              </a>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
