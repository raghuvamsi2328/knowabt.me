"use client";

import { useEffect, useState } from "react";
import { COLORS } from "../config";

type Repo = {
  name: string;
  url: string;
  skills?: string[];
  created_at?: string;
};

export default function TopReposSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadRepos = async () => {
      try {
        const res = await fetch("/api/top-repos");
        const data = await res.json();
        if (mounted) {
          setRepos(Array.isArray(data.repos) ? data.repos : []);
        }
      } catch (err) {
        if (mounted) setRepos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadRepos();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="toprepos" style={{ background: COLORS.secondary }} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: "#D8DAD3" }}>
          Top 10 Repos
        </h2>
        {loading ? (
          <div className="text-center" style={{ color: COLORS.highlight }}>
            Loading top repos...
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center" style={{ color: COLORS.highlight }}>
            No repos yet. Submit your first site!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {repos.map((repo) => (
              <div
                key={`${repo.name}-${repo.url}`}
                className="rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col md:flex-row gap-4 items-center"
                style={{ background: COLORS.card }}
              >
                <div className="flex-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold hover:underline"
                    style={{ color: COLORS.secondary }}
                  >
                    {repo.name}
                  </a>
                  <div className="text-sm mt-1" style={{ color: COLORS.accent }}>
                    Hosted on knowabt.me
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(repo.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: COLORS.highlight,
                          color: COLORS.accent,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
