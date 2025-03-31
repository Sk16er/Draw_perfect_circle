"use client"

import { motion } from "framer-motion"
import RainbowEffect from "./rainbow-effect"

interface ScoreDisplayProps {
  score: number
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 50) return "text-orange-400"
    return "text-red-400"
  }

  // Determine message based on score
  const getMessage = () => {
    if (score >= 95) return "Perfect!"
    if (score >= 90) return "Amazing!"
    if (score >= 80) return "Great job!"
    if (score >= 70) return "Pretty good!"
    if (score >= 50) return "Not bad!"
    if (score >= 30) return "Keep practicing!"
    return "Try again!"
  }

  // Show rainbow effect for high scores
  const showRainbow = score >= 90

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg overflow-hidden"
    >
      {showRainbow && <RainbowEffect active={true} />}

      <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2, type: "spring" }} className="z-10">
        <h2 className="text-2xl font-bold mb-2">Your score:</h2>
        <div className={`text-7xl font-bold mb-4 ${getColor()}`}>{score}</div>
        <p className="text-xl">{getMessage()}</p>
      </motion.div>
    </motion.div>
  )
}

