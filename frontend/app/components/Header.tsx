"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../config";

export default function Header() {
  const [textIndex, setTextIndex] = useState(0);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const MANAGER_URL =
    process.env.NEXT_PUBLIC_MANAGER_URL || "http://localhost:3000";
  const searchTexts = [
    "Find Talent",
    "Discover Portfolios",
    "Search Skills",
    "Connect with Creators",
  ];

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % searchTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{ background: COLORS.primary }}>
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Remove-background-project-cropped.svg"
            alt="Knowabt Logo"
            width={45}
            height={45}
            className="object-contain"
          />
          <span
            className="text-2xl tracking-tight"
            style={{ color: COLORS.textDark }}
          >
            <span className="font-light">knowabt</span>
            <span className="font-bold">.me</span>
          </span>
        </Link>

        <div className="flex gap-3 items-center">
          <a
            href="/search"
            className="px-3 md:px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition flex items-center gap-2 relative overflow-hidden"
            style={{ background: COLORS.secondary, color: COLORS.white }}
          >
            <Image
              src="/find-path-svgrepo-com.svg"
              alt="Search"
              width={20}
              height={20}
              className="shrink-0"
            />
            <span
              key={textIndex}
              className="hidden md:inline-block animate-fade-in"
              style={{
                animation: "fadeIn 0.5s ease-in-out",
                minWidth: "140px",
              }}
            >
              {searchTexts[textIndex]}
            </span>
          </a>

          <a
            href="/form"
            className="px-3 md:px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition flex items-center gap-2"
            style={{ background: COLORS.white, color: COLORS.secondary }}
            title="Host Portfolio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="hidden md:inline">Host Portfolio</span>
          </a>

          {loading ? (
            <div className="px-3 md:px-5 py-2 rounded-full text-sm font-medium bg-white/20 text-white/80">
              Loading...
            </div>
          ) : user ? (
            <Link
              href="/profile"
              className="flex items-center px-2 py-2 rounded-full hover:bg-white/10 transition"
              title={user.username}
            >
              <Image
                src={user.avatar_url || "/Remove-background-project-cropped.svg"}
                alt={user.username}
                width={36}
                height={36}
                className="rounded-full"
              />
            </Link>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 md:px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
              style={{ background: COLORS.accent, color: COLORS.white }}
            >
              <span className="hidden md:inline">Login</span>
              <span className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
