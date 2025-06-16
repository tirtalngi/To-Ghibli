"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImageIcon, Download, AlertCircle, X } from "lucide-react"
import { IOSpinner } from "./spinner"

interface GhibliConverterProps {
  className?: string
}

export default function GhibliConverter({ className }: GhibliConverterProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [result, setResult] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setError(null)
      setResult(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/ghibli", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data.data)
      } else {
        setError(data.error || "Failed to convert image")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.convertedImageUrl) return

    try {
      const response = await fetch(result.convertedImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `ghibli-${selectedFile?.name || "converted"}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* File Selection Area */}
      <div className="space-y-4">
        {/* Buttons - Centered */}
        <div className="flex items-center justify-center gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

          <button
            onClick={handleSelectClick}
            className="h-10 px-4 bg-[#131316] text-white text-[13px] font-normal rounded-[99px] shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none hover:bg-[#1a1a1f] transition-colors duration-200 flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Select Image
          </button>

          <AnimatePresence>
            {selectedFile && !isUploading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleUpload}
                className="h-10 px-4 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] text-white text-[13px] font-medium rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200 flex items-center gap-2"
              >
                Convert to Ghibli
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="h-10 px-4 bg-[#131316] text-white text-[13px] font-normal rounded-[99px] shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none flex items-center gap-2"
              >
                <IOSpinner />
                Converting...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected File Info with Cancel Button */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between text-sm text-gray-400 bg-[#1a1a1f] px-3 py-2 rounded-lg border border-gray-800"
            >
              <span>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                onClick={handleCancel}
                className="ml-2 p-1 hover:bg-red-500/20 rounded-full transition-colors duration-200 group"
                title="Remove image"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview and Result Area - Single Column Layout */}
      <div className="space-y-6">
        {/* Original Image Preview */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <h3 className="text-white text-sm font-medium text-center">Original Image</h3>
              <div className="relative bg-[#1a1a1f] rounded-lg border border-gray-800 overflow-hidden">
                <img src={previewUrl || "/placeholder.svg"} alt="Original" className="w-full h-80 object-cover" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Separator Line */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="flex justify-center"
            >
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Converted Image Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="relative bg-[#1a1a1f] rounded-lg border border-gray-800 overflow-hidden">
                <img
                  src={result.convertedImageUrl || "/placeholder.svg"}
                  alt="Ghibli Style"
                  className="w-full h-80 object-cover"
                />
              </div>
              <p className="text-xs text-gray-400 text-center">{result.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg border border-red-800/30"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Button - Moved to center bottom */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleDownload}
              className="h-10 px-4 bg-gradient-to-b from-[#7c5aff] to-[#6c47ff] text-white text-[13px] font-medium rounded-[99px] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.16),0px_1px_2px_0px_rgba(0,0,0,0.20)] hover:from-[#8f71ff] hover:to-[#7c5aff] active:from-[#6c47ff] active:to-[#5835ff] transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Made by tirtalngi */}
      <div className="text-center pt-8 border-t border-gray-800/50">
        <p className="text-gray-500 text-xs">Made by tirtalngi</p>
      </div>
    </div>
  )
}
