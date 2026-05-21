import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) console.log(error);
      else alert("check your email for verification link");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) console.log(error);
      else navigate("/");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-md w-full space-y-8 bg-[#121212]/40 border border-neutral-900 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 text-3xl mb-4">
            🪙
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            {isSignUp ? "Start tracking your canteen spending" : "Log in to view your spending insights"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-neutral-800 placeholder-neutral-600 text-white rounded-xl bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-neutral-800 placeholder-neutral-600 text-white rounded-xl bg-neutral-950/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-amber-500 transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <div className="flex items-center justify-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-amber-500 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
