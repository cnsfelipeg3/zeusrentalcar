import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";

import { useLanguage } from "@/i18n/LanguageContext";
import { Language, languageLabels, languageFlags } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { label: t.nav.fleet, href: "#frota" },
    { label: t.nav.howItWorks, href: "#como-funciona" },
    { label: t.nav.whyZeus, href: "#por-que" },
    { label: t.nav.contact, href: "#contato" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const languages: Language[] = ["pt", "en", "es", "it", "de", "fr"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="#" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300">
          Home
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

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-300 outline-none">
              <Globe size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">{languageFlags[language]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/10">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`cursor-pointer gap-2 ${language === lang ? "text-primary font-semibold" : ""}`}
                >
                  <span>{languageFlags[lang]}</span>
                  <span>{languageLabels[lang]}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href="https://wa.me/16892981754"
            target="_blank"
            rel="noopener noreferrer"
            className="gold-gradient text-primary-foreground px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            {t.nav.book}
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

            {/* Mobile language switcher */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    language === lang
                      ? "gold-gradient text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {languageFlags[lang]} {languageLabels[lang]}
                </button>
              ))}
            </div>

            <a
              href="https://wa.me/14075551234"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient text-primary-foreground px-5 py-3 rounded-md text-sm font-bold uppercase tracking-wider text-center"
            >
              {t.nav.book}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
