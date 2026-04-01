import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Up to 50% Off Electronics",
    subtitle: "Deals on laptops, phones, and more. Limited time offer!",
    cta: "Shop Electronics",
    slug: "electronics" as const,
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    accentColor: "#FF9900",
    badge: "Today's Deal",
  },
  {
    title: "Fresh Fashion Arrivals",
    subtitle: "Discover the latest styles and trends this season.",
    cta: "Explore Fashion",
    slug: "fashion" as const,
    gradient: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
    accentColor: "#FF9900",
    badge: "New Arrivals",
  },
  {
    title: "Home & Kitchen Essentials",
    subtitle: "Everything you need to create your perfect home.",
    cta: "Shop Home",
    slug: "home-kitchen" as const,
    gradient: "linear-gradient(135deg, #134e4a 0%, #065f46 100%)",
    accentColor: "#FF9900",
    badge: "Best Sellers",
  },
  {
    title: "Top Books of 2026",
    subtitle: "Expand your mind with our curated bestseller collection.",
    cta: "Browse Books",
    slug: "books" as const,
    gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
    accentColor: "#FF9900",
    badge: "Editor's Pick",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function handlePrev() {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }
  function handleNext() {
    setCurrent((c) => (c + 1) % slides.length);
  }

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "380px" }}
    >
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.gradient }}
      />

      <div className="relative h-full flex items-center px-16 max-w-[1500px] mx-auto">
        <div className="text-white max-w-lg animate-fade-in">
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: slide.accentColor, color: "#111" }}
          >
            {slide.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            {slide.title}
          </h2>
          <p className="text-lg text-gray-200 mb-6">{slide.subtitle}</p>
          <Link
            to="/category/$slug"
            params={{ slug: slide.slug }}
            className="inline-block font-bold py-3 px-8 rounded text-gray-900 transition-colors"
            style={{ backgroundColor: slide.accentColor }}
            data-ocid="hero.primary_button"
          >
            {slide.cta}
          </Link>
        </div>

        <div
          className="hidden md:block absolute right-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: slide.accentColor }}
        />
        <div
          className="hidden md:block absolute right-48 top-1/4 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: "white" }}
        />
      </div>

      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
        data-ocid="hero.secondary_button"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
        data-ocid="hero.secondary_button"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, i) => (
          <button
            type="button"
            key={s.badge}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor:
                i === current ? "#FF9900" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
