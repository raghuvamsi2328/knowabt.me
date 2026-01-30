import Image from "next/image";
import {
  COLORS,
  NAV_LINKS,
  HERO,
  SERVICES,
  HOW_IT_WORKS,
  FORM,
  TOP_REPOS,
  FOOTER,
} from "./config";

export default function Home() {
  return (
    <div
      style={{ background: COLORS.primary }}
      className="min-h-screen w-full font-sans"
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/window.svg"
            alt="Knowabt Logo"
            width={40}
            height={40}
          />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.textDark }}
          >
            knowabt.me
          </span>
        </div>
        <ul className="hidden md:flex gap-8 font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:underline"
                style={{ color: COLORS.textDark }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/form"
          className="px-5 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
          style={{ background: COLORS.white, color: COLORS.primary }}
        >
          Host Now
        </a>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-16 gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: COLORS.textDark }}>
            {HERO.title}
            <br />
            <span style={{ color: COLORS.secondary }}>{HERO.subtitle}</span>
          </h1>
          <p className="mb-8 max-w-xl" style={{ color: COLORS.accent }}>
            {HERO.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/form"
              className="px-6 py-3 rounded-full font-semibold shadow hover:opacity-90 transition"
              style={{ background: COLORS.white, color: COLORS.primary }}
            >
              {HERO.ctaPrimary.label}
            </a>
            <a
              href={HERO.ctaSecondary.href}
              className="border px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              style={{ borderColor: COLORS.white, color: COLORS.white }}
            >
              {HERO.ctaSecondary.label}
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src={HERO.image}
            alt="Hero"
            width={320}
            height={320}
            className="drop-shadow-xl"
          />
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        style={{ background: COLORS.secondary }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: '#D8DAD3' }}
          >
            Our Services
          </h2>
          <p
            className="mb-10"
            style={{ color: '#D8DAD3' }}
          >
            Host your portfolio, resume, or project site with a custom domain. Just
            link your public git repo and let us handle the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-lg p-6 shadow hover:shadow-lg transition"
                style={{ background: COLORS.card }}
              >
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={40}
                  height={40}
                  className="mb-4"
                />
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ color: COLORS.textDark }}
                >
                  {service.title}
                </h3>
                <p style={{ color: COLORS.textDark }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how"
        style={{ background: COLORS.highlight }}
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: COLORS.textDark }}
          >
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="flex-1 rounded-lg p-6 shadow"
                style={{ background: COLORS.card }}
              >
                <h4
                  className="font-semibold text-lg mb-2"
                  style={{ color: COLORS.textDark }}
                >
                  {step.title}
                </h4>
                <p style={{ color: COLORS.textDark }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Link Section */}
      <section
        id="form"
        style={{ background: COLORS.white }}
        className="py-16 px-4 text-center"
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: COLORS.textDark }}
        >
          {FORM.title}
        </h2>
        <p
          className="mb-6"
          style={{ color: COLORS.textDark }}
        >
          {FORM.description}
        </p>
        <a
          href="/form"
          className="inline-block px-8 py-4 rounded-full font-semibold shadow hover:opacity-90 transition text-lg"
          style={{ background: COLORS.primary, color: COLORS.textLight }}
        >
          {FORM.cta.label}
        </a>
      </section>

      {/* Top 10 Repos Section */}
      <section
        id="toprepos"
        style={{ background: COLORS.secondary }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: '#D8DAD3' }}
          >
            Top 10 Repos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TOP_REPOS.map((repo) => (
              <div
                key={repo.url}
                className="rounded-lg p-6 shadow hover:shadow-lg transition flex flex-col md:flex-row gap-4 items-center"
                style={{ background: COLORS.card }}
              >
                <div className="flex-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold hover:underline"
                    style={{ color: COLORS.secondary }}
                  >
                    {repo.name}
                  </a>
                  <div
                    className="text-sm mt-1"
                    style={{ color: COLORS.accent }}
                  >
                    {repo.location}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {repo.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: COLORS.highlight,
                          color: COLORS.accent,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ background: COLORS.primary, color: COLORS.textDark }}
        className="py-8 text-center mt-8"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-semibold">
            {FOOTER.left} &copy; {new Date().getFullYear()}
          </span>
          <span>{FOOTER.right}</span>
        </div>
      </footer>
    </div>
  );
}
