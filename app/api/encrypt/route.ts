import { NextResponse } from 'next/server'
import { encryptFile, createEncryptedFile } from '@/utils/rsa'

export async function POST(request: Request) {
  try {
    console.log('API: Iniciando proceso de encriptación')
    const body = await request.json()
    const { content, publicKey } = body

    if (!content || !publicKey) {
      console.log('API: Error - Faltan datos requeridos')
      return NextResponse.json(
        { error: 'Se requiere el contenido y la clave pública' },
        { status: 400 }
      )
    }

    console.log('API: Encriptando contenido...')
    const encryptedNumbers = await encryptFile(content, publicKey)
    const encryptedContent = encryptedNumbers.join(' ')
    console.log('API: Encriptación completada')

    return NextResponse.json({ encryptedContent })
  } catch (error) {
    console.error('API: Error durante la encriptación:', error)
    let errorMessage = 'Error durante la encriptación'
    
    if (error instanceof Error) {
      if (error.message.includes('Se omitieron')) {
        errorMessage = 'El archivo contiene caracteres que no se pueden encriptar con esos valores de P y Q. Por favor, ingresa valores más grandes.'
      } else if (error.message.includes('Todos los caracteres')) {
        errorMessage = 'No se pudo encriptar ningún carácter del archivo. Por favor, ingresa valores de P y Q más grandes.'
      } else if (error.message.includes('No se generó ningún dato')) {
        errorMessage = 'No se pudo encriptar el archivo. Por favor, verifica que el archivo contenga texto válido.'
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 