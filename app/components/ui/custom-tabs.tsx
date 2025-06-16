"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Lock, Unlock } from "lucide-react"

interface CustomTabsProps {
  defaultValue: string
  children: React.ReactNode
  onTabChange?: () => void
  encryptionComplete?: boolean
  decryptionComplete?: boolean
}

export function CustomTabs({ defaultValue, children, onTabChange, encryptionComplete = false, decryptionComplete = false }: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  console.log('encryptionComplete:', encryptionComplete)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setContainerHeight(height)
    }
  }, [activeTab, children])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onTabChange?.()
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {!encryptionComplete && !decryptionComplete && (
        <div className="relative p-1 rounded-lg mb-6 bg-[rgba(12,117,111,0.1)]">
          <div className="grid grid-cols-2 relative">
            {/* Indicador animado */}
            <div
              className="absolute top-0 bottom-0 rounded-md transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: "#0C756F",
                left: activeTab === "encrypt" ? "0%" : "50%",
                width: "50%",
              }}
            />

            {/* Tabs */}
            <button
              onClick={() => handleTabChange("encrypt")}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                activeTab === "encrypt" ? "text-white" : "text-gray-600"
              }`}
            >
              <Lock className="w-4 h-4" />
              Encriptar
            </button>

            <button
              onClick={() => handleTabChange("decrypt")}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                activeTab === "decrypt" ? "text-white" : "text-gray-600"
              }`}
            >
              <Unlock className="w-4 h-4" />
              Desencriptar
            </button>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className="relative overflow-hidden transition-all duration-700 ease-in-out"
      >
        {children}
      </div>
    </Tabs>
  )
} 