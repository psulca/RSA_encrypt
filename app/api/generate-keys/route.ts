import { NextResponse } from 'next/server'
import { generateRSAKeys } from '@/utils/rsa'

export async function POST(request: Request) {
  try {
    console.log('API: Iniciando generación de llaves')
    const body = await request.json()
    const { p, q } = body

    // Validar que los números sean primos y estén dentro del rango
    if (p && q) {
      console.log('API: Validando valores de p y q:', { p, q })
      if (p < 50 || q < 50) {
        console.log('API: Error - Valores muy pequeños')
        return NextResponse.json(
          { error: 'Los números deben ser mayores o iguales a 50' },
          { status: 400 }
        )
      }
      if (p > 10000 || q > 10000) {
        console.log('API: Error - Valores fuera de rango')
        return NextResponse.json(
          { error: 'Los números deben ser menores o iguales a 10000' },
          { status: 400 }
        )
      }
    }

    console.log('API: Generando claves RSA...')
    const keys = generateRSAKeys(p, q)
    console.log('API: Claves generadas exitosamente')
    return NextResponse.json(keys)
  } catch (error) {
    console.error('API: Error generando RSA keys:', error)
    return NextResponse.json(
      { error: 'Error al generar las claves RSA' },
      { status: 500 }
    )
  }
} 