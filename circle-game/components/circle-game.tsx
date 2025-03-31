"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import ScoreDisplay from "./score-display"
import StartScreen from "./start-screen"

export default function CircleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 500
    canvas.height = 500

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw points if any
    if (points.length > 0) {
      ctx.lineWidth = 4

      // Don't use a single stroke for rainbow effect
      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const hue = ((i * 360) / points.length) % 360
          ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`

          ctx.beginPath()
          ctx.moveTo(points[i - 1].x, points[i - 1].y)
          ctx.lineTo(points[i].x, points[i].y)
          ctx.stroke()
        }

        // Close the path if done drawing and has enough points
        if (points.length > 2 && !isDrawing) {
          const hue = 0 // Complete the circle with the starting color
          ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`
          ctx.beginPath()
          ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y)
          ctx.lineTo(points[0].x, points[0].y)
          ctx.stroke()
        }
      }
    }
  }, [points, isDrawing, gameStarted])

  const startGame = () => {
    setGameStarted(true)
    resetGame()
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!gameStarted) return

    setIsDrawing(true)
    setPoints([])
    setScore(null)

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    setPoints([{ x, y }])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    setPoints((prev) => [...prev, { x, y }])
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    setHasDrawn(true)

    if (points.length > 10) {
      const circleScore = calculateCircleScore(points)
      setScore(circleScore)
    } else {
      setScore(0)
    }
  }

  const calculateCircleScore = (points: Array<{ x: number; y: number }>): number => {
    // Find center of the drawn shape
    let sumX = 0,
      sumY = 0
    for (const point of points) {
      sumX += point.x
      sumY += point.y
    }

    const centerX = sumX / points.length
    const centerY = sumY / points.length

    // Calculate average radius
    let sumRadius = 0
    for (const point of points) {
      const dx = point.x - centerX
      const dy = point.y - centerY
      sumRadius += Math.sqrt(dx * dx + dy * dy)
    }
    const avgRadius = sumRadius / points.length

    // Calculate standard deviation of radius
    let sumSquaredDiff = 0
    for (const point of points) {
      const dx = point.x - centerX
      const dy = point.y - centerY
      const radius = Math.sqrt(dx * dx + dy * dy)
      sumSquaredDiff += Math.pow(radius - avgRadius, 2)
    }
    const stdDev = Math.sqrt(sumSquaredDiff / points.length)

    // Calculate circularity (lower is better)
    const circularity = stdDev / avgRadius

    // Convert to score (0-100)
    let score = 100 - circularity * 100

    // Penalize if too few points
    if (points.length < 50) {
      score *= points.length / 50
    }

    // Check if shape is closed
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const dx = firstPoint.x - lastPoint.x
    const dy = firstPoint.y - lastPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > avgRadius * 0.2) {
      score *= 0.8 // Penalize for not closing the circle
    }

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  const resetGame = () => {
    setPoints([])
    setScore(null)
    setHasDrawn(false)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="rounded-lg border-2 border-gray-700 touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {!gameStarted && <StartScreen onStart={startGame} />}

        {score !== null && <ScoreDisplay score={score} />}
      </div>

      {hasDrawn && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={resetGame}
          className="mt-6 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
        >
          Try Again
        </motion.button>
      )}
    </div>
  )
}

