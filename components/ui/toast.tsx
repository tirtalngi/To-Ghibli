"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader, CheckCircle, ImageIcon } from "lucide-react"

const CheckIcon = () => (
  <div className="p-0.5 bg-white/25 rounded-[99px] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.06)] shadow-[0px_1px_2px_-0.5px_rgba(0,0,0,0.06)] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.16)] border border-white/25 justify-center items-center gap-1.5 flex overflow-hidden">
    <CheckCircle className="w-3.5 h-3.5 text-white" />
  </div>
)

interface ToastProps {
  state: "idle" | "loading" | "success" | "error"
  onFileSelect?: (file: File) => void
  onUpload?: () => void
  selectedFile?: File | null
  result?: any
}

const saveStates = {
  idle: {
    icon: <ImageIcon className="w-[18px] h-[18px] text-white" />,
    text: "Select image to convert",
  },
  loading: {
    icon: <Loader className="w-[15px] h-[15px] animate-spin text-white" />,
    text: "Converting to Ghibli style...",
  },
  success: {
    icon: <CheckIcon />,
    text: "Image converted successfully!",
  },
  error: {
    icon: <ImageIcon className="w-[18px] h-[18px] text-red-400" />,
    text: "Conversion failed",
  },
}

export function Toast({ state, onFileSelect, onUpload, selectedFile, result }: ToastProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const currentState = saveStates[state]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onFileSelect?.(file)
    }
  }

  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = () => {
    if (selectedFile && onUpload) {
      onUpload()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="inline-flex h-10 items-center justify-center gap-4 px-1 py-0 bg-[#131316] rounded-[99px] overflow-hidden shadow-[0px_32px_64px_-16px_#0000004c,0px_16px_32px_-8px_#0000004c,0px_8px_16px_-4px_#0000003d,0px_4px_8px_-2px_#0000003d,0px_-8px_16px_-1px_#00000029,0px_2px_4px_-1px_#0000003d,0px_0px_0px_1px_#000000,inset_0px_0px_0px_1px_#ffffff14,inset_0px_1px_0px_#ffffff33] border-none">
        <CardContent className="flex items-center p-0">
          <motion.div
            className="inline-flex items-center justify-center gap-2 pl-1.5 pr-3 py-0"
            layout
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                {currentState.icon}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={state}
                className="text-white text-[13px] leading-5 font-normal whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
              >
                {currentState.text}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {(state === "idle" || state === "error") && (
              <motion.div
                className="inline-flex items-center gap-2 pl-0 pr-px py-0"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button
                  variant="ghost"
                  className="h-7 px-3 text-[13px] text-white hover:bg-white/10 hover:text-white rounded-[99px] transition-colors duration-200"
                  onClick={handleSelectClick}
                >
                  Select Image
                </Button>
                {selectedFile && (
                  <Button
                    className="h-7 px-3 py-0 rounded-[99px] text-[13px] font-medium text-white bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200"
                    onClick={handleUpload}
                  >
                    Convert to Ghibli
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Show selected file info */}
      {selectedFile && state === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm"
        >
          Selected: {selectedFile.name}
        </motion.div>
      )}

      {/* Show result */}
      {result && state === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-lg max-w-md"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Ghibli Style Conversion Complete!</h3>
          <div className="space-y-2">
            <img
              src={result.ghibliUrl || "/placeholder.svg"}
              alt="Ghibli style converted image"
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-600">{result.message}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Export other required components for compatibility
export type ToastActionElement = React.ReactNode
export const ToastProvider = ({ children }: { children: React.ReactNode }) => children
export const ToastViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />,
)
ToastViewport.displayName = "ToastViewport"
export const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={className} {...props} />,
)
ToastTitle.displayName = "ToastTitle"
export const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={className} {...props} />,
)
ToastDescription.displayName = "ToastDescription"
export const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={className} {...props} />,
)
ToastClose.displayName = "ToastClose"
export const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={className} {...props} />,
)
ToastAction.displayName = "ToastAction"
