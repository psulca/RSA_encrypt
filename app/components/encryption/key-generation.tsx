"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Key, AlertCircle } from "lucide-react"
import { CopyableKeyCard } from "@/app/components/ui/copyable-key-card"
import { generateRSAKeys, isPrime, type RSAKeys } from "@/utils/rsa"

interface KeyGenerationProps {
  onKeysGenerated: (keys: RSAKeys | null) => void
}

export function KeyGeneration({ onKeysGenerated }: KeyGenerationProps) {
  const [keyGenerationMethod, setKeyGenerationMethod] = useState("random")
  const [manualP, setManualP] = useState("")
  const [manualQ, setManualQ] = useState("")
  const [pIsValid, setPIsValid] = useState(false)
  const [qIsValid, setQIsValid] = useState(false)
  const [generatedKeys, setGeneratedKeys] = useState<RSAKeys | null>(null)

  useEffect(() => {
    if (manualP) {
      const num = Number.parseInt(manualP)
      setPIsValid(!isNaN(num) && isPrime(num))
    } else {
      setPIsValid(false)
    }
  }, [manualP])

  useEffect(() => {
    if (manualQ) {
      const num = Number.parseInt(manualQ)
      setQIsValid(!isNaN(num) && isPrime(num))
    } else {
      setQIsValid(false)
    }
  }, [manualQ])

  const areNumbersDifferent = () => {
    if (!manualP || !manualQ) return false
    return Number.parseInt(manualP) !== Number.parseInt(manualQ)
  }

  const generateAndUseKeys = () => {
    if (keyGenerationMethod === "random") {
      const keys = generateRSAKeys()
      setGeneratedKeys(keys)
      onKeysGenerated(keys)
    } else if (keyGenerationMethod === "manual" && pIsValid && qIsValid && areNumbersDifferent()) {
      const keys = generateRSAKeys(Number.parseInt(manualP), Number.parseInt(manualQ))
      setGeneratedKeys(keys)
      onKeysGenerated(keys)
    }
  }

  const handleKeyTypeChange = (value: string) => {
    setKeyGenerationMethod(value)
    setManualP("")
    setManualQ("")
    setPIsValid(false)
    setQIsValid(false)
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
              />
              {manualP && (
                <span className={pIsValid ? "text-green-500" : "text-red-500"}>{pIsValid ? "✓" : "✗"}</span>
              )}
            </div>
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
              />
              {manualQ && (
                <span className={qIsValid ? "text-green-500" : "text-red-500"}>{qIsValid ? "✓" : "✗"}</span>
              )}
            </div>
          </div>
          {manualP && manualQ && !areNumbersDifferent() && (
            <div className="col-span-2 text-red-500 text-sm">
              Los números P y Q deben ser diferentes
            </div>
          )}
        </div>
      )}

      <Button
        onClick={generateAndUseKeys}
        disabled={keyGenerationMethod === "manual" && (!pIsValid || !qIsValid || !areNumbersDifferent())}
        className="hover:opacity-90 transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: "#FDCF6F",
          color: "#000201",
          border: "none",
        }}
      >
        <Key className="w-4 h-4 mr-2" />
        Generar Claves
      </Button>

      {generatedKeys && (
        <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 transform transition-all duration-700 ease-in-out opacity-100 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900">Claves Generadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CopyableKeyCard title="Clave Pública" keyData={generatedKeys.publicKey} type="public" />
            <CopyableKeyCard title="Clave Privada" keyData={generatedKeys.privateKey} type="private" />
          </div>
          <div
            className="p-3 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: "rgba(255, 99, 99, 0.1)",
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#FF6363" }} />
            <p className="text-sm font-medium" style={{ color: "#FF6363" }}>
              IMPORTANTE: Guarda tu clave privada en un lugar seguro. La necesitarás para desencriptar el archivo.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 