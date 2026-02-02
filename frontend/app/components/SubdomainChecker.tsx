'use client';

import { useState } from 'react';
import { COLORS } from '../config';

export default function SubdomainChecker() {
  const [subdomain, setSubdomain] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; message: string } | null>(null);

  const handleCheck = async () => {
    if (!subdomain.trim()) {
      setResult({ available: false, message: 'Please enter a subdomain' });
      return;
    }

    setChecking(true);
    setResult(null);

    try {
      const response = await fetch(`/api/subdomain-check?name=${encodeURIComponent(subdomain)}`);
      const data = await response.json();

      if (data.available) {
        setResult({ available: true, message: `${subdomain}.knowabt.me is available!` });
      } else {
        setResult({ available: false, message: 'This subdomain is already taken' });
      }
    } catch (error) {
      setResult({ available: false, message: 'Error checking availability' });
    } finally {
      setChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: COLORS.white }}
        >
          <h3 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: COLORS.textDark }}
          >
            Check Availability
          </h3>
          
          <div className="relative mb-4">
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              onKeyPress={handleKeyPress}
              placeholder="yourname"
              className="w-full px-6 py-4 pr-32 rounded-full border-2 text-lg focus:outline-none focus:border-opacity-100 transition"
              style={{ 
                borderColor: COLORS.secondary,
                color: COLORS.textDark
              }}
              disabled={checking}
            />
            <span 
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm font-medium"
              style={{ color: COLORS.accent }}
            >
              .knowabt.me
            </span>
          </div>

          <button
            onClick={handleCheck}
            disabled={checking || !subdomain.trim()}
            className="w-full py-4 rounded-full font-semibold text-lg shadow-lg hover:opacity-90 transition disabled:cursor-not-allowed"
            style={{ 
              background: '#3d4d32',
              color: 'rgb(216 218 211)'
            }}
          >
            {checking ? 'Checking...' : 'Check Availability'}
          </button>

          {result && (
            <div 
              className={`mt-4 p-4 rounded-lg text-center font-medium ${
                result.available ? 'bg-green-100' : 'bg-red-100'
              }`}
              style={{ 
                color: result.available ? '#166534' : '#991b1b'
              }}
            >
              {result.message}
              {result.available && (
                <a
                  href="/form"
                  className="block mt-3 px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
                  style={{ 
                    background: '#3d4d32',
                    color: 'rgb(216 218 211)'
                  }}
                >
                  Claim Now →
                </a>
              )}
            </div>
          )}
        </div>

        <p 
          className="text-center mt-4 text-sm"
          style={{ color: COLORS.accent }}
        >
          Enter your desired subdomain to check if it's available
        </p>
      </div>
    </div>
  );
}
