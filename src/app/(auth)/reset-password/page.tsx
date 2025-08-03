"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "nextjs-toploader/app";

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) {
    return (
      <div className="text-center text-red-500">
        No token provided. Please request a password reset.
      </div>
    );
  }

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setMessage(error.message || "Failed to reset password");
      } else {
        setMessage("Password updated! You can now sign in.");
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-semibold">Reset Password</h1>

      <Input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      <Button
        type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-600"
        disabled={isLoading}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
      {message && (
        <p className="text-center text-sm text-emerald-500">{message}</p>
      )}
    </form>
  );
}
