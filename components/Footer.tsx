'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="text-center py-8 mt-12"
    >
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Built for Students Worldwide
      </p>
    </motion.footer>
  );
}

