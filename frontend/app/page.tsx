"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  COLORS,
  // NAV_LINKS,
  HERO,
  HOW_IT_WORKS,
  FOOTER,
} from "./config";
import TopReposSection from "./components/TopReposSection";
import SubdomainChecker from "./components/SubdomainChecker";

export default function Home() {
  const [repoTextIndex, setRepoTextIndex] = useState(0);
  const repoTexts = [
    "Trending Repos",
    "Popular Portfolios",
    "Featured Projects",
    "Top Developers",
  ];

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

    </div>
  );
}
