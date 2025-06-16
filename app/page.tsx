"use client"

import { useState, useCallback, useEffect } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Unlock, Download, CheckCircle, FileUp, Key } from "lucide-react"
import { CustomTabs } from "@/app/components/ui/custom-tabs"
import { FileUpload } from "@/app/components/file-upload"
import { KeyGeneration } from "@/app/components/encryption/key-generation"
import { EncryptionSuccessScreen } from "@/app/components/encryption/success-screen"
import { DecryptionSuccessScreen } from "@/app/components/decryption/success-screen"
import { EncryptionOverlay } from "@/app/components/ui/encryption-overlay"
import { DecryptionOverlay } from "@/app/components/ui/decryption-overlay"
import { type RSAKeys, encryptFile, createEncryptedFile, decryptFile } from "@/utils/rsa"

export default function EncryptionApp() {
  const [encryptFiles, setEncryptFiles] = useState<File[]>([])
  const [decryptFiles, setDecryptFiles] = useState<File[]>([])
  const [encryptDragOver, setEncryptDragOver] = useState(false)
  const [decryptDragOver, setDecryptDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileContent, setFileContent] = useState<string>("")

  // Estados para el flujo de encriptación
  const [generatedKeys, setGeneratedKeys] = useState<RSAKeys | null>(null)
  const [step2Active, setStep2Active] = useState(false)
  const [step3Active, setStep3Active] = useState(false)
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null)

  // Estados para el flujo de desencriptación
  const [privateKeyN, setPrivateKeyN] = useState("")
  const [privateKeyD, setPrivateKeyD] = useState("")
  const [nIsValid, setNIsValid] = useState(false)
  const [dIsValid, setDIsValid] = useState(false)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [decryptionComplete, setDecryptionComplete] = useState(false)
  const [decryptedContent, setDecryptedContent] = useState("")
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptionComplete, setEncryptionComplete] = useState(false)
  console.log('encryptionComplete en page.tsx:', encryptionComplete)
  const [showDropzone, setShowDropzone] = useState(true)
  const [privateKey, setPrivateKey] = useState<{ n: bigint; d: bigint } | null>(null)
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (privateKeyN) {
      const num = Number.parseInt(privateKeyN)
      setNIsValid(!isNaN(num) && num > 0)
    } else {
      setNIsValid(false)
    }
  }, [privateKeyN])

  useEffect(() => {
    if (privateKeyD) {
      const num = Number.parseInt(privateKeyD)
      setDIsValid(!isNaN(num) && num > 0)
    } else {
      setDIsValid(false)
    }
  }, [privateKeyD])

  // Animación para mostrar dropzone cuando se reinicia
  useEffect(() => {
    if (!encryptionComplete && !decryptionComplete && !showDropzone) {
      setTimeout(() => {
        setShowDropzone(true)
      }, 100)
    }
  }, [encryptionComplete, decryptionComplete, showDropzone])

  const handleEncryptFiles = useCallback((files: FileList) => {
    if (files.length > 0) {
      const file = files[0]
      setEncryptFiles([file])
      setDecryptFiles([])
      
      // Leer el contenido del archivo
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
      }
      reader.readAsText(file)
      
      simulateUpload()
    }
  }, [])

  const handleFileContent = useCallback((content: string) => {
    setFileContent(content)
  }, [])

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadSuccess(false)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    setUploadSuccess(true)
    setStep2Active(true)
  }

  const removeFile = (index: number) => {
    if (encryptFiles.length > 0) {
      setEncryptFiles([])
    } else {
      setDecryptFiles([])
    }
    setUploadSuccess(false)
    setStep2Active(false)
    setGeneratedKeys(null)
    setEncryptionComplete(false)
    setDecryptionComplete(false)
    setPrivateKeyN("")
    setPrivateKeyD("")
    setDecryptedContent("")

    // Reset del input file para permitir subir archivos con el mismo nombre
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleKeysGenerated = (keys: RSAKeys | null) => {
    setGeneratedKeys(keys)
  }

  const processEncryption = async () => {
    if (!fileContent || !generatedKeys) return

    try {
      setIsEncrypting(true)
      const encryptedNumbers = await encryptFile(fileContent, generatedKeys.publicKey)
      const encryptedBlob = createEncryptedFile(encryptedNumbers, encryptFiles[0].name)
      setEncryptedBlob(encryptedBlob)
    } catch (error) {
      console.error('Error during encryption:', error)
      setIsEncrypting(false)
    }
  }

  const handleEncryptionComplete = () => {
    setIsEncrypting(false)
    setEncryptionComplete(true)
  }

  const downloadEncryptedFile = () => {
    if (!encryptedBlob || !encryptFiles[0]) return

    const element = document.createElement("a")
    element.href = URL.createObjectURL(encryptedBlob)
    element.download = `${encryptFiles[0].name.replace(".txt", "")}_encrypted.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const encryptAnotherFile = () => {
    setShowDropzone(false)
    setTimeout(() => {
      setEncryptFiles([])
      setUploadSuccess(false)
      setStep2Active(false)
      setGeneratedKeys(null)
      setEncryptionComplete(false)
      setEncryptedBlob(null)

      // Reset del input file
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }, 300)
  }

  const handlePrivateKeySubmit = (n: string, d: string) => {
    try {
      console.log('handlePrivateKeySubmit - Iniciando con valores:', { n, d })
      const nBigInt = BigInt(n)
      const dBigInt = BigInt(d)
      
      if (nBigInt <= 0n || dBigInt <= 0n) {
        console.error('handlePrivateKeySubmit - Error: n y d deben ser positivos')
        throw new Error("n y d deben ser positivos")
      }

      console.log('handlePrivateKeySubmit - Estableciendo clave privada')
      const newPrivateKey = { n: nBigInt, d: dBigInt }
      setPrivateKey(newPrivateKey)
      setStep2Active(false)
      setStep3Active(true)
      console.log('handlePrivateKeySubmit - Clave privada establecida y estados actualizados')
      
      // Iniciar la desencriptación con la nueva clave
      processDecryptionWithKey(newPrivateKey)
    } catch (error) {
      console.error("Error al procesar la clave privada:", error)
    }
  }

  const processDecryptionWithKey = async (key: { n: bigint; d: bigint }) => {
    console.log('processDecryptionWithKey - Iniciando con clave:', { n: key.n.toString(), d: key.d.toString() })
    
    if (!fileContent) {
      console.error('processDecryptionWithKey - Error: fileContent no existe')
      return
    }

    try {
      console.log('processDecryptionWithKey - Estableciendo isDecrypting a true')
      setIsDecrypting(true)
      
      console.log('processDecryptionWithKey - Llamando a decryptFile')
      const decryptedContent = await decryptFile(fileContent, key)
      console.log('processDecryptionWithKey - Contenido desencriptado recibido:', decryptedContent.substring(0, 100) + '...')
      
      const decryptedBlob = new Blob([decryptedContent], { type: 'text/plain' })
      console.log('processDecryptionWithKey - Blob creado')
      
      setDecryptedBlob(decryptedBlob)
      setDecryptedContent(decryptedContent)
      console.log('processDecryptionWithKey - Estados actualizados con contenido desencriptado')
    } catch (error) {
      console.error('processDecryptionWithKey - Error durante la desencriptación:', error)
      setIsDecrypting(false)
    }
  }

  const handleDecryptionComplete = () => {
    console.log('handleDecryptionComplete - Iniciando')
    setIsDecrypting(false)
    setDecryptionComplete(true)
    console.log('handleDecryptionComplete - Estados actualizados')
  }

  const downloadDecryptedFile = () => {
    const element = document.createElement("a")
    const file = new Blob([decryptedContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${decryptFiles[0]?.name.replace("_encrypted.txt", "").replace(".txt", "")}_decrypted.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const decryptAnotherFile = () => {
    setShowDropzone(false)
    setTimeout(() => {
      setDecryptFiles([])
      setUploadSuccess(false)
      setStep2Active(false)
      setDecryptionComplete(false)
      setPrivateKeyN("")
      setPrivateKeyD("")
      setDecryptedContent("")

      // Reset del input file
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encriptador de Archivos de Texto</h1>
          <p className="text-gray-600">Encripta y desencripta tus archivos de texto de forma segura usando RSA</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6 smooth-size">
            {/* Paso 1: Subir Archivo - GENERAL */}
            {!encryptionComplete && !decryptionComplete && showDropzone && (
              <FileUpload
                onFilesSelected={handleEncryptFiles}
                isUploading={isUploading}
                dragOver={encryptDragOver}
                setDragOver={setEncryptDragOver}
                removeFile={() => removeFile(0)}
                files={encryptFiles}
                uploadSuccess={uploadSuccess}
              />
            )}

            {/* Tabs - Solo aparecen después de subir archivo */}
            {uploadSuccess && (
              <div className="transform transition-all duration-700 ease-in-out">
                <CustomTabs 
                  defaultValue="encrypt"
                  onTabChange={() => {
                    setGeneratedKeys(null)
                  }}
                  encryptionComplete={encryptionComplete}
                  decryptionComplete={decryptionComplete}
                >
                  <TabsContent
                    value="encrypt"
                    className="space-y-6 transform transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-right-4"
                  >
                    {!encryptionComplete ? (
                      <>
                        {/* Paso 2: Generar Claves */}
                        {step2Active && (
                          <div
                            className={`space-y-4 transform transition-all duration-700 ease-in-out ${
                              step2Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                          >
                            <KeyGeneration onKeysGenerated={handleKeysGenerated} />
                          </div>
                        )}

                        {/* Botón Final de Encriptar */}
                        {generatedKeys && (
                          <Button
                            onClick={processEncryption}
                            className="w-full hover:opacity-90 transition-all duration-300 ease-in-out"
                            style={{
                              backgroundColor: "#FDCF6F",
                              color: "#000201",
                              border: "none",
                            }}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Encriptar Archivo
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <EncryptionSuccessScreen
                          onDownloadEncrypted={downloadEncryptedFile}
                          onEncryptAnother={encryptAnotherFile}
                          generatedKeys={generatedKeys}
                        />
                        {encryptionComplete && (
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Button
                                onClick={downloadEncryptedFile}
                                className="flex-1 hover:opacity-90 transition-all duration-300 ease-in-out"
                                style={{
                                  backgroundColor: "#FDCF6F",
                                  color: "#000201",
                                  border: "none",
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar Archivo Encriptado
                              </Button>
                              <Button
                                onClick={encryptAnotherFile}
                                variant="outline"
                                className="flex-1"
                              >
                                Encriptar Otro Archivo
                              </Button>
                            </div>
                            <Button
                              onClick={() => {
                                if (!generatedKeys) return;
                                const publicKeyBlob = new Blob(
                                  [`n=${generatedKeys.publicKey.n}\ne=${generatedKeys.publicKey.e}`],
                                  { type: "text/plain" }
                                );
                                const publicKeyUrl = URL.createObjectURL(publicKeyBlob);
                                const publicKeyLink = document.createElement("a");
                                publicKeyLink.href = publicKeyUrl;
                                publicKeyLink.download = "clave_publica.txt";
                                document.body.appendChild(publicKeyLink);
                                publicKeyLink.click();
                                document.body.removeChild(publicKeyLink);
                                URL.revokeObjectURL(publicKeyUrl);

                                const privateKeyBlob = new Blob(
                                  [`n=${generatedKeys.privateKey.n}\nd=${generatedKeys.privateKey.d}`],
                                  { type: "text/plain" }
                                );
                                const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
                                const privateKeyLink = document.createElement("a");
                                privateKeyLink.href = privateKeyUrl;
                                privateKeyLink.download = "clave_privada.txt";
                                document.body.appendChild(privateKeyLink);
                                privateKeyLink.click();
                                document.body.removeChild(privateKeyLink);
                                URL.revokeObjectURL(privateKeyUrl);
                              }}
                              className="w-full hover:opacity-90 transition-all duration-300 ease-in-out"
                              style={{
                                backgroundColor: "#0C756F",
                                color: "white",
                                border: "none",
                              }}
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Descargar Claves
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="decrypt"
                    className="space-y-6 transform transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-left-4"
                  >
                    {!decryptionComplete ? (
                      <>
                        {/* Paso 2: Ingresar Clave Privada */}
                        {step2Active && (
                          <div className="space-y-4 transform transition-all duration-700 ease-in-out opacity-100 px-6">
                            <h2 className="text-xl font-semibold text-gray-900">Paso 2: Ingresar Clave Privada</h2>
                            <p className="text-gray-600">
                              Ingresa la clave privada que guardaste previamente para desencriptar el archivo.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="private-n">Valor N de la clave privada</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="private-n"
                                    type="number"
                                    value={privateKeyN}
                                    onChange={(e) => setPrivateKeyN(e.target.value)}
                                    placeholder="Ingresa el valor N"
                                  />
                                  {privateKeyN && (
                                    <span className={nIsValid ? "text-green-500" : "text-red-500"}>
                                      {nIsValid ? "✓" : "✗"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="private-d">Valor D de la clave privada</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="private-d"
                                    type="number"
                                    value={privateKeyD}
                                    onChange={(e) => setPrivateKeyD(e.target.value)}
                                    placeholder="Ingresa el valor D"
                                  />
                                  {privateKeyD && (
                                    <span className={dIsValid ? "text-green-500" : "text-red-500"}>
                                      {dIsValid ? "✓" : "✗"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => {
                                console.log('Botón de desencriptación - Click')
                                console.log('Valores actuales:', {
                                  privateKeyN,
                                  privateKeyD,
                                  nIsValid,
                                  dIsValid
                                })
                                handlePrivateKeySubmit(privateKeyN, privateKeyD)
                              }}
                              disabled={!nIsValid || !dIsValid}
                              className="w-full hover:opacity-90 transition-all duration-300 ease-in-out"
                              style={{
                                backgroundColor: "#FDCF6F",
                                color: "#000201",
                                border: "none",
                              }}
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              Desencriptar Archivo
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <DecryptionSuccessScreen
                        fileName={decryptFiles[0]?.name || ""}
                        decryptedContent={decryptedContent}
                        onDownload={downloadDecryptedFile}
                        onDecryptAnother={decryptAnotherFile}
                      />
                    )}
                  </TabsContent>
                </CustomTabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Overlays de animación - Movidos fuera del Card */}
      <EncryptionOverlay isVisible={isEncrypting} onComplete={handleEncryptionComplete} />
      <DecryptionOverlay isVisible={isDecrypting} onComplete={handleDecryptionComplete} />
    </div>
  )
}
