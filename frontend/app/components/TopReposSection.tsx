"use client";

import { useEffect, useState } from "react";
import { COLORS } from "../config";

type Portfolio = {
  name: string;
  description: string;
  tech: string;
  subdomain: string;
  repoUrl: string;
};

// Mock data as default
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    name: "Project-X",
    description: "Create ux portfolio foctanes and winning project.",
    tech: "React",
    subdomain: "project-x",
    repoUrl: "https://github.com/example/project-x",
  },
  {
    name: "Project-Y",
    description: "Project a useful leaning designed for API first.",
    tech: "HTML",
    subdomain: "project-y",
    repoUrl: "https://github.com/example/project-y",
  },
  {
    name: "Project-Latisanu",
    description: "Deploy evername, with a git-comformed productio.",
    tech: "JavaScript",
    subdomain: "project-latisanu",
    repoUrl: "https://github.com/example/project-latisanu",
  },
];

export default function TopReposSection() {
  // Initialize with mock data so it shows immediately
  const [portfolios, setPortfolios] = useState<Portfolio[]>(MOCK_PORTFOLIOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    fetch("/api/top-repos")
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios && data.portfolios.length > 0) {
          setPortfolios(data.portfolios);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Using mock data (API not available):", err);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="toprepos"
      style={{ background: COLORS.primary }}
      className="py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Trending Portfolios */}
        <div className="mb-12">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: COLORS.textDark }}
          >
            Trending Portfolios
          </h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max px-4">
              {portfolios.map((portfolio, index) => (
                <a
                  key={index}
                  href={`https://${portfolio.subdomain}.knowabt.me`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-6 shadow hover:shadow-lg transition shrink-0 cursor-pointer"
                  style={{
                    background: COLORS.card,
                    border: `2px solid ${COLORS.accent}`,
                    width: "320px",
                    textDecoration: "none",
                  }}
                >
                  <h3
                    className="font-bold text-xl mb-2"
                    style={{ color: COLORS.textDark }}
                  >
                    {portfolio.name}
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: COLORS.accent }}
                  >
                    {portfolio.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: COLORS.secondary,
                        color: COLORS.white,
                      }}
                    >
                      {portfolio.tech}
                    </span>
                    <a
                      href={portfolio.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm hover:underline"
                      style={{ color: COLORS.secondary }}
                    >
                      View Repo →
                    </a>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="text-center">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: COLORS.textDark }}
          >
            Discover Portfolios
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: COLORS.accent }}
          >
            Search and explore portfolios by name, location, or skills. Find inspiration and connect with talented creators.
          </p>
          <a
            href="/search"
            className="inline-block px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition"
            style={{
              background: COLORS.secondary,
              color: COLORS.white,
            }}
          >
            Search Portfolios
          </a>
        </div>
      </div>
    </section>
  );
}
