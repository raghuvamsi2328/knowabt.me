"use client";
import { useState } from "react";

export default function FormPage() {
  const [form, setForm] = useState({
    subdomain: "",
    gitUrl: "",
    contact: "",
    skills: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3] px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 animate-spin mx-auto w-10 h-10 border-4 border-[#566246] border-t-transparent rounded-full"></div>
          <div className="text-lg font-semibold text-[#4A4A48]">Submitting your request...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-[#566246]">Host your site on knowabt.me</h1>
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
        </label>
        <button
          type="submit"
          className="w-full bg-[#566246] text-white font-semibold py-3 rounded hover:bg-[#4A4A48] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
