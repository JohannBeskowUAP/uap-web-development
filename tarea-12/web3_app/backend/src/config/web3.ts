import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com')

let walletInstance: ethers.Wallet | null = null

// Validar correctamente la PRIVATE_KEY del .env
const rawKey = process.env.PRIVATE_KEY?.trim()
if (rawKey && rawKey !== 'PRIVATE_KEY') {
  try {
    const key = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`
    walletInstance = new ethers.Wallet(key, provider)
  } catch (error) {
    console.error('Error creating wallet from PRIVATE_KEY:', error)
  }
} else {
  console.warn('No valid PRIVATE_KEY found in environment; operating with provider only.')
}

export const wallet = walletInstance

const CONTRACT_ABI = [
  { name: 'claimTokens', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'hasAddressClaimed', type: 'function', stateMutability: 'view', inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'bool' }] },
  { name: 'getFaucetUsers', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'address[]' }] },
  { name: 'getFaucetAmount', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] }
] as const

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x3e2117c19a921507ead57494bbf29032f33c7412'

export const contract = wallet ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet) : new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
