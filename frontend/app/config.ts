// config.ts

export const COLORS = {
  primary: "#D8DAD3", // near to white
  secondary: "#566246", // olive green
  accent: "#4A4A48", // charcoal
  highlight: "#D8DAD3", // use near white for highlight
  card: "#fff", // white for card backgrounds for contrast
  white: "#fff",
  textDark: "#4A4A48",
  textLight: "#fff",
};

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How it works", href: "#how" },
  { label: "Top Repos", href: "#toprepos" },
  { label: "Get Started", href: "#form" },
];

export const HERO = {
  title: "Host your web page in seconds.",
  subtitle: "Showcase your work, skills, and more.",
  description:
    "Connect your public git repo, fill in your info, and get a live site instantly. Powered by Caddy for blazing fast static hosting.",
  ctaPrimary: { label: "Get Started", href: "#form" },
  ctaSecondary: { label: "View Top Repos", href: "#toprepos" },
  image: "/globe.svg",
};

export const SERVICES = [
  {
    icon: "/file.svg",
    title: "Custom Domain",
    description: "Get a unique subdomain or use your own domain for your site.",
  },
  {
    icon: "/next.svg",
    title: "Git Integration",
    description:
      "Connect your public git repo. We build and deploy your static site automatically.",
  },
  {
    icon: "/globe.svg",
    title: "Fast Hosting",
    description:
      "Served globally via Caddy for speed, security, and reliability.",
  },
];

export const HOW_IT_WORKS = [
  {
    title: "1. Fill the Form",
    description: "Provide your domain, public git repo URL, location, and skills.",
  },
  {
    title: "2. We Build",
    description: "We fetch your repo, build your static site, and set up hosting.",
  },
  {
    title: "3. Go Live!",
    description: "Your site is live on your domain, ready to share with the world.",
  },
];

export const FORM = {
  title: "Ready to get started?",
  description: "Fill out a quick form to host your site. We’ll handle the rest!",
  cta: { label: "Fill the Hosting Form", href: "#" },
};

export const TOP_REPOS = [
  {
    name: "Awesome Portfolio",
    url: "https://github.com/example/awesome-portfolio",
    location: "San Francisco, USA",
    skills: ["React", "Next.js", "TailwindCSS"],
  },
  {
    name: "Dev Blog",
    url: "https://github.com/example/dev-blog",
    location: "Berlin, Germany",
    skills: ["Markdown", "Node.js"],
  },
  {
    name: "Design Studio",
    url: "https://github.com/example/design-studio",
    location: "London, UK",
    skills: ["Figma", "UI/UX"],
  },
  {
    name: "Marketing Hub",
    url: "https://github.com/example/marketing-hub",
    location: "Toronto, Canada",
    skills: ["SEO", "Analytics"],
  },
  {
    name: "Startup Landing",
    url: "https://github.com/example/startup-landing",
    location: "Bangalore, India",
    skills: ["Startup", "Landing Page"],
  },
  {
    name: "Open Source Docs",
    url: "https://github.com/example/open-source-docs",
    location: "Remote",
    skills: ["Docs", "Open Source"],
  },
  {
    name: "Portfolio Pro",
    url: "https://github.com/example/portfolio-pro",
    location: "Sydney, Australia",
    skills: ["Portfolio", "Personal Brand"],
  },
  {
    name: "Resume Builder",
    url: "https://github.com/example/resume-builder",
    location: "New York, USA",
    skills: ["Resume", "Builder"],
  },
  {
    name: "Freelance Space",
    url: "https://github.com/example/freelance-space",
    location: "Paris, France",
    skills: ["Freelance", "Marketplace"],
  },
  {
    name: "Web Skills",
    url: "https://github.com/example/web-skills",
    location: "Tokyo, Japan",
    skills: ["Web", "Skills"],
  },
];

export const FOOTER = {
  left: "knowabt.me ",
  right: "Made with ❤️ for creators & devs",
};
