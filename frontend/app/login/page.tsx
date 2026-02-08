'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const MANAGER_URL = process.env.NEXT_PUBLIC_MANAGER_URL || 'http://localhost:3000';

    useEffect(() => {
        // Check if user is already logged in
        fetch(`${MANAGER_URL}/auth/user`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    // Already logged in, redirect to home
                    router.push('/');
                } else {
                    setLoading(false);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    }, [router, MANAGER_URL]);

    const handleGitHubLogin = () => {
        // Redirect to GitHub OAuth
        window.location.href = `${MANAGER_URL}/auth/github`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8DAD3' }}>
                <div className="text-2xl font-light" style={{ color: '#4A4A48' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#D8DAD3' }}>
            {/* Header */}
            {/* <header className="px-8 py-6">
                <div className="flex items-center gap-3">
                    <Image
                        src="/Remove-background-project-cropped.svg"
                        alt="knowabt.me logo"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <h1 className="text-2xl" style={{ color: '#4A4A48' }}>
                        <span className="font-light">knowabt</span>
                        <span className="font-bold">.me</span>
                    </h1>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div 
                        className="rounded-2xl shadow-2xl p-8 sm:p-12"
                        style={{ backgroundColor: '#FFFFFF' }}
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <Image
                                src="/Remove-background-project-cropped.svg"
                                alt="knowabt.me"
                                width={80}
                                height={80}
                                className="rounded-xl"
                            />
                        </div>

                        {/* Title */}
                        <h2 
                            className="text-3xl font-bold text-center mb-2"
                            style={{ color: '#4A4A48' }}
                        >
                            Welcome Back
                        </h2>
                        <p 
                            className="text-center mb-8 text-sm"
                            style={{ color: '#566246' }}
                        >
                            Sign in to manage your portfolios
                        </p>

                        {/* GitHub Login Button */}
                        <button
                            onClick={handleGitHubLogin}
                            className="w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            style={{ backgroundColor: '#24292e' }}
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                            Sign in with GitHub
                        </button>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: '#D8DAD3' }}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span 
                                    className="px-4 bg-white font-medium"
                                    style={{ color: '#566246' }}
                                >
                                    Why GitHub?
                                </span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3 mb-8">
                            {[
                                { icon: '🚀', text: 'Quick and secure authentication' },
                                { icon: '📁', text: 'Direct access to your repositories' },
                                { icon: '⚡', text: 'Deploy portfolios in seconds' }
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-2xl">{benefit.icon}</span>
                                    <span 
                                        className="text-sm font-medium"
                                        style={{ color: '#4A4A48' }}
                                    >
                                        {benefit.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Privacy Note */}
                        <p 
                            className="text-xs text-center leading-relaxed"
                            style={{ color: '#566246' }}
                        >
                            We only request access to your public repositories. 
                            Your data is secure and never shared with third parties.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-sm" style={{ color: '#566246' }}>
                            Don't have a GitHub account?{' '}
                            <a 
                                href="https://github.com/signup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold hover:underline"
                                style={{ color: '#4A4A48' }}
                            >
                                Sign up on GitHub
                            </a>
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-4 text-sm font-medium hover:underline"
                            style={{ color: '#566246' }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
