"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      if (error) throw error;
      setMessage("If the email exists, a reset link has been sent.");
      setError("");
    } catch (error: any) {
      setError(error.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left image panel */}
      <div className="hidden md:flex w-1/2 bg-emerald-500 items-center justify-center">
        <img
          src="/auth-illustration.png"
          alt="Forgot Password Illustration"
          className="w-3/4 max-w-md"
        />
      </div>

      {/* Right form section */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Card className="border shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Forgot Password
              </CardTitle>
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
              {message && <p className="text-green-600 text-sm">{message}</p>}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Reset Password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
