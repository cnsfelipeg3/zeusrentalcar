import { Instagram, MapPin, MessageCircle } from "lucide-react";
import zeusLogo from "@/assets/zeus-logo.png";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contato" className="py-16 bg-black/50 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <img src={zeusLogo} alt="Zeus Rental Car" className="h-28 w-auto mx-auto" />

        <p className="mt-4 text-muted-foreground font-light italic tracking-wide max-w-md mx-auto">
          {t.footer.tagline}
        </p>

        <a
          href="https://wa.me/16892981754"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 gold-gradient text-primary-foreground px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={18} />
          {t.footer.whatsapp}
        </a>

        <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground text-sm">
          <a
            href="https://instagram.com/zeusrentalcar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Instagram size={18} />
            @zeusrentalcar
          </a>
          <span className="flex items-center gap-2">
            <MapPin size={18} />
            Orlando, FL — EUA
          </span>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/50">
          {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
