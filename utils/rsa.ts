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

export function generateRandomPrime(min = 1000, max = 10000): number {
  let num: number
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min
  } while (!isPrime(num))
  return num
}

export function mcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

export function generateRSAKeys(p?: number, q?: number): RSAKeys {
  // Si no se proporcionan p y q, generarlos aleatoriamente
  if (!p) p = generateRandomPrime()
  if (!q) {
    do {
      q = generateRandomPrime()
    } while (q === p) // Asegurar que q sea diferente de p
  }

  const n = p * q
  const phi = (p - 1) * (q - 1)

  // Encontrar todos los números coprimos con phi
  const coprimos: number[] = []
  for (let numero = 1; numero < phi; numero++) {
    if (mcd(numero, phi) === 1) {
      coprimos.push(numero)
    }
  }

  // Seleccionar un valor d aleatorio de la lista de coprimos
  const d = coprimos[Math.floor(Math.random() * coprimos.length)]

  // Elegir e (exponente público)
  let e = 1
  while ((d * e) % phi !== 1 || e === d) {
    e++
  }

  return {
    publicKey: { n, e },
    privateKey: { n, d },
  }
}

export function encryptFile(content: string, publicKey: { n: number; e: number }): number[] {
  const encryptedNumbers: number[] = []
  let problematicChars = 0

  for (const char of content) {
    const charCode = char.charCodeAt(0)
    if (charCode >= publicKey.n) {
      problematicChars++
      continue
    }
    // Usamos BigInt para manejar números grandes en la exponenciación modular
    const encryptedValue = Number(BigInt(charCode) ** BigInt(publicKey.e) % BigInt(publicKey.n))
    encryptedNumbers.push(encryptedValue)
  }

  if (problematicChars > 0) {
    throw new Error(`Se omitieron ${problematicChars} carácter(es) porque su valor numérico era >= n (${publicKey.n}).`)
  }

  if (!encryptedNumbers.length && problematicChars === content.length && content.length > 0) {
    throw new Error(`Todos los caracteres del mensaje original fueron omitidos porque su valor numérico era >= n (${publicKey.n}). Pruebe con una 'n' más grande (primos p y q mayores).`)
  }

  if (!encryptedNumbers.length && content.length > 0) {
    throw new Error("No se generó ningún dato encriptado del mensaje. Verifique el contenido del archivo original.")
  }

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
    const decryptedNumbers = encryptedNumbers.map(num => {
      try {
        return Number(modPow(num, privateKey.d, privateKey.n))
      } catch (error) {
        console.error(`Error al desencriptar número: ${num}`, error)
        throw new Error(`Error al desencriptar número: ${num}`)
      }
    })

    // Convertir los números a caracteres
    let decryptedText = ''
    for (const num of decryptedNumbers) {
      try {
        decryptedText += String.fromCharCode(num)
      } catch (error) {
        console.error(`Error al convertir número a carácter: ${num}`, error)
        decryptedText += `[ErrorChar:${num}]`
      }
    }

    return decryptedText
  } catch (error) {
    console.error('Error en la desencriptación:', error)
    throw new Error('Error al desencriptar el archivo')
  }
}