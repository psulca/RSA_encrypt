# Encriptador de Archivos de Texto con RSA

Esta aplicación web permite **encriptar y desencriptar archivos de texto (.txt) de forma segura utilizando el algoritmo RSA**. Es ideal para usuarios que desean proteger información sensible en archivos de texto, generando y gestionando sus propias claves públicas y privadas.

## Características

- **Encriptación de archivos de texto** usando RSA.
- **Desencriptación** de archivos previamente encriptados con la app.
- **Generación de claves RSA**: puedes generar claves aleatorias o ingresar manualmente los valores primos p y q.
- **Interfaz intuitiva**: arrastra y suelta archivos, sigue pasos guiados y descarga los resultados fácilmente.
- **Mensajes claros de éxito y error** durante el proceso.

## Tecnologías utilizadas

- **Next.js** (React)
- **TypeScript**
- **TailwindCSS** para estilos
- **shadcn/ui** para la generación de componentes de interfaz de usuario
- **RSA implementado en TypeScript** (sin dependencias externas para la criptografía principal)

## Notas de seguridad

- **La clave privada nunca se almacena en el servidor.** El proceso de encriptación/desencriptación ocurre en el cliente.
- **Guarda tu clave privada en un lugar seguro.** Si la pierdes, no podrás desencriptar tus archivos.

Licencia: MIT 
