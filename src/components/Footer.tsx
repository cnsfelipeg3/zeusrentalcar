import { Instagram, MapPin, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer id="contato" className="py-16 bg-black/50 border-t border-white/5">
    <div className="container mx-auto px-4 text-center">
      <span className="text-3xl font-black uppercase tracking-wider gold-text">Zeus</span>
      <span className="text-sm font-light tracking-[0.3em] text-muted-foreground uppercase ml-2">
        Rental Car
      </span>

      <p className="mt-4 text-muted-foreground font-light italic tracking-wide max-w-md mx-auto">
        Zeus Rental Car — Concierge premium para brasileiros em Orlando.
      </p>

      <a
        href="https://wa.me/14075551234"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 gold-gradient text-primary-foreground px-8 py-4 rounded-md text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        <MessageCircle size={18} />
        Fale Conosco no WhatsApp
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
        © 2025 Zeus Rental Car. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
