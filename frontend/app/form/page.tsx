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
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState<string>("");

  // Redirect to login if not authenticated
  // TEMPORARILY DISABLED FOR TESTING
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
  }, [user, form.contact]);

  // Fetch available skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        const data = await res.json();
        const skills = Array.isArray(data.skills) ? data.skills : [];
        setAvailableSkills(skills);
      } catch (err) {
        // Fallback to default skills if API fails
        setAvailableSkills([
          'React', 'Next.js', 'TypeScript', 'Node.js', 'Express',
          'Tailwind CSS', 'HTML', 'CSS', 'JavaScript', 'Vue',
          'Angular', 'Python', 'Docker', 'Git', 'Figma', 
          'UI/UX', 'SEO', 'MongoDB', 'PostgreSQL', 'AWS'
        ]);
      }
    };
    fetchSkills();
  }, []);

  // Update form.skills when selectedSkills changes
  useEffect(() => {
    setForm(prev => ({ ...prev, skills: selectedSkills.join(', ') }));
  }, [selectedSkills]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        // Remove skill
        return prev.filter(s => s !== skill);
      } else if (prev.length < 3) {
        // Add skill (max 3)
        return [...prev, skill];
      }
      // Already have 3 skills
      return prev;
    });
  };

  // Filter skills based on search query
  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

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
    if (!form.subdomain || !form.gitUrl || !form.contact) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    
    if (selectedSkills.length === 0) {
      setError("Please select at least 1 skill.");
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

  // TEMPORARILY ALLOW ACCESS WITHOUT LOGIN
  // if (!user) {
  //   return null; // Will redirect to login
  // }

  return (
    <div className="min-h-screen bg-[#D8DAD3] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto mb-6"
        >
          {/* User Welcome Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-[#566246]">Host your site on knowabt.me</h1>
            <p className="text-sm text-gray-600 mt-2">
              {user ? (
                <>Welcome, <span className="font-semibold text-[#566246]">{user.username}</span>!</>
              ) : (
                <>Fill out the form below to deploy your portfolio</>
              )}
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
        <div className="block mb-6">
          <label className="block mb-2">
            <span className="block mb-1 font-medium" style={{ color: '#4A4A48' }}>
              Top 3 Skills <span className="text-xs text-gray-500">({selectedSkills.length}/3 selected)</span>
            </span>
          </label>
          
          {/* Search Input */}
          <div className="mb-3">
            <input
              type="text"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              placeholder="🔍 Search skills..."
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-[#566246] focus:ring-opacity-30 text-sm"
              style={{ color: '#4A4A48' }}
            />
            {skillSearchQuery && (
              <p className="mt-1 text-xs text-gray-500">
                Showing {filteredSkills.length} of {availableSkills.length} skills
              </p>
            )}
          </div>

          {/* Skills Chips */}
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded bg-gray-50">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    disabled={!isSelected && selectedSkills.length >= 3}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-[#566246] text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }
                      ${!isSelected && selectedSkills.length >= 3 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer'
                      }
                    `}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 w-full text-center py-4">
                No skills found matching "{skillSearchQuery}"
              </p>
            )}
          </div>
          
          {/* Selected Skills Display */}
          {selectedSkills.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs font-medium text-blue-800 mb-2">Selected Skills:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#566246] text-white"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-2 hover:text-red-300 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Validation Messages */}
          {selectedSkills.length === 0 && (
            <p className="mt-2 text-xs text-red-600">Please select at least 1 skill</p>
          )}
          {selectedSkills.length > 0 && selectedSkills.length < 3 && (
            <p className="mt-2 text-xs text-gray-500">
              Select {3 - selectedSkills.length} more skill{3 - selectedSkills.length !== 1 ? 's' : ''}
            </p>
          )}
          {selectedSkills.length === 3 && (
            <p className="mt-2 text-xs text-green-600">✓ Perfect! You've selected 3 skills</p>
          )}
        </div>
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

        {/* Supported Frameworks Section - Moved to Bottom */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#566246] mb-4">✅ Currently Supported Frameworks</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your repository must have a <code className="bg-gray-100 px-2 py-1 rounded text-xs">package.json</code> with a build script. 
            We auto-detect output from these directories: <code className="bg-gray-100 px-2 py-1 rounded text-xs">dist/</code>, <code className="bg-gray-100 px-2 py-1 rounded text-xs">build/</code>, <code className="bg-gray-100 px-2 py-1 rounded text-xs">out/</code>, <code className="bg-gray-100 px-2 py-1 rounded text-xs">browser/</code>
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* React */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>⚛️</span> React (CRA / Vite)
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "react-scripts build"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Builds to: <code>build/</code> or <code>dist/</code></p>
            </div>

            {/* Next.js */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>▲</span> Next.js (Static)
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "next build"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Builds to: <code>out/</code></p>
            </div>

            {/* Vue */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>🟢</span> Vue / Vite
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "vite build"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Builds to: <code>dist/</code></p>
            </div>

            {/* Angular */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>🅰️</span> Angular
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "ng build"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Builds to: <code>dist/.../browser/</code></p>
            </div>

            {/* Static HTML */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>📄</span> HTML/CSS/JS
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "echo 'No build needed'"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Copies all files directly</p>
            </div>

            {/* Astro */}
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition">
              <h3 className="font-semibold text-[#566246] mb-2 flex items-center gap-2">
                <span>🚀</span> Astro / Docusaurus
              </h3>
              <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                <code className="text-green-400">
{`{
  "scripts": {
    "build": "astro build"
  }
}`}
                </code>
              </pre>
              <p className="text-xs text-gray-500 mt-2">✅ Builds to: <code>dist/</code> or <code>build/</code></p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Make sure your repository is <strong>public</strong> on GitHub/GitLab and contains 
              a <code className="bg-blue-100 px-1 rounded">package.json</code> with a build script. The build must output static files!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
