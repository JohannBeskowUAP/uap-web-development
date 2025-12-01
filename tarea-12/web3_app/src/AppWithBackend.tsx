import { useState, useEffect } from 'react'
import { WalletButton } from './components/WalletButton'
import { UsersList } from './components/UsersList'
import { TransferTokens } from './components/TransferTokens'
import AuthButton from './components/AuthButton'
const AuthBtn = AuthButton as any
import { ClaimWithBackend } from './components/ClaimWithBackend'
import { useAccount } from 'wagmi'
import { getFaucetStatus } from './services/api'

function AppWithBackend() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'faucet' | 'transfer' | 'users'>('faucet')
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<any>(null)

  // Verificar token guardado al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedAddress = localStorage.getItem('auth_address')

    if (savedToken && savedAddress === address) {
      setAuthToken(savedToken)
    } else {
      // Limpiar si cambió de wallet
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_address')
      setAuthToken(null)
      setBackendStatus(null)
    }
  }, [address])

  // Obtener status del backend cuando está autenticado
  useEffect(() => {
    const loadBackendStatus = async () => {
      if (authToken && address) {
        try {
          const status = await getFaucetStatus(address, authToken)
          setBackendStatus(status)
        } catch (error) {
          console.error('Error loading backend status:', error)
        }
      }
    }
    loadBackendStatus()
  }, [authToken, address])

  const handleAuthenticated = (token: string) => {
    setAuthToken(token)
  }

  const handleClaimSuccess = () => {
    // Recargar status del backend
    if (authToken && address) {
      getFaucetStatus(address, authToken).then(setBackendStatus)
    }
  }

  const formatBalance = (value: string | undefined) => {
    if (!value) return '0'
    // El backend ya devuelve el balance como string (wei)
    // Asumimos 18 decimales si no viene en el status, o usamos el del status
    const decimals = backendStatus?.decimals || 18
    const formatted = Number(value) / Math.pow(10, decimals)
    return formatted.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">TP 12</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Navigation tabs */}
              <nav className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('faucet')}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'faucet'
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Faucet
                </button>
                <button
                  onClick={() => setActiveTab('transfer')}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'transfer'
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Transfer
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'users'
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Users
                </button>
              </nav>
              <WalletButton />
            </div>
          </div>
          {/* Mobile navigation */}
          <nav className="sm:hidden flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('faucet')}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'faucet'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Faucet
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'transfer'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Transfer
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === 'users'
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Users
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Estado de conexión */}
        {!isConnected && (
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl shadow-lg shadow-blue-100/50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 text-lg">Connect your wallet</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Connect your wallet to authenticate with Sign-In with Ethereum (SIWE) and claim tokens
                </p>
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <AuthBtn
            onAuthenticated={handleAuthenticated}
            isAuthenticated={!!authToken}
          />

        )}
        {/* Balance principal */}
        {isConnected && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Your Balance</p>
                <h2 className="text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                  {backendStatus ? formatBalance(backendStatus.balance) : '---'}
                </h2>
                <p className="text-sm font-medium text-gray-600 tracking-wide">FT Tokens</p>
              </div>

              {/* Quick stats */}
              {backendStatus && (
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Faucet Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatBalance(backendStatus.faucetAmount)} FT
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Claim Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${backendStatus.hasClaimed ? 'bg-gray-400' : 'bg-green-500 shadow-lg shadow-green-400/50'}`}></div>
                      <p className="text-xl font-bold text-gray-900">
                        {backendStatus.hasClaimed ? 'Claimed' : 'Available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim con backend */}
              {authToken && backendStatus && !backendStatus.hasClaimed && (
                <div className="mt-6">
                  <ClaimWithBackend
                    authToken={authToken}
                    onClaimSuccess={handleClaimSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden">
          {activeTab === 'transfer' && <TransferTokens />}
          {activeTab === 'users' && <UsersList />}
        </div>
      </main>
    </div>
  )
}

export default AppWithBackend
