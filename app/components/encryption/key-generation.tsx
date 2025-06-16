"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Key, Loader2 } from "lucide-react"
import { CopyableKeyCard } from "@/app/components/ui/copyable-key-card"
import { isPrime, type RSAKeys } from "@/utils/rsa"

interface KeyGenerationProps {
  onKeysGenerated: (keys: RSAKeys | null) => void
}

export function KeyGeneration({ onKeysGenerated }: KeyGenerationProps) {
  const [keyGenerationMethod, setKeyGenerationMethod] = useState("random")
  const [manualP, setManualP] = useState("")
  const [manualQ, setManualQ] = useState("")
  const [pIsValid, setPIsValid] = useState(false)
  const [qIsValid, setQIsValid] = useState(false)
  const [pErrorMessage, setPErrorMessage] = useState<string | null>(null)
  const [qErrorMessage, setQErrorMessage] = useState<string | null>(null)
  const [generatedKeys, setGeneratedKeys] = useState<RSAKeys | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (manualP) {
      const num = Number.parseInt(manualP)
      if (num < 50) {
        setPIsValid(false)
        setPErrorMessage("El número debe ser mayor o igual a 50")
      } else if (num > 10000) {
        setPIsValid(false)
        setPErrorMessage("El número debe ser menor o igual a 10000")
      } else if (!isPrime(num)) {
        setPIsValid(false)
        setPErrorMessage("El número debe ser primo")
      } else {
        setPIsValid(true)
        setPErrorMessage(null)
      }
    } else {
      setPIsValid(false)
      setPErrorMessage(null)
    }
  }, [manualP])

  useEffect(() => {
    if (manualQ) {
      const num = Number.parseInt(manualQ)
      if (num < 50) {
        setQIsValid(false)
        setQErrorMessage("El número debe ser mayor o igual a 50")
      } else if (num > 10000) {
        setQIsValid(false)
        setQErrorMessage("El número debe ser menor o igual a 10000")
      } else if (!isPrime(num)) {
        setQIsValid(false)
        setQErrorMessage("El número debe ser primo")
      } else {
        setQIsValid(true)
        setQErrorMessage(null)
      }
    } else {
      setQIsValid(false)
      setQErrorMessage(null)
    }
  }, [manualQ])

  const areNumbersDifferent = () => {
    if (!manualP || !manualQ) return false
    const result = Number.parseInt(manualP) !== Number.parseInt(manualQ)
    return result
  }

  const generateAndUseKeys = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      let response
      if (keyGenerationMethod === "random") {
        response = await fetch('/api/generate-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
      } else if (keyGenerationMethod === "manual" && pIsValid && qIsValid && areNumbersDifferent()) {
        response = await fetch('/api/generate-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p: Number.parseInt(manualP),
            q: Number.parseInt(manualQ),
          }),
        })
      }

      if (!response?.ok) {
        const errorData = await response?.json()
        throw new Error(errorData.error || 'Error al generar las claves')
      }

      const keys = await response.json()
      setGeneratedKeys(keys)
      onKeysGenerated(keys)
    } catch (error) {
      console.error('Error generating keys:', error)
      setError(error instanceof Error ? error.message : 'Error al generar las claves')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyTypeChange = (value: string) => {
    setKeyGenerationMethod(value)
    setManualP("")
    setManualQ("")
    setPIsValid(false)
    setQIsValid(false)
    setPErrorMessage(null)
    setQErrorMessage(null)
    setGeneratedKeys(null)
    onKeysGenerated(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Paso 2: Generar Claves RSA</h2>

      <RadioGroup value={keyGenerationMethod} onValueChange={handleKeyTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="random" id="random" />
          <Label htmlFor="random">
            Usar un par de claves pública/privada generado aleatoriamente{" "}
            <span className="font-bold" style={{ color: "#0C756F" }}>(recomendado)</span>.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Ingresar componentes p y q manualmente para construir las claves.</Label>
        </div>
      </RadioGroup>

      {keyGenerationMethod === "manual" && (
        <div className="grid grid-cols-2 gap-4 mt-4 transform transition-all duration-500 ease-in-out">
          <div>
            <Label htmlFor="p">Número primo P</Label>
            <div className="flex items-center gap-2">
              <Input
                id="p"
                type="number"
                value={manualP}
                onChange={(e) => setManualP(e.target.value)}
                placeholder="Ingresa un número primo"
                max={10000}
              />
              {manualP && (
                <span className={pIsValid ? "text-green-500" : "text-red-500"}>{pIsValid ? "✓" : "✗"}</span>
              )}
            </div>
            {pErrorMessage && (
              <p className="text-sm text-red-500 mt-1">{pErrorMessage}</p>
            )}
          </div>
          <div>
            <Label htmlFor="q">Número primo Q</Label>
            <div className="flex items-center gap-2">
              <Input
                id="q"
                type="number"
                value={manualQ}
                onChange={(e) => setManualQ(e.target.value)}
                placeholder="Ingresa un número primo"
                max={10000}
              />
              {manualQ && (
                <span className={qIsValid ? "text-green-500" : "text-red-500"}>{qIsValid ? "✓" : "✗"}</span>
              )}
            </div>
            {qErrorMessage && (
              <p className="text-sm text-red-500 mt-1">{qErrorMessage}</p>
            )}
          </div>
          {manualP && manualQ && !areNumbersDifferent() && (
            <div className="col-span-2 text-red-500 text-sm">
              Los números P y Q deben ser diferentes
            </div>
          )}
          <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Por limitaciones del navegador, los valores de P y Q deben estar entre 50 y 10000.
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={generateAndUseKeys}
        disabled={
          keyGenerationMethod === "manual" && 
          (!pIsValid || !qIsValid || !areNumbersDifferent()) ||
          isGenerating
        }
        className="hover:opacity-90 transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: "#FDCF6F",
          color: "#000201",
          border: "none",
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando Claves...
          </>
        ) : (
          <>
            <Key className="w-4 h-4 mr-2" />
            Generar Claves
          </>
        )}
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {generatedKeys && (
        <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 transform transition-all duration-700 ease-in-out opacity-100 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900">Claves Generadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CopyableKeyCard title="Clave Pública" keyData={generatedKeys.publicKey} type="public" />
            <CopyableKeyCard title="Clave Privada" keyData={generatedKeys.privateKey} type="private" />
          </div>
          <div className="p-4 bg-[rgba(12,117,111,0.1)] border border-[#0C756F] rounded-lg">
            <p className="text-sm text-[#0C756F]">
              IMPORTANTE: Guarda tu clave privada en un lugar seguro. La necesitarás para desencriptar el archivo.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 