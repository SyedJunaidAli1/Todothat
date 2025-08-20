"use client";
import React, { useState } from "react";
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
import { signUp } from "@/lib/methods/users";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const nameTrim = name.trim();
    const emailTrim = email.trim();
    const passwordTrim = password;

    if (!nameTrim || !emailTrim || !passwordTrim) {
      setError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp(nameTrim, emailTrim, passwordTrim);
      toast.success("Account created successfully 🎉");
      toast.success("Email Verification Sent. Valid for 24 hours");
      router.push("/");
    } catch (err: unknown) {
      console.error("signup error:", err);
      let msg = "Something went wrong during signup.";
      if (err && typeof err === "object") {
        const maybeMessage = (err as { message?: string }).message;
        if (typeof maybeMessage === "string") msg = maybeMessage;
      } else if (typeof err === "string") {
        msg = err;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex justify-between py-2 px-4 bg-emerald-500">
        <p className="font-bold">TodoThat</p>
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <div className="flex h-full">
        {/* LEFT PANEL: illustration (hidden on small screens) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-2 bg-emerald-500 ">
          <div className="w-full max-w-lg  rounded-2xl overflow-hidden p-3  ">
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
            <form onSubmit={handleSubmit}>
              <Card className="border shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Sign Up
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                      aria-label="Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      autoComplete="email"
                      aria-label="Email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      aria-label="Password"
                    />
                  </div>

                  {error && (
                    <p
                      aria-live="polite"
                      className="text-red-500 text-sm text-center"
                    >
                      {error}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    By creating an account you agree to our{" "}
                    <Link
                      href="/term"
                      className="text-emerald-400 hover:underline"
                    >
                      Term
                    </Link>
                    .
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
