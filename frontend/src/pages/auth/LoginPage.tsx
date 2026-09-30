import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../features/auth/auth.api";
import { useAuthStore } from "../../store/auth.store";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      setAuth(result.user, result.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            NoteMaker AI
          </h1>

          <p className="mt-2 text-slate-400">
            Your notes, but smarter.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-semibold">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to your notes.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
