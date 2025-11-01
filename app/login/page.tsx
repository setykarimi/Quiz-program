"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.replace("/dashboard");
      }
    };
    
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) router.replace("/dashboard");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const handleAuth = async () => {
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        setMessage("✅ Signup successful! Check your email for confirmation.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">
        {isLogin ? "Login" : "Create an Account"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded w-72 disabled:bg-gray-400"
      >
        {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
      </button>

      {message && <p className="text-sm text-center">{message}</p>}

      <p className="text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          className="text-indigo-600 font-semibold hover:underline"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
}
