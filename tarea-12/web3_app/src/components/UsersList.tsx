```typescript
import { useState, useEffect } from 'react'
import { getFaucetUsers } from '../services/api'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { CONTRACT_CONFIG } from '../config/web3'

export function UsersList() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Leer decimales (esto puede quedar aquí o venir del backend, pero es configuración)
  const { data: decimals } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'decimals',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getFaucetUsers()
        setUsers(data.users)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Error loading users list')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatBalance = (value: string) => {
    if (!value || !decimals) return '0'
    // El backend devuelve el balance como string (wei)
    const formatted = formatUnits(BigInt(value), decimals)
    return Number(formatted).toLocaleString('en-US', { 
      maximumFractionDigits: 2,
      minimumFractionDigits: 0 
    })
  }

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-500">Loading users from backend...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Faucet Users</h3>
        <p className="text-sm text-gray-600">
          Addresses that have claimed tokens (fetched from backend)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-xs font-medium text-blue-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-blue-900">{users ? users.length : 0}</p>
        </div>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user: any, index: number) => (
            <div
              key={user.address}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg p-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-900 truncate">{user.address}</p>
                    <p className="text-xs text-gray-500">Balance: {formatBalance(user.balance)} FT</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(user.address)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copy address"
                >
                  {copiedAddress === user.address ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No users yet</h4>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Be the first to claim tokens from the faucet and appear in this list
          </p>
        </div>
      )}
    </div>
  )
}
```