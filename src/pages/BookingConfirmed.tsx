import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, MessageCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMemo } from "react";

const BookingConfirmed = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const bookingCode = useMemo(() => {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-2026-${rand}`;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-lg text-center">
          {/* Animated check icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <Check size={36} className="text-emerald-500" strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Reserva <span className="gold-text">confirmada!</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Seu pagamento foi aprovado e a reserva está garantida.
            </p>
          </motion.div>

          {/* Booking summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm p-6 mb-8 text-left"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Código da Reserva</span>
                <span className="text-sm font-bold font-mono text-primary">{bookingCode}</span>
              </div>
              {sessionId && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">ID do Pagamento</span>
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[180px]">{sessionId}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Você receberá um e-mail com os detalhes da reserva e instruções para a retirada do veículo.
              </p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/minha-conta"
              className="gold-gradient text-primary-foreground py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              Minhas Reservas
              <ChevronRight size={14} />
            </Link>
            <a
              href="https://wa.me/16892981754?text=Olá!%20Acabei%20de%20finalizar%20minha%20reserva%20e%20gostaria%20de%20mais%20informações."
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingConfirmed;
