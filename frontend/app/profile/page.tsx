'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Site {
  id: number;
  name: string;
  url: string;
  status: string;
  created_at: string;
  skills?: string;
  views_count?: number;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserSites();
    }
  }, [user]);

  const fetchUserSites = async () => {
    try {
      const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';
      const response = await fetch(`${MANAGER_URL}/deployments`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      // Handle both formats: { sites: [...] } and [...]
      if (data.sites && Array.isArray(data.sites)) {
        setSites(data.sites);
      } else if (Array.isArray(data)) {
        setSites(data);
      } else {
        setSites([]);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleRebuild = async (name: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [name]: true }));
      const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';
      const response = await fetch(`${MANAGER_URL}/sites/${encodeURIComponent(name)}/rebuild`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Rebuild failed' }));
        alert(payload.error || 'Rebuild failed');
      } else {
        await fetchUserSites();
      }
    } catch (error) {
      alert('Rebuild failed');
    } finally {
      setActionLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleDeleteRequest = async (name: string) => {
    const confirmed = confirm('Request deletion of this portfolio and all data?');
    if (!confirmed) return;
    try {
      setActionLoading((prev) => ({ ...prev, [name]: true }));
      const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';
      const response = await fetch(`${MANAGER_URL}/sites/${encodeURIComponent(name)}/request-delete`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Delete request failed' }));
        alert(payload.error || 'Delete request failed');
      } else {
        await fetchUserSites();
      }
    } catch (error) {
      alert('Delete request failed');
    } finally {
      setActionLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3]">
        <div className="animate-spin w-10 h-10 border-4 border-[#566246] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3]">
        <div className="text-sm text-[#566246]">Redirecting to login...</div>
      </div>
    );
  }

  const profileUser = user;

  const displaySites = sites;

  // Calculate statistics
  const totalSites = displaySites.length;
  const successfulSites = displaySites.filter(s => s.status === 'success').length;
  const buildingSites = displaySites.filter(s => s.status === 'building').length;
  const failedSites = displaySites.filter(s => s.status === 'failed').length;
  const totalViews = displaySites.reduce((sum, site) => sum + (site.views_count || 0), 0);

  const profileInitials = profileUser?.username
    ? profileUser.username
        .split(/\s+/)
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toLowerCase()
    : 'me';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#566246] via-[#d9d9d2] to-[#566246]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-end mb-6 gap-3">
          <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-[#566246] text-sm font-semibold">
            {profileInitials}
          </div>
          <span className="text-white text-sm font-medium">{profileUser.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="text-center mb-10">
          <div className="mx-auto w-28 h-28 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-3xl font-semibold text-[#566246]">
            {profileInitials}
          </div>
          <h1 className="mt-4 text-xl font-semibold text-[#3f3f3f]">{profileUser.username}</h1>
          <p className="text-xs text-gray-600">
            Member since {new Date(profileUser.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow px-5 py-6 text-center">
            <div className="text-2xl font-bold text-[#3f3f3f]">{totalViews}</div>
            <div className="text-xs text-gray-500 mt-1">Total Views</div>
          </div>
          <div className="bg-white rounded-2xl shadow px-5 py-6 text-center">
            <div className="text-2xl font-bold text-[#3f3f3f]">—</div>
            <div className="text-xs text-gray-500 mt-1">Likes (Coming Soon)</div>
          </div>
          <div className="bg-white rounded-2xl shadow px-5 py-6 text-center">
            <div className="text-2xl font-bold text-[#3f3f3f]">220</div>
            <div className="text-xs text-gray-500 mt-1">Trending Rank</div>
          </div>
          <div className="bg-white rounded-2xl shadow px-5 py-6 text-center">
            <div className="text-2xl font-bold text-[#3f3f3f]">0</div>
            <div className="text-xs text-gray-500 mt-1">Projects</div>
          </div>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#3f3f3f]">Your Portfolios</h2>
            {totalSites === 0 && (
              <button
                onClick={() => router.push('/form')}
                className="px-4 py-2 bg-[#566246] text-white rounded-full text-sm hover:opacity-90 transition"
              >
                Create New Portfolio
              </button>
            )}
          </div>

          {loadingSites ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#566246] border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {displaySites.map((site) => {
                const skillTags = (site.skills || '')
                  .split(',')
                  .map(skill => skill.trim())
                  .filter(Boolean)
                  .slice(0, 3);
                return (
                  <div
                    key={site.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-[#3f3f3f]">
                            {site.name}.knowabt.me
                          </h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-[#566246] text-white">
                            {site.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {site.url}
                          </a>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">Skills: Portfolios</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {skillTags.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-full text-xs bg-[#566246] text-white"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 text-xs text-gray-500">Skills Portfolios</div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#566246] text-white">👁</span>
                          <span>{site.views_count || 0} Views</span>
                          <span className="text-gray-400">• Likes coming soon</span>
                        </div>
                      </div>
                      {site.status === 'success' && (
                        <div className="flex flex-col gap-2 items-end">
                          <a
                            href={`https://${site.name}.knowabt.me`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-[#566246] text-white text-sm"
                          >
                            Visit Site
                          </a>
                          <button
                            onClick={() => handleRebuild(site.name)}
                            disabled={!!actionLoading[site.name]}
                            className="px-4 py-2 rounded-full bg-[#4A4A48] text-white text-sm disabled:opacity-50"
                          >
                            {actionLoading[site.name] ? 'Rebuilding...' : 'Rebuild'}
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(site.name)}
                            disabled={!!actionLoading[site.name]}
                            className="px-4 py-2 rounded-full bg-red-500 text-white text-sm disabled:opacity-50"
                          >
                            Request Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
