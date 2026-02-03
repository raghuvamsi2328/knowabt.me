"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    subdomain: "",
    gitUrl: "",
    contact: "",
    skills: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "error"
  >("idle");
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Pre-fill contact info if user is logged in
  useEffect(() => {
    if (user && !form.contact) {
      setForm((prev) => ({ 
        ...prev, 
        contact: user.email || '',
        subdomain: user.username || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        const res = await fetch("/api/skills/top");
        const data = await res.json();
        const topSkills = Array.isArray(data.skills) ? data.skills : [];
        setSuggestedSkills(topSkills);
        if (!form.skills && topSkills.length > 0) {
          setForm((prev) => ({ ...prev, skills: topSkills.join(", ") }));
        }
      } catch (err) {
        setSuggestedSkills([]);
      }
    };
    fetchTopSkills();
  }, [form.skills]);

  useEffect(() => {
    const value = form.subdomain.trim();
    if (!value) {
      setSubdomainStatus("idle");
      return;
    }
    if (!/^[a-z0-9-]+$/i.test(value)) {
      setSubdomainStatus("invalid");
      return;
    }

    setSubdomainStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/subdomain-check?name=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSubdomainStatus(data.available ? "available" : "taken");
      } catch (err) {
        setSubdomainStatus("error");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [form.subdomain]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Basic validation
    if (!form.subdomain || !form.gitUrl || !form.contact || !form.skills) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (subdomainStatus === "taken" || subdomainStatus === "invalid") {
      setError(
        subdomainStatus === "taken"
          ? "Subdomain is already taken."
          : "Subdomain format is invalid."
      );
      setLoading(false);
      return;
    }
    // Call backend API
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
    else setError("Submission failed. Try again later.");
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p>Your site request has been submitted. We’ll be in touch soon.</p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3] px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 animate-spin mx-auto w-10 h-10 border-4 border-[#566246] border-t-transparent rounded-full"></div>
          <div className="text-lg font-semibold text-[#4A4A48]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3] px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
      >
        {/* User Welcome Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#566246]">Host your site on knowabt.me</h1>
          <p className="text-sm text-gray-600 mt-2">
            Welcome, <span className="font-semibold text-[#566246]">{user.username}</span>!
          </p>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <label className="block mb-4">
          <span className="block mb-1 font-medium" style={{ color: '#4A4A48' }}>Subdomain</span>
          <div className="flex items-center">
            <input
              type="text"
              name="subdomain"
              value={form.subdomain}
              onChange={handleChange}
              className="border rounded-l px-3 py-2 w-full focus:outline-none focus:ring"
              placeholder="yourname"
              required
              style={{ color: '#4A4A48' }}
            />
            <span className="bg-gray-100 border border-l-0 rounded-r px-3 py-2" style={{ color: '#4A4A48' }}>.knowabt.me</span>
          </div>
          {subdomainStatus === "checking" && (
            <div className="mt-1 text-sm" style={{ color: '#4A4A48' }}>Checking availability...</div>
          )}
          {subdomainStatus === "available" && (
            <div className="mt-1 text-sm text-green-700">Subdomain is available.</div>
          )}
          {subdomainStatus === "taken" && (
            <div className="mt-1 text-sm text-red-600">Subdomain is taken.</div>
          )}
          {subdomainStatus === "invalid" && (
            <div className="mt-1 text-sm text-red-600">Use letters, numbers, and hyphens only.</div>
          )}
        </label>
        <label className="block mb-4">
          <span className="block mb-1 font-medium" style={{ color: '#4A4A48' }}>Git Repo URL (public)</span>
          <input
            type="url"
            name="gitUrl"
            value={form.gitUrl}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
            placeholder="https://github.com/your/repo"
            required
            style={{ color: '#4A4A48' }}
          />
        </label>
        <label className="block mb-4">
          <span className="block mb-1 font-medium" style={{ color: '#4A4A48' }}>Mobile or Email</span>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
            placeholder="Mobile or Email"
            required
            style={{ color: '#4A4A48' }}
          />
        </label>
        <label className="block mb-6">
          <span className="block mb-1 font-medium" style={{ color: '#4A4A48' }}>Top 3 Skills</span>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
            placeholder="e.g. React, Node.js, UI/UX"
            required
            style={{ color: '#4A4A48' }}
          />
          {suggestedSkills.length > 0 && (
            <div className="mt-2 text-xs" style={{ color: '#4A4A48' }}>
              Suggested: {suggestedSkills.join(", ")}
            </div>
          )}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#566246] text-white font-semibold py-3 rounded hover:bg-[#4A4A48] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="text-[#566246] hover:underline text-sm"
          >
            View My Profile
          </button>
        </div>
      </form>
    </div>
  );
}
