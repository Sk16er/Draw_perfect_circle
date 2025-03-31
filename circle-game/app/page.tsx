import CircleGame from "@/components/circle-game"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Draw a Perfect Circle
      </h1>
      <CircleGame />
    </div>
  )
}

