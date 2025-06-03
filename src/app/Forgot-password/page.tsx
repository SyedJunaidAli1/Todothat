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
import { useRouter } from "nextjs-toploader/app";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await authClient.forgetPassword({
        email,
        redirectTo: "/Reset-password",
      });
      if (error) throw error;
      setMessage("If the email exists, a reset link has been sent.");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Card className=" border shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Forgot Password
            </CardTitle>
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
            {message && <p className="mt-4 text-green-600">{message}</p>}
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
  );
}
