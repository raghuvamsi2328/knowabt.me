"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COLORS,
  // NAV_LINKS,
  HERO,
  HOW_IT_WORKS,
  FOOTER,
} from "./config";
import TopReposSection from "./components/TopReposSection";
import SubdomainChecker from "./components/SubdomainChecker";
import { useAuth } from "./hooks/useAuth";

export default function Home() {
  const [textIndex, setTextIndex] = useState(0);
  const [repoTextIndex, setRepoTextIndex] = useState(0);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchTexts = [
    "Find Talent",
    "Discover Portfolios",
    "Search Skills",
    "Connect with Creators",
  ];
  const repoTexts = [
    "Trending Repos",
    "Popular Portfolios",
    "Featured Projects",
    "Top Developers",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % searchTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRepoTextIndex((prev) => (prev + 1) % repoTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ background: COLORS.primary }}
      className="min-h-screen w-full font-sans"
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
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
        </div>
        {/* <ul className="hidden md:flex gap-8 font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:underline"
                style={{ color: COLORS.textDark }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul> */}
        <div className="flex gap-3 items-center">
          {/* Search Button - Icon only on mobile, text on desktop */}
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
                minWidth: "140px"
              }}
            >
              {searchTexts[textIndex]}
            </span>
          </a>
          
          {/* Host Portfolio Button - Icon only on mobile, text on desktop */}
          <a
            href="/form"
            className="px-3 md:px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition flex items-center gap-2"
            style={{ background: COLORS.white, color: COLORS.secondary }}
            title="Host Portfolio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span className="hidden md:inline">Host Portfolio</span>
          </a>
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-medium hover:bg-white/10 transition"
                >
                  <Image
                    src={user.avatar_url || '/Remove-background-project-cropped.svg'}
                    alt={user.username}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span style={{ color: COLORS.textDark }} className="font-semibold hidden md:inline">
                    {user.username}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 md:px-4 py-2 rounded-full font-medium hover:opacity-80 transition text-sm"
                  style={{ background: COLORS.accent, color: COLORS.white }}
                  title="Logout"
                >
                  <span className="hidden md:inline">Logout</span>
                  <span className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-3 md:px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
                style={{ background: COLORS.accent, color: COLORS.white }}
              >
                <span className="hidden md:inline">Login</span>
                <span className="md:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </span>
              </button>
            )
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-16 gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: COLORS.textDark }}>
            {HERO.title}
            <br />
            <span style={{ color: COLORS.secondary }}>{HERO.subtitle}</span>
          </h1>
          <p className="mb-8 max-w-xl" style={{ color: COLORS.accent }}>
            {HERO.description}
          </p>
          <div className="flex justify-center md:justify-start">
            <a
              href="/search"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition relative overflow-hidden"
              style={{ background: COLORS.secondary, color: COLORS.white, minWidth: "280px" }}
            >
              <span>🔥</span>
              <span>
                Discover <span
                  key={repoTextIndex}
                  className="inline-block animate-fade-in"
                  style={{
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  {repoTexts[repoTextIndex]}
                </span>
              </span>
            </a>
          </div>
        </div>
        <SubdomainChecker />
      </section>

      {/* How It Works Section */}
      <section
        id="how"
        style={{ background: COLORS.secondary }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: '#D8DAD3' }}
          >
            How It Works
          </h2>
          <p
            className="mb-10"
            style={{ color: '#D8DAD3' }}
          >
            We've trimmed the fat. Going from "local project" to "live portfolio" is now a three-step sprint. Just link your git repo and let us handle the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="rounded-lg p-6 shadow hover:shadow-lg transition text-center"
                style={{ background: COLORS.card }}
              >
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={40}
                  height={40}
                  className="mb-4 mx-auto"
                />
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: COLORS.textDark }}
                >
                  {step.title}
                </h3>
                <p style={{ color: COLORS.textDark }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <a
              href="/form"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition"
              style={{ background: 'white', color: '#566246' }}
            >
              <span>→</span>
              <span>Claim Your Subdomain Now</span>
            </a>
          </div>
        </div>
      </section>

      <TopReposSection />

      {/* Footer */}
      <footer
        style={{ background: COLORS.secondary }}
        className="py-12 mt-8"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/Remove-background-project-cropped.svg"
                  alt="Knowabt Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span
                  className="text-xl"
                  style={{ color: COLORS.white }}
                >
                  <span className="font-light">knowabt</span>
                  <span className="font-bold">.me</span>
                </span>
              </div>
              <p
                className="text-sm mb-4"
                style={{ color: COLORS.highlight }}
              >
                Host your portfolio in seconds. Be discovered by skills.
              </p>
              {/* <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Image src="/github-icon.svg" alt="GitHub" width={24} height={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Image src="/twitter-icon.svg" alt="Twitter" width={24} height={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                  <Image src="/linkedin-icon.svg" alt="LinkedIn" width={24} height={24} />
                </a>
              </div> */}
            </div>

            {/* Discover Column */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: COLORS.white }}
              >
                Discover
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/search?filter=skill"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Browse by Skill
                  </a>
                </li>
                <li>
                  <a
                    href="/search?filter=location"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Browse by Location
                  </a>
                </li>
                <li>
                  <a
                    href="/trending"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Trending Developers
                  </a>
                </li>
                <li>
                  <a
                    href="/repositories"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Top Repositories
                  </a>
                </li>
              </ul>
            </div>

            {/* Product Column */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: COLORS.white }}
              >
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/info#features"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/info#how-it-works"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="/info#pricing"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/info#faq"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: COLORS.white }}
              >
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/info#about"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/info#contact"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/info#terms"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/info#privacy"
                    className="text-sm hover:underline"
                    style={{ color: COLORS.highlight }}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderColor: 'rgba(216, 218, 211, 0.2)' }}
          >
            <p
              className="text-sm"
              style={{ color: COLORS.highlight }}
            >
              © {new Date().getFullYear()} <span className="font-light">knowabt</span><span className="font-bold">.me</span>. All rights reserved. Made with{' '}
              <Image
                src="/love-svgrepo-com.svg"
                alt="Love"
                width={16}
                height={16}
                className="inline"
              />{' '}
              for developers.
            </p>
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.white }}
            >
              by server96
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
