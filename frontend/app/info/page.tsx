import { COLORS } from "../config";

export default function InfoPage() {
  return (
    <div style={{ background: COLORS.primary }} className="min-h-screen w-full font-sans">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: COLORS.textDark }}>
          knowabt.me Information
        </h1>

        <section id="features" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>Features</h2>
          <p style={{ color: COLORS.textDark }}>
            Lightning-fast portfolio hosting, automatic builds from your Git repo, and a clean public profile
            optimized for discoverability.
          </p>
        </section>

        <section id="how-it-works" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>How it Works</h2>
          <p style={{ color: COLORS.textDark }}>
            Submit your Git repo, claim your subdomain, and we build + deploy your static portfolio automatically.
          </p>
        </section>

        <section id="pricing" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>Pricing</h2>
          <p style={{ color: COLORS.textDark }}>
            Free to use. No credit card required.
          </p>
        </section>

        <section id="faq" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>FAQ</h2>
          <p style={{ color: COLORS.textDark }}>
            Have questions? Reach out and we’ll help you get deployed quickly.
          </p>
        </section>

        <section id="about" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>About Us</h2>
          <p style={{ color: COLORS.textDark }}>
            knowabt.me helps developers and creators showcase their work with a fast, polished portfolio.
          </p>
        </section>

        <section id="contact" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>Contact</h2>
          <p style={{ color: COLORS.textDark }}>
            Email us at <a href="mailto:support@knowabt.me" style={{ color: COLORS.secondary }}>support@knowabt.me</a>.
          </p>
        </section>

        <section id="terms" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>Terms of Service</h2>
          <p style={{ color: COLORS.textDark }}>
            By using knowabt.me, you agree to follow acceptable use and content guidelines.
          </p>
        </section>

        <section id="privacy" className="mb-10">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: COLORS.secondary }}>Privacy Policy</h2>
          <p style={{ color: COLORS.textDark }}>
            We store only what’s necessary to deploy and display your portfolio.
          </p>
        </section>
      </div>
    </div>
  );
}
