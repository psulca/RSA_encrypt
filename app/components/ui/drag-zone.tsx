"use client"

import { useCallback } from "react"
import { TxtSvg } from "@/app/components/icons/txtSvg"
import { IconSvg } from "@/app/components/icons/iconSvg"

function Loader() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-[#0C756F]/10 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-[#0C756F] rounded-full animate-spin border-t-transparent"></div>
    </div>
  )
}

interface FileUploadProps {
  onFileSelect: (files: FileList) => void
  isDragOver: boolean
  onDragOver: (isDragOver: boolean) => void
  isUploading: boolean
  uploadSuccess: boolean
}

export function DragZone({ onFileSelect, isDragOver, onDragOver, isUploading, uploadSuccess }: FileUploadProps) {
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragOver(true)
    },
    [onDragOver],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragOver(false)
    },
    [onDragOver],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFileSelect(files)
      }
    },
    [onFileSelect, onDragOver],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFileSelect(files)
      }
    },
    [onFileSelect],
  )

  return (
    <div
      className={`relative rounded-xl p-12 text-center transition-all duration-500 ease-in-out border-2 border-dashed ${
        isDragOver ? "border-teal-500" : uploadSuccess ? "border-transparent" : "border-gray-300"
      }`}
      style={{
        backgroundColor: uploadSuccess ? "rgba(12, 117, 111, 0.1)" : isDragOver ? "#F9F6EE" : "#f9fafb",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".txt"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
        disabled={uploadSuccess}
      />

      <div 
        className="transition-all duration-1000 ease-in-out"
        
      >
        {uploadSuccess ? (
          <div className="flex flex-col items-center space-y-4 transform transition-all duration-700 ease-in-out">
            <div className={`transition-all duration-500 ease-in-out ${isUploading ? 'opacity-0' : 'opacity-100'}`}>
              <IconSvg />
            </div>
            <p className="text-lg font-medium transition-all duration-500 ease-in-out" style={{ color: "#0C756F" }}>
              El archivo ha sido subido
            </p>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className={`transition-all duration-500 ease-in-out ${!isUploading ? 'opacity-0' : 'opacity-100'}`}>
              <Loader />
            </div>
            <p className="text-lg font-medium text-gray-900">Tu archivo se está subiendo...</p>
            <p className="text-sm text-gray-500">Soporta: txt, Tamaño máximo 90MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className={`transition-all duration-500 ease-in-out ${isUploading ? 'opacity-0' : 'opacity-100'}`}>
              <TxtSvg />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Arrastra tu archivo aquí, o{" "}
                <label htmlFor="file-upload" className="text-teal-600 hover:text-teal-700 cursor-pointer underline">
                  Examinar
                </label>
              </p>
              <p className="text-sm text-gray-500">Soporta: txt, Tamaño máximo 90MB. Solo un archivo a la vez.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 