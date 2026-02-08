import Image from "next/image";
import { COLORS } from "../config";

export default function Footer() {
  return (
    <footer style={{ background: COLORS.secondary }} className="py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/Remove-background-project-cropped.svg"
                alt="Knowabt Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl" style={{ color: COLORS.white }}>
                <span className="font-light">knowabt</span>
                <span className="font-bold">.me</span>
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: COLORS.highlight }}>
              Host your portfolio in seconds. Be discovered by skills.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLORS.white }}>
              Discover
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/search?filter=skill"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Browse by Skill
                </a>
              </li>
              <li>
                <a
                  href="/search?filter=location"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Browse by Location
                </a>
              </li>
              <li>
                <a
                  href="/trending"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Trending Developers
                </a>
              </li>
              <li>
                <a
                  href="/repositories"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Top Repositories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLORS.white }}>
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/info#features"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/info#how-it-works"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="/info#pricing"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/info#faq"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: COLORS.white }}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/info#about"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/info#contact"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/info#terms"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/info#privacy"
                  className="text-sm hover:underline"
                  style={{ color: COLORS.highlight }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(216, 218, 211, 0.2)" }}
        >
          <p className="text-sm" style={{ color: COLORS.highlight }}>
            © {new Date().getFullYear()} <span className="font-light">knowabt</span>
            <span className="font-bold">.me</span>. All rights reserved. Made with{" "}
            <Image
              src="/love-svgrepo-com.svg"
              alt="Love"
              width={16}
              height={16}
              className="inline"
            />{" "}
            for developers.
          </p>
          <span className="text-sm font-semibold" style={{ color: COLORS.white }}>
            by server96
          </span>
        </div>
      </div>
    </footer>
  );
}
