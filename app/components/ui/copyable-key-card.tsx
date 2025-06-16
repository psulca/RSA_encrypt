"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CopyableKeyCardProps {
  title: string
  keyData: { n: number; e?: number; d?: number }
  type: "public" | "private"
}

export function CopyableKeyCard({ title, keyData, type }: CopyableKeyCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const textToCopy = `${title}:\nn: ${keyData.n}\n${type === "public" ? "e" : "d"}: ${
      keyData[type === "public" ? "e" : "d"]
    }`

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  return (
    <div className="p-3 bg-white border relative rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <button
          onClick={copyToClipboard}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Copiar clave"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-600">n: {keyData.n}</p>
      <p className="text-sm text-gray-600">
        {type === "public" ? "e" : "d"}: {keyData[type === "public" ? "e" : "d"]}
      </p>
      {copied && (
        <div className="absolute top-2 right-8 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">¡Copiado!</div>
      )}
    </div>
  )
} 