"use client";

import Lottie from "lottie-react";
import infoWave from "./info-wave.json";
import { COLORS } from "../config";

export default function InfoPage() {
  return (
    <div className="min-h-screen" style={{ background: "#D8DAD3" }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 rounded-full bg-white shadow flex items-center justify-center">
            <Lottie
              animationData={infoWave}
              loop
              // className="w-12 h-12"
              aria-label="Information"
            />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-semibold" style={{ color: "#4A4A48" }}>
            knowabt.me Information
          </h1>
          <p className="text-xs" style={{ color: "#4A4A48" }}>Everything you need to know, in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section id="features" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>Features</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              Lightning-fast hosting, automatic builds from your Git repo, and a clean public profile optimized
              for discoverability.
            </p>
          </section>

          <section id="how-it-works" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>How it Works</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              Submit your Git repo, claim your subdomain, and we build + deploy your static portfolio automatically.
            </p>
          </section>

          <section id="pricing" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>Pricing</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>Free to use. No credit card required.</p>
          </section>

          <section id="faq" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>FAQ</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              Have questions? Reach out and we’ll help you get deployed quickly.
            </p>
          </section>

          <section id="about" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>About Us</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              knowabt.me helps developers and creators showcase their work with a fast, polished portfolio.
            </p>
          </section>

          <section id="contact" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>Contact</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              Email us at{' '}
              <a href="mailto:support@knowabt.me" style={{ color: "#566246" }} className="font-medium">
                support@knowabt.me
              </a>.
            </p>
          </section>

          <section id="terms" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>Terms of Service</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              By using knowabt.me, you agree to follow acceptable use and content guidelines.
            </p>
          </section>

          <section id="privacy" className="bg-white rounded-3xl shadow p-6 border border-[#566246]/10 md:col-span-2">
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#4A4A48" }}>Privacy Policy</h2>
            <p className="text-sm" style={{ color: "#4A4A48" }}>
              We store only what’s necessary to deploy and display your portfolio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
