"use client"

import { motion } from "framer-motion"

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg"
    >
      <div className="text-center p-8 max-w-xs">
        <h2 className="text-2xl font-bold mb-4">Draw a Perfect Circle</h2>
        <p className="mb-6">Use your mouse or finger to draw a circle. Try to make it as perfect as possible!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-3 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-200 transition-colors"
        >
          Start Game
        </motion.button>
      </div>
    </motion.div>
  )
}

