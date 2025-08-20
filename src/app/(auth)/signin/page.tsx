"use client";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import Link from "next/link";
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const emailTrimmed = email.trim();
    const passwordTrimmed = password;

    if (!emailTrimmed || !passwordTrimmed) {
      setError("Please provide both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      await signIn(emailTrimmed, passwordTrimmed);
      toast.success("You're logged in 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      let msg = "Invalid email or password";
      if (err && typeof err === "object") {
        const maybeMessage = (err as { message?: string }).message;
        if (typeof maybeMessage === "string") msg = maybeMessage;
      } else if (typeof err === "string") {
        msg = err;
      }

      if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("verify your email")
      ) {
        setError(
          <span>
            Please verify your email address.{" "}
            <Link href="/verify-email" className="text-red-500 underline">
              Resend verification email
            </Link>
          </span>
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // `h-screen` + `overflow-hidden` removes the browser scrollbar for this page
    <div className="h-screen overflow-hidden">
      <div className="flex justify-between py-2 px-4 bg-emerald-500">
        <p className="font-bold">TodoThat</p>
        <p className="text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <div className="flex h-full ">
        {/* LEFT PANEL: illustration (hidden on small screens) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-2 bg-emerald-500">
          {/* container to mimic rounded card area in your screenshot */}
          <div className="w-full max-w-lg rounded-2xl overflow-hidden p-3 shadow border-2">
            {/* Replace /auth-illustration.png with your image path in /public */}
            <Image
              src="/auth-illustration.png"
              alt="Auth illustration"
              width={900}
              height={900}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* RIGHT PANEL: form */}
        <div className="flex-1 flex flex-col justify-center px-3 py-6">
          <div className="w-full max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="">
              <Card className="border shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Sign in
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      aria-label="Email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm mb-2">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      aria-label="Password"
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <p className="text-sm text-center">
                    Forgot password?{" "}
                    <Link
                      href="/forgot-password"
                      className="text-emerald-500 hover:underline"
                    >
                      Reset it
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
