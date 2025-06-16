"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Unlock } from "lucide-react"
import { Label } from "@/components/ui/label"

interface DecryptionSuccessScreenProps {
  fileName: string
  decryptedContent: string
  onDownload: () => void
  onDecryptAnother: () => void
}

export function DecryptionSuccessScreen({
  fileName,
  decryptedContent,
  onDownload,
  onDecryptAnother,
}: DecryptionSuccessScreenProps) {
  return (
    <div className="space-y-6 transform transition-all duration-700 ease-in-out opacity-100 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/icons/file_o.svg"
            alt="Decrypted File"
            width={80}
            height={100}
            className="animate-in zoom-in-50 duration-500 ease-out"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Archivo Desencriptado Exitosamente!</h2>
        <p className="text-gray-600">El contenido original ha sido recuperado.</p>
      </div>

      {/* Área de texto con contenido desencriptado */}
      <div className="space-y-2">
        <Label htmlFor="decrypted-content">Contenido Desencriptado:</Label>
        <textarea
          id="decrypted-content"
          value={decryptedContent}
          readOnly
          className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono resize-none"
          placeholder="El contenido desencriptado aparecerá aquí..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onDownload}
          className="hover:opacity-90 transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: "#FDCF6F",
            color: "#000201",
            border: "none",
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar Archivo Desencriptado
        </Button>

        <Button
          onClick={onDecryptAnother}
          variant="outline"
          className="border-2 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          style={{
            borderColor: "#0C756F",
            color: "#0C756F",
          }}
        >
          <Unlock className="w-4 h-4 mr-2" />
          Desencriptar Otro Archivo
        </Button>
      </div>
    </div>
  )
} 