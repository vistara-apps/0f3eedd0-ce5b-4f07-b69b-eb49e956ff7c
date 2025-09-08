import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'

// Base network configuration
export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'Nebula Arena',
      appLogoUrl: 'https://example.com/logo.png',
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// USDC contract addresses on Base
export const USDC_ADDRESSES = {
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base Mainnet
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
} as const

// X402 payment endpoint configuration
export const X402_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_X402_BASE_URL || 'https://api.x402.example.com',
  apiKey: process.env.NEXT_PUBLIC_X402_API_KEY || 'demo-api-key',
  version: 'v1',
} as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
