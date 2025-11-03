"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { FormInput } from "@/components";

type AuthFormInputs = {
  email: string;
  password: string;
  display_name?: string;
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<AuthFormInputs>();

  const onSubmit = async (data: AuthFormInputs) => {
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // ✅ Login flow
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;

        setMessage("✅ Logged in successfully!");
        router.replace("/");
      } else {
        // ✅ Signup flow
        const { data: signupData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { display_name: data.display_name },
          },
        });

        if (error) throw error;

        // فقط اگه signup موفق بود → برو سراغ سرور برای role
        if (signupData?.user?.id) {
          await fetch("/api/auth/setRole", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: signupData.user.id }),
          });
        }

        setMessage("✅ Signup successful! Check your email for confirmation.");
        setIsLogin(true);
        reset();
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ اگر کاربر لاگین است → اجازه نمایش فرم نده
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/");
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  if (checkingSession) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">
        {isLogin ? "Login" : "Create an Account"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-72">
        {!isLogin && (
          <FormInput
            label="Display Name"
            register={register("display_name", {
              required: "Display name is required",
              minLength: { value: 2, message: "Too short" },
            })}
            error={errors.display_name}
          />
        )}

        <FormInput
          type="email"
          label="Email"
          register={register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
          })}
          error={errors.email}
        />

        <FormInput
          type="password"
          label="Password"
          register={register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-3 rounded-lg disabled:bg-gray-400 text-sm"
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      {message && <p className="text-sm text-center mt-2">{message}</p>}

      <p className="text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
            reset();
          }}
          className="text-orange-600 font-semibold hover:underline"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
}
