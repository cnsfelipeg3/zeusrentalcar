import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_URL = "https://wa.me/16892981754?text=" +
  encodeURIComponent("Olá, venho do site da Zeus e gostaria de realizar uma reserva!");

const WhatsAppBubble = () => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-200"
    aria-label="WhatsApp"
  >
    <MessageCircle size={26} fill="white" strokeWidth={0} />
  </motion.a>
);

export default WhatsAppBubble;
