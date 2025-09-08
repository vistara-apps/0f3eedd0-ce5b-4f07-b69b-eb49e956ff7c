'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi'
import { parseUnits, formatUnits, erc20Abi, Address } from 'viem'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { x402Service } from '@/lib/x402-service'
import { USDC_ADDRESSES } from '@/lib/wagmi'
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatus, 
  X402PaymentRequest,
  TransactionDetails,
  PaymentError 
} from '@/types/payment'

export interface UsePaymentOptions {
  onSuccess?: (payment: PaymentResponse) => void
  onError?: (error: PaymentError) => void
  pollInterval?: number
}

export function usePayment(options: UsePaymentOptions = {}) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const chainId = useChainId()
  const queryClient = useQueryClient()

  const [currentPayment, setCurrentPayment] = useState<PaymentResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get USDC contract address for current chain
  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES]

  // Query USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useQuery({
    queryKey: ['usdc-balance', address, chainId],
    queryFn: async () => {
      if (!address || !publicClient || !usdcAddress) return '0'
      
      const balance = await publicClient.readContract({
        address: usdcAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })
      
      return formatUnits(balance, 6) // USDC has 6 decimals
    },
    enabled: !!address && !!publicClient && !!usdcAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (request: PaymentRequest) => {
      if (!address || !walletClient) {
        throw new Error('Wallet not connected')
      }

      // Create X402 payment request
      const x402Request: X402PaymentRequest = {
        amount: request.amount,
        currency: 'USDC',
        network: chainId === 8453 ? 'base' : 'base-sepolia',
        recipient: request.recipient,
        description: request.description,
        metadata: request.metadata,
      }

      const x402Response = await x402Service.createPayment(x402Request)
      
      // Execute the payment transaction
      const hash = await executePayment(request)
      
      // Verify payment with X402
      const verifiedPayment = await x402Service.verifyPayment(x402Response.paymentId, hash)
      
      return verifiedPayment
    },
    onSuccess: (payment) => {
      setCurrentPayment(payment)
      queryClient.invalidateQueries({ queryKey: ['usdc-balance'] })
      queryClient.invalidateQueries({ queryKey: ['payment-history'] })
      options.onSuccess?.(payment)
    },
    onError: (error) => {
      console.error('Payment failed:', error)
      options.onError?.(error as PaymentError)
    },
  })

  // Execute USDC transfer
  const executePayment = useCallback(async (request: PaymentRequest): Promise<string> => {
    if (!walletClient || !address || !usdcAddress) {
      throw new Error('Wallet not connected or USDC not available on this chain')
    }

    setIsProcessing(true)

    try {
      // Parse amount to USDC units (6 decimals)
      const amount = parseUnits(request.amount, 6)

      // Check balance
      if (usdcBalance && parseFloat(usdcBalance) < parseFloat(request.amount)) {
        throw new Error('Insufficient USDC balance')
      }

      // Execute transfer
      const hash = await walletClient.writeContract({
        address: usdcAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [request.recipient, amount],
      })

      return hash
    } finally {
      setIsProcessing(false)
    }
  }, [walletClient, address, usdcAddress, usdcBalance])

  // Poll payment status
  const pollPaymentStatus = useCallback(async (paymentId: string) => {
    try {
      const payment = await x402Service.getPaymentStatus(paymentId)
      setCurrentPayment(payment)
      
      if (payment.status === PaymentStatus.CONFIRMED || payment.status === PaymentStatus.FAILED) {
        return payment // Stop polling
      }
      
      // Continue polling for pending/processing payments
      if (payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.PROCESSING) {
        setTimeout(() => pollPaymentStatus(paymentId), options.pollInterval || 5000)
      }
      
      return payment
    } catch (error) {
      console.error('Failed to poll payment status:', error)
      options.onError?.(error as PaymentError)
    }
  }, [options])

  // Get transaction details
  const getTransactionDetails = useCallback(async (hash: string): Promise<TransactionDetails | null> => {
    if (!publicClient) return null

    try {
      const [transaction, receipt] = await Promise.all([
        publicClient.getTransaction({ hash: hash as `0x${string}` }),
        publicClient.getTransactionReceipt({ hash: hash as `0x${string}` }),
      ])

      const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber })
      const currentBlock = await publicClient.getBlockNumber()

      return {
        hash,
        from: transaction.from,
        to: transaction.to || '0x',
        value: formatUnits(transaction.value, 18),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: transaction.gasPrice?.toString() || '0',
        blockNumber: Number(receipt.blockNumber),
        timestamp: Number(block.timestamp),
        confirmations: Number(currentBlock - receipt.blockNumber),
      }
    } catch (error) {
      console.error('Failed to get transaction details:', error)
      return null
    }
  }, [publicClient])

  // Query payment history
  const { data: paymentHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['payment-history', address],
    queryFn: () => x402Service.getPaymentHistory(address!),
    enabled: !!address,
    refetchInterval: 60000, // Refetch every minute
  })

  // Health check query
  const { data: isX402Healthy } = useQuery({
    queryKey: ['x402-health'],
    queryFn: () => x402Service.healthCheck(),
    refetchInterval: 30000,
    retry: 3,
  })

  return {
    // State
    currentPayment,
    isProcessing,
    isConnected,
    address,
    chainId,
    usdcBalance,
    paymentHistory,
    isLoadingHistory,
    isX402Healthy,

    // Actions
    createPayment: createPaymentMutation.mutate,
    isCreatingPayment: createPaymentMutation.isPending,
    executePayment,
    pollPaymentStatus,
    getTransactionDetails,
    refetchBalance,

    // Utils
    formatAmount: (amount: string) => `${parseFloat(amount).toFixed(2)} USDC`,
    isValidAmount: (amount: string) => {
      const num = parseFloat(amount)
      return !isNaN(num) && num > 0 && num <= (parseFloat(usdcBalance || '0'))
    },
  }
}
