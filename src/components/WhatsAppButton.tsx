import { motion } from "framer-motion";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.316 22.612c-.39 1.1-1.932 2.014-3.172 2.282-.85.18-1.96.324-5.698-1.226-4.784-1.982-7.862-6.834-8.1-7.15-.228-.316-1.916-2.55-1.916-4.864 0-2.314 1.212-3.45 1.642-3.924.39-.43 1.028-.634 1.64-.634.198 0 .376.01.536.018.472.02.708.048 1.02.788.39.924 1.34 3.27 1.458 3.508.12.238.238.554.08.87-.148.326-.278.47-.516.742-.238.272-.464.48-.702.774-.218.258-.464.534-.198.998.268.464 1.188 1.958 2.552 3.172 1.752 1.558 3.228 2.04 3.686 2.268.39.198.856.158 1.134-.138.354-.378.79-.998 1.234-1.612.316-.438.714-.494 1.142-.316.434.168 2.768 1.304 3.242 1.542.472.238.788.356.906.554.116.198.116 1.146-.274 2.246z" />
  </svg>
);

const WhatsAppButton = () => {
  const phoneNumber = "919876543210";
  const message = encodeURIComponent("Hi! I'm interested in your property listings. Can you help me?");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow md:hidden"
    >
      <WhatsAppIcon />
    </motion.a>
  );
};

export default WhatsAppButton;
