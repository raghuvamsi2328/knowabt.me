"use client";

import { useEffect, useState } from "react";
import { COLORS } from "../config";

type Portfolio = {
  name: string;
  skills: string[];
  subdomain: string;
  repoUrl: string;
  createdAt?: string;
  viewsCount?: number;
};

// Mock data as default
// Mock data as default
const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    name: "Project-X",
    skills: ["React"],
    subdomain: "project-x",
    repoUrl: "https://github.com/example/project-x",
    createdAt: new Date().toISOString(),
    viewsCount: 0,
  },
  {
    name: "Project-Y",
    skills: ["HTML", "CSS"],
    subdomain: "project-y",
    repoUrl: "https://github.com/example/project-y",
    createdAt: new Date().toISOString(),
    viewsCount: 0,
  },
  {
    name: "Project-Latisanu",
    skills: ["JavaScript", "TypeScript", "Node.js"],
    subdomain: "project-latisanu",
    repoUrl: "https://github.com/example/project-latisanu",
    createdAt: new Date().toISOString(),
    viewsCount: 0,
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
                    width: "360px",
                    textDecoration: "none",
                  }}
                >
                  <h3
                    className="font-bold text-xl mb-2"
                    style={{ color: COLORS.textDark }}
                  >
                    {portfolio.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs mb-4" style={{ color: COLORS.accent }}>
                    <span>Views: {portfolio.viewsCount || 0}</span>
                    {portfolio.createdAt && (
                      <span>
                        Deployed{" "}
                        {new Date(portfolio.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(portfolio.skills || []).slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: COLORS.secondary, color: COLORS.white }}
                      >
                        {skill}
                      </span>
                    ))}
                    {portfolio.skills && portfolio.skills.length > 3 && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: COLORS.accent, color: COLORS.white }}
                      >
                        +{portfolio.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: COLORS.textDark }}>
                      {portfolio.subdomain}.knowabt.me
                    </span>
                    <a
                      href={portfolio.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm px-3 py-1 rounded-full font-semibold shadow hover:opacity-90 transition"
                      style={{ background: COLORS.secondary, color: COLORS.white }}
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
