"use client";
import Image from "next/image";
import Link from "next/link";
import { GetPing } from "./api/ApiWrapper";
import { useEffect, useState } from "react";
export default function Header() {
  const [ping, setPing] = useState(false);
  useEffect(() => {
    GetPing(setPing);
  }, []);
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 relative">
      <div className="flex items-center">
        {/* Logo */}
        <Image src={"/logo.png"} width={48} height={48} />

        {/* Site title */}
        <span className="text-xl font-bold text-white">Cryphos</span>
      </div>
      {!ping && (
        <div className="flex items-center gap-6">
          <Link href={"/login"}>
            <button className="text-white text-sm font-semibold hover:text-[#e3b8ff] transition-colors">
              Log In
            </button>
          </Link>
          <Link href={"/register"}>
            <button
              href={"/register"}
              className="px-4 py-2 bg-gradient-to-r from-[#e3b8ff] to-[#6a2e8e] text-black font-semibold text-sm rounded-lg hover:scale-105 transition-transform"
            >
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
