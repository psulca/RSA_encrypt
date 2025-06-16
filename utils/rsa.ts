export interface RSAKeys {
  publicKey: {
    n: number
    e: number
  }
  privateKey: {
    n: number
    d: number
  }
}

export function isPrime(num: number): boolean {
  if (num <= 1) return false
  if (num <= 3) return true
  if (num % 2 === 0 || num % 3 === 0) return false

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false
  }

  return true
}

export function generateRandomPrime(): number {
  console.log('Generando número primo aleatorio entre 50 y 10000')
  const min = 50
  const max = 10000
  let num: number
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min
  } while (!isPrime(num))
  console.log('Número primo generado:', num)
  return num
}

// Función para calcular el MCD usando el algoritmo de Euclides extendido
function extendedGCD(a: number, b: number): { gcd: number; x: number; y: number } {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 }
  }

  const result = extendedGCD(b, a % b)
  return {
    gcd: result.gcd,
    x: result.y,
    y: result.x - Math.floor(a / b) * result.y
  }
}

// Función para encontrar un número coprimo con phi
function findCoprime(phi: number): number {
  console.log('Buscando número coprimo con phi:', phi)
  
  // Intentamos primero con valores aleatorios
  const maxAttempts = 10
  for (let i = 0; i < maxAttempts; i++) {
    // Generamos un número aleatorio entre 2 y phi-1
    const e = Math.floor(Math.random() * (phi - 2)) + 2
    console.log(`Intento ${i + 1}: Probando e = ${e}`)
    if (extendedGCD(e, phi).gcd === 1) {
      console.log(`Encontrado número coprimo: ${e}`)
      return e
    }
  }

  console.log('No se encontró número coprimo aleatorio, probando valores comunes...')
  // Si después de varios intentos no encontramos un valor aleatorio,
  // usamos uno de los valores comunes como fallback
  const commonEValues = [3, 5, 17, 65537]
  for (const e of commonEValues) {
    console.log(`Probando valor común e = ${e}`)
    if (e < phi && extendedGCD(e, phi).gcd === 1) {
      console.log(`Encontrado número coprimo común: ${e}`)
      return e
    }
  }

  console.log('Buscando primer número coprimo secuencialmente...')
  // Si todo lo demás falla, buscamos el primer número coprimo
  let e = 2
  while (extendedGCD(e, phi).gcd !== 1) {
    e++
  }
  console.log(`Encontrado primer número coprimo: ${e}`)
  return e
}

// Función para calcular el inverso modular
function modInverse(a: number, m: number): number {
  console.log('Calculando inverso modular para:', { a, m })
  const result = extendedGCD(a, m)
  if (result.gcd !== 1) {
    console.log('No existe inverso modular')
    throw new Error('No existe inverso modular')
  }
  const inverse = ((result.x % m) + m) % m
  console.log('Inverso modular calculado:', inverse)
  return inverse
}

export function generateRSAKeys(p?: number, q?: number): RSAKeys {
  console.log('Iniciando generación de claves RSA...')
  
  // Si no se proporcionan p y q, generarlos aleatoriamente
  if (!p) {
    console.log('Generando p aleatoriamente...')
    p = generateRandomPrime()
    console.log('p generado:', p)
  }
  
  if (!q) {
    console.log('Generando q aleatoriamente...')
    do {
      q = generateRandomPrime()
    } while (q === p) // Asegurar que q sea diferente de p
    console.log('q generado:', q)
  }

  console.log('Calculando n = p * q...')
  const n = p * q
  console.log('n calculado:', n)

  console.log('Calculando phi = (p-1) * (q-1)...')
  const phi = (p - 1) * (q - 1)
  console.log('phi calculado:', phi)

  // Encontrar e (exponente público) que sea coprimo con phi
  console.log('Buscando exponente público e...')
  const e = findCoprime(phi)
  console.log('e encontrado:', e)

  // Calcular d (exponente privado) usando el inverso modular
  console.log('Calculando exponente privado d...')
  const d = modInverse(e, phi)
  console.log('d calculado:', d)

  console.log('Generación de claves RSA completada')
  return {
    publicKey: { n, e },
    privateKey: { n, d },
  }
}

export function encryptFile(content: string, publicKey: { n: number; e: number }): number[] {
  console.log('Iniciando encriptación de archivo...')
  const encryptedNumbers: number[] = []
  let problematicChars = 0

  // Convertir el contenido a un array de puntos de código Unicode
  const codePoints: number[] = []
  for (let i = 0; i < content.length;) {
    const codePoint = content.codePointAt(i)
    if (codePoint === undefined) break
    codePoints.push(codePoint)
    i += codePoint > 0xFFFF ? 2 : 1 // Avanzar 2 posiciones para caracteres que requieren 2 unidades de código
  }
  console.log(`Procesando ${codePoints.length} puntos de código Unicode...`)

  // Encriptar en lotes para mejor rendimiento
  const batchSize = 1000
  for (let i = 0; i < codePoints.length; i += batchSize) {
    const batch = codePoints.slice(i, i + batchSize)
    console.log(`Procesando lote ${i / batchSize + 1} de ${Math.ceil(codePoints.length / batchSize)}...`)
    
    for (const codePoint of batch) {
      if (codePoint >= publicKey.n) {
        problematicChars++
        continue
      }
      // Usar modPow para exponenciación modular rápida
      const encryptedValue = Number(modPow(BigInt(codePoint), BigInt(publicKey.e), BigInt(publicKey.n)))
      encryptedNumbers.push(encryptedValue)
    }
  }

  if (problematicChars > 0) {
    throw new Error(`Se omitieron ${problematicChars} carácter(es) porque su valor numérico era >= n (${publicKey.n}).`)
  }

  if (!encryptedNumbers.length && problematicChars === codePoints.length && codePoints.length > 0) {
    throw new Error(`Todos los caracteres del mensaje original fueron omitidos porque su valor numérico era >= n (${publicKey.n}). Pruebe con una 'n' más grande (primos p y q mayores).`)
  }

  if (!encryptedNumbers.length && codePoints.length > 0) {
    throw new Error('No se generó ningún dato encriptado. Verifique que el archivo contenga texto válido.')
  }

  console.log('Encriptación completada')
  return encryptedNumbers
}

export function createEncryptedFile(encryptedNumbers: number[], originalFileName: string): Blob {
  const content = encryptedNumbers.join(' ')
  return new Blob([content], { type: 'text/plain' })
}

// Función para calcular (base ** exponent) % modulus de forma eficiente
function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

export async function decryptFile(
  encryptedContent: string,
  privateKey: { n: bigint; d: bigint }
): Promise<string> {
  try {
    // Convertir el contenido encriptado a números
    const encryptedNumbers = encryptedContent.split(' ').map(num => BigInt(num))

    // Desencriptar cada número usando la clave privada
    const decryptedNumbers = encryptedNumbers.map((num, index) => {
      try {
        const decrypted = Number(modPow(num, privateKey.d, privateKey.n))
        return decrypted
      } catch (error) {
        console.error(`Error al desencriptar número ${index + 1}:`, {
          número: num.toString(),
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
        throw new Error(`Error al desencriptar número: ${num}`)
      }
    })

    // Convertir los números a caracteres Unicode
    let decryptedText = ''
    const MAX_UNICODE = 0x10FFFF // Máximo valor válido para Unicode
    const REPLACEMENT_CHAR = 'X' // Carácter de reemplazo

    for (let i = 0; i < decryptedNumbers.length; i++) {
      const num = decryptedNumbers[i]
      try {
        if (num < 0 || num > MAX_UNICODE) {
          decryptedText += REPLACEMENT_CHAR
          continue
        }
        const char = String.fromCodePoint(num)
        decryptedText += char
      } catch (error) {
        console.error(`Error al procesar carácter ${i + 1}:`, {
          número: num,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
        decryptedText += REPLACEMENT_CHAR
      }
    }

    return decryptedText
  } catch (error) {
    console.error('Error en la desencriptación:', error)
    throw new Error('Error al desencriptar el archivo')
  }
}

// Función para crear un blob con el contenido encriptado
export function createEncryptedBlob(content: string): Blob {
  return new Blob([content], { type: 'text/plain;charset=utf-8' })
}

// Función para crear un blob con el contenido desencriptado
export function createDecryptedBlob(content: string): Blob {
  return new Blob([content], { type: 'text/plain;charset=utf-8' })
}