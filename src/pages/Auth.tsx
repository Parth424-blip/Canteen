import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth() {
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
      else alert("Welcome back");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp ? (
          <button type="submit">Sign Up</button>
        ) : (
          <button type="submit">Sign In</button>
        )}
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
