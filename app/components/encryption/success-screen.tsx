"use client"

import Image from "next/image"
import { CheckCircle, Download, FileUp, Key } from "lucide-react"
import { RSAKeys } from "@/utils/rsa"

interface EncryptionSuccessScreenProps {
  onDownloadEncrypted: () => void
  onEncryptAnother: () => void
  generatedKeys: RSAKeys | null
}

export function EncryptionSuccessScreen({
  onDownloadEncrypted,
  onEncryptAnother,
  generatedKeys,
}: EncryptionSuccessScreenProps) {
  return (
    <div className="text-center space-y-6 transform transition-all duration-700 ease-in-out opacity-100 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-center">
        <Image
          src="/icons/encrypt_o.svg"
          alt="Encrypted File"
          width={80}
          height={100}
          className="animate-in zoom-in-50 duration-500 ease-out"
        />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">¡Archivo Encriptado Exitosamente!</h2>
      <p className="text-gray-600">Tu archivo ha sido encriptado de forma segura.</p>

      
    </div>
  )
} 