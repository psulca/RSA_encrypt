"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Loader } from "@/app/components/ui/loader"
import { IconSvg } from "@/app/components/icons/iconSvg"
import { TxtSvg } from "@/app/components/icons/txtSvg"
import { TxtFileSvg } from "./icons/txtfileSvg"
import { CheckSvg } from "./icons/checkSvg"
import { CloseSvg } from "./icons/closeSvg"

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void
  isUploading: boolean
  dragOver: boolean
  setDragOver: (value: boolean) => void
  removeFile: () => void
  files: File[]
  uploadSuccess: boolean
}

export function FileUpload({
  onFilesSelected,
  isUploading,
  dragOver,
  setDragOver,
  removeFile,
  files,
  uploadSuccess,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const fileList = new DataTransfer()
        fileList.items.add(file)
        onFilesSelected(fileList.files)
      }
    },
    [onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  return (
    <div className="mb-8 transform transition-all duration-700 ease-in-out animate-in fade-in slide-in-from-top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Paso 1: Subir Archivo de Texto</h2>
      
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out ${
          isDragActive
            ? "bg-[#FDCF6F]/10"
            : files.length > 0 && uploadSuccess
            ? "border-transparent"
            : "border-gray-300 hover:border-[#FDCF6F] hover:bg-[#FDCF6F]/10"
        }`}
        style={{
          backgroundColor: files.length > 0 && uploadSuccess 
            ? "rgba(12, 117, 111, 0.1)" 
            : "",
          border: files.length > 0 && uploadSuccess ? "none" : ""
        }}
        onDragEnter={() => setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
      >
        <input {...getInputProps()} id="file-upload" />
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <IconSvg />
              <div className="absolute inset-0 flex items-center justify-center">
                <TxtSvg />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive || dragOver
                ? "Suelta el archivo aquí..."
                : "Arrastra y suelta un archivo .txt aquí, o haz clic para seleccionar"}
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
            <Loader />
          </div>
        )}
      </div>

      {/* Lista de archivos subidos */}
      {files.length > 0 && uploadSuccess && (
        <div className="mt-4 space-y-4 transform transition-all duration-700 ease-in-out opacity-100">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transform transition-all duration-500 ease-in-out"
              >
                <div className="flex items-center gap-3">
                  <TxtFileSvg />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                  <span className="text-xs font-medium" style={{ color: "#0C756F" }}>
                    Éxito
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSvg />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile()
                    }}
                    className="p-1 hover:bg-red-100 rounded transition-colors group"
                  >
                    <CloseSvg />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 