'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchResult {
  id: number;
  name: string;
  url: string;
  skills: string;
  metadata_title: string;
  metadata_description: string;
  metadata_company: string;
  metadata_location: string;
  metadata_experience: string;
  metadata_bio: string;
  social_links: string[];
  portfolio_url: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [skills, setSkills] = useState(searchParams?.get('skills') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [company, setCompany] = useState(searchParams?.get('company') || '');
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [locations, setLocations] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  
  const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';

  // Load filter options
  useEffect(() => {
    fetchLocations();
    fetchCompanies();
  }, []);

  // Perform search when params change
  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${MANAGER_URL}/search/locations`);
      const data = await res.json();
      setLocations(data.locations || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${MANAGER_URL}/search/companies`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const performSearch = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (skills) params.set('skills', skills);
      if (location) params.set('location', location);
      if (company) params.set('company', company);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await fetch(`${MANAGER_URL}/search?${params}`);
      const data = await res.json();

      setResults(data.results || []);
      setPagination(data.pagination);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (skills) params.set('skills', skills);
    if (location) params.set('location', location);
    if (company) params.set('company', company);
    router.push(`/search?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    performSearch(newPage);
  };

  return (
    <div className="min-h-screen bg-[#D8DAD3] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#566246] mb-2">
            Discover Amazing Portfolios
          </h1>
          <p className="text-gray-600">
            Find talented developers, designers, and creators on knowabt.me
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* General Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, skills, bio..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#566246] focus:border-transparent"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, Python"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#566246] focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bangalore, Mumbai..."
                list="locations-list"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#566246] focus:border-transparent"
              />
              <datalist id="locations-list">
                {locations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google, Microsoft..."
                list="companies-list"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#566246] focus:border-transparent"
              />
              <datalist id="companies-list">
                {companies.map((comp) => (
                  <option key={comp} value={comp} />
                ))}
              </datalist>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#566246] text-white font-semibold py-3 rounded-lg hover:bg-[#4A4A48] transition"
          >
            🔍 Search Portfolios
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-[#566246] border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            {/* Results Count */}
            {pagination && (
              <div className="mb-4 text-gray-600">
                Found <span className="font-semibold">{pagination.total}</span> portfolio{pagination.total !== 1 ? 's' : ''}
              </div>
            )}

            {/* Results Grid */}
            {results.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-2">No portfolios found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#566246] mb-2">
                        {result.metadata_title || result.name}
                      </h3>

                      {/* Location & Company */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.metadata_location && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            📍 {result.metadata_location}
                          </span>
                        )}
                        {result.metadata_company && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            🏢 {result.metadata_company}
                          </span>
                        )}
                        {result.metadata_experience && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            💼 {result.metadata_experience}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {result.metadata_bio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {result.metadata_bio}
                        </p>
                      )}

                      {/* Skills */}
                      {result.skills && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {result.skills.split(',').slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-[#D8DAD3] text-[#566246] rounded"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {result.social_links && result.social_links.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {result.social_links.slice(0, 4).map((link, idx) => {
                            const domain = new URL(link).hostname.replace('www.', '');
                            return (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 hover:text-[#566246] transition text-xs"
                                title={domain}
                              >
                                🔗
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* View Portfolio Button */}
                      <a
                        href={result.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-[#566246] text-white font-semibold py-2 rounded hover:bg-[#4A4A48] transition"
                      >
                        View Portfolio →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white rounded shadow">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 bg-white rounded shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
