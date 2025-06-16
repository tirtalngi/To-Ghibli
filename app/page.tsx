"use client"

import GhibliConverter from "@/components/ui/ghibli-converter"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ghibli Style Converter</h1>
          <p className="text-gray-400">Transform your photos into beautiful Studio Ghibli style artwork</p>
        </div>

        <GhibliConverter />
      </div>
    </div>
  )
}
