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
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D8DAD3]">
        <div className="animate-spin w-10 h-10 border-4 border-[#566246] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate statistics
  const totalSites = sites.length;
  const successfulSites = sites.filter(s => s.status === 'success').length;
  const buildingSites = sites.filter(s => s.status === 'building').length;
  const failedSites = sites.filter(s => s.status === 'failed').length;

  return (
    <div className="min-h-screen bg-[#D8DAD3] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {user.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-[#566246]"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-[#566246] mb-2">
                  {user.username}
                </h1>
                {user.email && (
                  <p className="text-gray-600 mb-1">{user.email}</p>
                )}
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Statistics Section - Only show if user has portfolios */}
        {!loadingSites && totalSites > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-[#566246] mb-2">{totalSites}</div>
              <div className="text-sm text-gray-600">Total Portfolios</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{successfulSites}</div>
              <div className="text-sm text-gray-600">Live Sites</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{buildingSites}</div>
              <div className="text-sm text-gray-600">Building</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{failedSites}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        )}

        {/* Sites Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#566246]">
              {totalSites > 0 ? 'Your Portfolios' : 'Get Started with Your Free Portfolio'}
            </h2>
            {totalSites > 0 && (
              <button
                onClick={() => router.push('/form')}
                className="px-4 py-2 bg-[#566246] text-white rounded hover:bg-[#4A4A48] transition"
              >
                Create New Portfolio
              </button>
            )}
          </div>

          {loadingSites ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#566246] border-t-transparent rounded-full"></div>
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#566246] bg-opacity-10 mb-4">
                  <svg className="w-10 h-10 text-[#566246]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#566246] mb-3">
                  🎉 Host Your Portfolio for FREE!
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Showcase your work to the world with a custom subdomain on knowabt.me. 
                  It's completely free, fast to deploy, and perfect for developers, designers, and creators!
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-left max-w-3xl mx-auto">
                  <div className="bg-[#D8DAD3] bg-opacity-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-semibold text-[#566246] mb-1">Lightning Fast</h4>
                    <p className="text-sm text-gray-600">Deploy in minutes with automatic builds from your Git repository</p>
                  </div>
                  <div className="bg-[#D8DAD3] bg-opacity-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌐</div>
                    <h4 className="font-semibold text-[#566246] mb-1">Custom Subdomain</h4>
                    <p className="text-sm text-gray-600">Get your own yourname.knowabt.me subdomain instantly</p>
                  </div>
                  <div className="bg-[#D8DAD3] bg-opacity-50 rounded-lg p-4">
                    <div className="text-2xl mb-2">🎨</div>
                    <h4 className="font-semibold text-[#566246] mb-1">Showcase Skills</h4>
                    <p className="text-sm text-gray-600">Highlight your top skills and get discovered by others</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/form')}
                className="px-8 py-4 bg-[#566246] text-white rounded-lg hover:bg-[#4A4A48] transition font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                🚀 Create Your Free Portfolio Now
              </button>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required • Deploy in 5 minutes • 100% Free
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#566246]">
                          {site.name}.knowabt.me
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            site.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : site.status === 'building'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {site.status}
                        </span>
                      </div>
                      {site.url && (
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mb-2 inline-block"
                        >
                          {site.url}
                        </a>
                      )}
                      {site.skills && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Skills: </span>
                          <span className="text-sm text-[#566246] font-medium">
                            {site.skills}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(site.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {site.status === 'success' && (
                      <a
                        href={`https://${site.name}.knowabt.me`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-4 py-2 bg-[#566246] text-white rounded hover:bg-[#4A4A48] transition"
                      >
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
