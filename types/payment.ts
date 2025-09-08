import { Address } from 'viem'

export interface PaymentRequest {
  id: string
  amount: string // Amount in USDC (with decimals)
  recipient: Address
  description?: string
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface PaymentResponse {
  id: string
  status: PaymentStatus
  transactionHash?: string
  blockNumber?: number
  confirmations?: number
  error?: string
  createdAt: Date
  updatedAt: Date
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export interface X402PaymentRequest {
  amount: string
  currency: 'USDC'
  network: 'base' | 'base-sepolia'
  recipient: Address
  description?: string
  callbackUrl?: string
  metadata?: Record<string, any>
}

export interface X402PaymentResponse {
  paymentId: string
  status: string
  paymentUrl: string
  qrCode?: string
  expiresAt: string
}

export interface TransactionDetails {
  hash: string
  from: Address
  to: Address
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  confirmations: number
}

export interface PaymentError {
  code: string
  message: string
  details?: any
}

export interface WalletConnection {
  address: Address
  chainId: number
  isConnected: boolean
  connector?: string
}
