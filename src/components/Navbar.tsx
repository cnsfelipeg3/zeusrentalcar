import { useState, useEffect } from "react";
import { Menu, X, Globe, Home, Sun, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "@/i18n/LanguageContext";
import { useThemeMode } from "@/i18n/ThemeContext";
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
  const { theme, toggleTheme } = useThemeMode();
  const navigate = useNavigate();

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
          ? "bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-foreground/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="/#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
          <Home size={20} />
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-300 outline-none">
              <Globe size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">{languageFlags[language]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-border/40">
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
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/30 animate-fade-in">
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

            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300 pt-2 border-t border-border/30 w-full"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
            </button>

            {/* Mobile language switcher - same dropdown style as desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300 outline-none pt-2 border-t border-border/30 w-full">
                <Globe size={16} />
                <span>Trocar idioma</span>
                <span className="ml-auto">{languageFlags[language]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-border/40">
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
