import { Link } from "@tanstack/react-router";

const footerColumns = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About Us", href: "/" as const },
      { label: "Careers", href: "/" as const },
      { label: "Press Releases", href: "/" as const },
      { label: "Amazon Science", href: "/" as const },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on Amazon", href: "/" as const },
      { label: "Sell Under Amazon", href: "/" as const },
      { label: "Associates Program", href: "/" as const },
      { label: "Advertise Your Products", href: "/" as const },
    ],
  },
  {
    title: "Amazon Payment Products",
    links: [
      { label: "Business Card", href: "/" as const },
      { label: "Shop with Points", href: "/" as const },
      { label: "Reload Your Balance", href: "/" as const },
      { label: "Gift Cards", href: "/" as const },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", href: "/" as const },
      { label: "Returns & Replacements", href: "/" as const },
      { label: "Manage Your Content", href: "/" as const },
      { label: "Help", href: "/" as const },
    ],
  },
];

const legalLinks = [
  "Conditions of Use",
  "Privacy Notice",
  "Your Ads Privacy Choices",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer>
      <button
        type="button"
        className="w-full text-center py-3 text-white text-sm hover:opacity-80 transition-opacity"
        style={{ backgroundColor: "#37475A" }}
        onClick={scrollToTop}
      >
        Back to top
      </button>

      <div style={{ backgroundColor: "#232F3E" }} className="py-10 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-3 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#131921" }} className="py-6 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-2">
          <span
            className="text-white font-bold text-lg"
            style={{ fontFamily: "serif" }}
          >
            amazon
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((item) => (
              <Link
                key={item}
                to="/"
                className="text-gray-400 text-xs hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-gray-400 text-xs text-center">
            © {year} Amazon Clone. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
