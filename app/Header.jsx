import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center z-50 justify-between w-full px-6 py-4 shadow-sm relative">
      <Link href="/" className="flex items-center relative z-10">
        {/* Logo */}
        <Image
          src="/logo.png" // replace with your logo path
          alt="Site Logo"
          width={64}
          height={64}
          className="mr-1"
        />

        {/* Site title or tagline */}
        <span className="text-lg font-semibold text-white">Cryphos</span>
      </Link>
      <div className="flex items-center gap-10">
        <Link href="/login" className="relative z-10 px-3 py-2">
          <span className="text-white text-sm font-semibold">Log In</span>
        </Link>
        <Link href="/signup" className="relative z-10 px-3 py-2">
          <span className="text-white text-sm font-semibold">Sign Up</span>
        </Link>
      </div>
    </header>
  );
}
