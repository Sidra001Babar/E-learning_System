import { motion } from "framer-motion";

export default function AnimatedCard({ children, delay = 0 }) {
  return (
    <motion.div
      className="w-full max-w-md bg-white rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
