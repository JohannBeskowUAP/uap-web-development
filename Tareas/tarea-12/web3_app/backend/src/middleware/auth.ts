import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { AuthenticatedRequest } from '../types/index.js'

dotenv.config()

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    })
    return
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ 
      success: false, 
      message: 'Error de configuración del servidor' 
    })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      res.status(403).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      })
      return
    }

    // Agregar información del usuario al request
    req.user = user
    next()
  })
}

export const generateToken = (address: string): string => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables')
    throw new Error('JWT_SECRET no está definida en las variables de entorno')
  }

  try {
    return jwt.sign(
      { address: address.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
  } catch (error: any) {
    console.error('Error generating JWT token:', error)
    throw new Error(`Error generando token: ${error?.message || 'Unknown error'}`)
  }
}