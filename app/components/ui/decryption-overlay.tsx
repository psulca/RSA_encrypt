"use client"

import { useState, useEffect } from "react"
import { EncryptSvg } from "@/app/components/icons/encryptSvg"
import { KeySvg } from "@/app/components/icons/keySvg"
import { FileSvg } from "@/app/components/icons/fileSvg"

interface DecryptionOverlayProps {
  isVisible: boolean
  onComplete: () => void
}

export function DecryptionOverlay({ isVisible, onComplete }: DecryptionOverlayProps) {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setAnimationStep(0)
      return
    }

    const steps = [
      // Aparece file_o en el centro
      () => setAnimationStep(1),
      // Aparece key_o desde la derecha
      () => setAnimationStep(2),
      // key_o se mueve al centro
      () => setAnimationStep(3),
      // Ambos desaparecen
      () => setAnimationStep(4),
      // Aparece encrypt_o
      () => setAnimationStep(5),
      // Finaliza
      () => {
        setAnimationStep(6)
        onComplete()
      },
    ]

    const timeouts = steps.map((step, index) =>
      setTimeout(step, index * 1000)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(12, 117, 111, 0.1)" }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-8">Desencriptando</h3>

          <div className="relative h-32 flex items-center justify-center mb-8">
            {/* file_o.svg - Aparece en el centro y desaparece */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 1 
                  ? animationStep >= 4 
                    ? "translateX(0) scale(0)" 
                    : "translateX(0) scale(1)"
                  : "translateX(0) scale(0)",
                zIndex: animationStep >= 4 ? 1 : 2,
              }}
            >
              <div className="relative">
                <FileSvg />
              </div>
            </div>

            {/* key_o.svg - Aparece desde la derecha, se mueve al centro y desaparece */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 2 
                  ? animationStep >= 4 
                    ? "translateX(0) scale(0)" 
                    : "translateX(0) scale(1)"
                  : "translateX(110px) scale(0)",
                zIndex: 2,
              }}
            >
              <KeySvg />
            </div>

            {/* encrypt_o.svg - Aparece cuando los otros desaparecen */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 5 ? "scale(1)" : "scale(0)",
                zIndex: 3,
              }}
            >
              <EncryptSvg />
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full rounded-full h-2 mb-4" style={{ backgroundColor: "#F0ECE1" }}>
            <div
              className="h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${(animationStep / 6) * 100}%`,
                backgroundColor: "#FDCF6F",
              }}
            />
          </div>

          <p className="text-sm text-gray-600">
            {animationStep < 6 ? "Procesando archivo..." : "¡Desencriptación completada!"}
          </p>
        </div>
      </div>
    </div>
  )
} 