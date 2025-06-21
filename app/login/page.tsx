"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      // Store JWT and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-emerald-600">NGIC Inventory</h1>
        <p className="text-slate-600">
          Welcome back! Please sign in to continue.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800">
          Sign In
        </h2>

        {error && (
          <div className="p-3 text-center text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <User className="absolute w-5 h-5 text-slate-400 top-3 left-4" />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 pl-12 text-slate-800 transition-colors bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="relative">
          <Lock className="absolute w-5 h-5 text-slate-400 top-3 left-4" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 pl-12 text-slate-800 transition-colors bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
