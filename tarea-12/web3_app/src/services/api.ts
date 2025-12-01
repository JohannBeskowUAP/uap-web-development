// Servicio para comunicarse con el backend
const API_BASE_URL = 'http://localhost:3001/api'

// Tipos
interface AuthMessageResponse {
  success: boolean
  data?: {
    message: string
    nonce: string
  }
  message?: string
}

interface AuthSignInResponse {
  success: boolean
  data?: {
    token: string
    address: string
  }
  message?: string
}

interface ClaimResponse {
  success: boolean
  data?: {
    txHash: string
  }
  message?: string
}

interface StatusResponse {
  success: boolean
  data?: {
    hasClaimed: boolean
    balance: string
    faucetAmount: string
    users: string[]
    decimals: number
  }
  message?: string
}

export async function getAuthMessage(address: string) {
  const res = await fetch(`${API_BASE_URL}/auth/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.message)

  return {
    message: json.data.message,
    nonce: json.data.nonce
  }
}

export async function signIn(message: string, signature: string, nonce: string) {
  const res = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, signature, nonce })
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.message)

  return json.data
}



// Reclamar tokens (requiere JWT)
export const claimTokens = async (token: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/faucet/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  const data: ClaimResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Error reclamando tokens')
  }

  return data.data.txHash
}

// Obtener estado del faucet (requiere JWT)
export const getFaucetStatus = async (address: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/faucet/status/${address}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  const data: StatusResponse = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Error obteniendo estado')
  }

  return data.data
}

// Obtener lista de usuarios (público, no requiere JWT)
export const getFaucetUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/faucet/users`)
  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message || 'Error obteniendo usuarios')
  }

  return data.data
}
