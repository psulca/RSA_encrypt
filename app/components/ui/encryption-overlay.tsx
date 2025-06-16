"use client"

import { useState, useEffect } from "react"
import { TxtSvg } from "@/app/components/icons/txtSvg"
import { FileSvg } from "@/app/components/icons/fileSvg"
import { KeySvg } from "@/app/components/icons/keySvg"
import { EncryptSvg } from "@/app/components/icons/encryptSvg"

interface EncryptionOverlayProps {
  isVisible: boolean
  onComplete: () => void
  isEncrypting: boolean
}

export function EncryptionOverlay({ isVisible, onComplete, isEncrypting }: EncryptionOverlayProps) {
  const [animationStep, setAnimationStep] = useState(0)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setAnimationStep(0)
      setIsClosing(false)
      return
    }

    const steps = [
      { delay: 500, step: 1 },  // txt_o aparece en el centro
      { delay: 1000, step: 2 }, // txt_o se desplaza a la izquierda
      { delay: 1500, step: 3 }, // file_o aparece detrás
      { delay: 2000, step: 4 }, // file_o se mueve al centro, key_o aparece
      { delay: 2500, step: 5 }, // key_o se acerca al file_o
      { delay: 3000, step: 6 }, // Espera 0.5s
      { delay: 3500, step: 7 }, // file_o y key_o se desvanecen, encrypt_o aparece
    ]

    // Función para manejar la animación
    const handleAnimation = () => {
      let currentStep = 0
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setAnimationStep(steps[currentStep].step)
          currentStep++
        } else {
          // Cuando la animación termina, esperamos un momento y cerramos
          setTimeout(() => {
            setIsClosing(true)
            setTimeout(() => {
              onComplete()
            }, 500)
          }, 1000)
          clearInterval(interval)
        }
      }, 500) // Cada paso dura 500ms

      return interval
    }

    const animationInterval = handleAnimation()

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval)
      }
    }
  }, [isVisible, onComplete])

  if (!isVisible && !isClosing) return null

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-500 ease-in-out ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-500 ease-in-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="rounded-lg p-6" style={{ backgroundColor: "rgba(12, 117, 111, 0.1)" }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-8">Encriptando</h3>

          <div className="relative h-32 flex items-center justify-center mb-8">
            {/* txt_o.svg - Aparece en el centro, luego se mueve a la izquierda y desaparece */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 1 
                  ? animationStep >= 3 
                    ? "translateX(-110px) scale(0)" 
                    : "translateX(-110px) scale(1)"
                  : "translateX(0) scale(0)",
                zIndex: animationStep >= 3 ? 1 : 2,
              }}
            >
              <div className="relative">
                <TxtSvg />
                {/* Overlay para ocultar paths específicos cuando aparece file_o */}
                {animationStep >= 3 &&
                  <div className="absolute inset-0">
                    <svg width="60" height="75" viewBox="0 0 77 96" className="w-full h-full">
                      {/* Mantenemos solo los paths que NO deben desaparecer */}
                      <path
                        opacity="0.06"
                        d="M64.8827 80.187H11.6072C8.40675 80.187 5.8125 77.5926 5.8125 74.3923V5.79469C5.8125 2.59444 8.40675 0 11.6072 0H64.8827C68.0831 0 70.6774 2.59444 70.6774 5.79469V74.3921C70.6774 77.5926 68.0829 80.187 64.8827 80.187V80.187Z"
                        fill="#000201"
                      />
                      <path
                        d="M64.8826 0H59.0879C62.2883 0 64.8826 2.59444 64.8826 5.79469V74.3921C64.8826 77.5926 62.2881 80.1868 59.0879 80.1868H64.8826C68.083 80.1868 70.6773 77.5924 70.6773 74.3921V5.79469C70.6773 2.59444 68.0828 0 64.8826 0V0Z"
                        fill="#BCC6C5"
                      />
                      <path
                        d="M59.8693 17.3845H16.6206C16.0872 17.3845 15.6548 16.9521 15.6548 16.4187V9.65819C15.6548 9.12476 16.0872 8.69238 16.6206 8.69238H59.8692C60.4026 8.69238 60.835 9.12476 60.835 9.65819V16.4187C60.835 16.9521 60.4026 17.3845 59.8693 17.3845Z"
                        fill="#BCC6C5"
                      />
                      {/* Ocultamos los paths 1, 2, 7, 8, 9, 10, 11 con un rectángulo blanco */}
                      <rect x="14" y="24" width="49" height="50" fill="rgba(12, 117, 111, 0.1)" />
                    </svg>
                  </div>
                }
              </div>
            </div>

            {/* file_o.svg - Aparece detrás del txt_o, luego se mueve al centro y desaparece */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 3 
                  ? animationStep >= 6 
                    ? "translateX(0) scale(0)" 
                    : "translateX(0) scale(1)"
                  : "translateX(-60px) scale(0)",
                zIndex: 1,
              }}
            >
              <FileSvg />
            </div>

            {/* key_o.svg - Aparece desde la derecha, se mueve al centro y desaparece */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 4 
                  ? animationStep >= 6 
                    ? "translateX(0) scale(0)" 
                    : "translateX(0) scale(1)"
                  : "translateX(110px) scale(0)",
                zIndex: 2,
              }}
            >
              <KeySvg />
            </div>

            {/* encrypt_o.svg - Aparece cuando file_o y key_o se desvanecen */}
            <div
              className="absolute transition-transform duration-1000 ease-in-out"
              style={{
                transform: animationStep >= 7 ? "scale(1)" : "scale(0)",
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
                width: `${(animationStep / 7) * 100}%`,
                backgroundColor: "#FDCF6F",
              }}
            />
          </div>

          <p className="text-sm text-gray-600">
            {animationStep >= 7 ? "¡Encriptación completada!" : "Procesando archivo..."}
          </p>
        </div>
      </div>
    </div>
  )
} 