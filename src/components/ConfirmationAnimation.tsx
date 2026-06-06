"use client";

import { motion } from "framer-motion";
import { HiCheckCircle, HiClock } from "react-icons/hi";

export default function ConfirmationAnimation({ isPaid }: { isPaid: boolean }) {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isPaid ? "bg-green-100" : "bg-amber-100"
        }`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {isPaid ? (
            <HiCheckCircle className="text-green-600 text-4xl" />
          ) : (
            <HiClock className="text-amber-600 text-4xl" />
          )}
        </motion.div>
      </motion.div>

      {isPaid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-green-400 rounded-full"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 80,
                y: Math.sin((i * 60 * Math.PI) / 180) * 80,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            />
          ))}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
      >
        {isPaid ? "Booking Confirmed!" : "Booking Reserved!"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 max-w-md mx-auto"
      >
        {isPaid
          ? "Your booking has been confirmed. A confirmation email has been sent."
          : "Your booking has been reserved. Please pay at the hotel to confirm."}
      </motion.p>
    </div>
  );
}
