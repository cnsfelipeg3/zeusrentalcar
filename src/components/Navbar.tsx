import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Frota", href: "#frota" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Por que a Zeus", href: "#por-que" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl font-black uppercase tracking-wider gold-text">
            Zeus
          </span>
          <span className="text-xs font-light tracking-[0.3em] text-muted-foreground uppercase">
            Rental Car
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/14075551234"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-gradient text-primary-foreground px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Reservar
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/5 animate-fade-in">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/14075551234"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient text-primary-foreground px-5 py-3 rounded-md text-sm font-bold uppercase tracking-wider text-center"
            >
              Reservar
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
