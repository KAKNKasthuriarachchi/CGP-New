// app/(auth)/login/page.tsx     ← or wherever you keep route pages
"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* background image with subtle overlay */}
      <Image
        src="/img/bg.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <span className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

      {/* login card */}
      <div className="relative z-10 w-80 rounded-2xl bg-white p-8 shadow-lg">
        {/* logo */}
        <div className="mb-4 flex items-center gap-2">
          <Image
            src="https://img.icons8.com/ios-filled/50/4CAF50/graduation-cap.png"
            alt="Logo"
            width={30}
            height={30}
          />
          <span className="text-lg font-bold text-green-600">
            TuitionFinder
          </span>
        </div>

        <h2 className="mb-5 text-base font-semibold text-[#111d3c]">
          LOGIN TO YOUR ACCOUNT
        </h2>

        <form className="flex flex-col text-sm">
          {/* email */}
          <label htmlFor="email" className="mb-1">
            Email Address&nbsp;:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mb-4 rounded-xl border-2 border-black p-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* password */}
          <label htmlFor="password" className="mb-1">
            Password&nbsp;:
          </label>
          <div className="relative mb-1">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              required
              className="w-full rounded-xl border-2 border-black p-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 select-none text-lg"
            >
              &#128065;
            </button>
          </div>

          {/* forgot link */}
          <div className="mb-4 text-left text-xs">
            <a href="#" className="hover:underline">
              Forget <strong>Password?</strong>
            </a>
          </div>

          {/* submit */}
          <button
            type="submit"
            className="mb-4 w-full rounded-full bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700"
          >
            LOGIN
          </button>

          {/* register link */}
          <p className="text-center text-xs">
            Don’t have an account?{" "}
            <a href="#" className="font-semibold text-green-600 hover:underline">
              Register now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
