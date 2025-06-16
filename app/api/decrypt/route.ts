import { NextResponse } from 'next/server'
import { decryptFile } from '@/utils/rsa'

export async function POST(request: Request) {
  try {
    console.log('Iniciando proceso de desencriptación...')
    const { content, privateKey } = await request.json()

    if (!content || !privateKey) {
      console.error('Faltan datos requeridos:', { content: !!content, privateKey: !!privateKey })
      return NextResponse.json(
        { error: 'Se requiere el contenido encriptado y la clave privada' },
        { status: 400 }
      )
    }

    console.log('Desencriptando contenido...')
    const decryptedContent = await decryptFile(content, privateKey)
    console.log('Desencriptación completada')

    return NextResponse.json({ decryptedContent })
  } catch (error) {
    console.error('Error en la desencriptación:', error)
    return NextResponse.json(
      { error: 'Error al desencriptar el contenido' },
      { status: 500 }
    )
  }
} 