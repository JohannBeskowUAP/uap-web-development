import { useState } from 'react'
import { useAccount } from 'wagmi'
import { claimTokens } from '../services/api'

interface ClaimWithBackendProps {
  authToken: string | null
  onClaimSuccess: () => void
}

export function ClaimWithBackend({ authToken, onClaimSuccess }: ClaimWithBackendProps) {
  const { isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleClaim = async () => {
    if (!authToken) {
      setError('Debes autenticarte primero')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setTxHash(null)

    try {
      console.log('🚀 Enviando solicitud de claim al backend...')
      const hash = await claimTokens(authToken)
      
      setTxHash(hash)
      setSuccess('¡Tokens reclamados exitosamente! El backend procesó tu transacción.')
      console.log('✅ Claim exitoso:', hash)
      
      // Esperar un poco y refrescar
      setTimeout(() => {
        onClaimSuccess()
      }, 3000)

    } catch (err: any) {
      console.error('❌ Error en claim:', err)
      setError(err.message || 'Error reclamando tokens')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected || !authToken) {
    return null
  }

  return (
    <div className="space-y-4">

      <button
        onClick={handleClaim}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando en el backend...
          </span>
        ) : (
          'Reclamar Tokens (vía Backend)'
        )}
      </button>
    </div>
  )
}
