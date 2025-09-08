'use client'

import { useState } from 'react'
import { usePayment } from '@/hooks/usePayment'
import { PaymentRequest } from '@/types/payment'
import { Address } from 'viem'

export function PaymentForm() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const {
    createPayment,
    isCreatingPayment,
    usdcBalance,
    isConnected,
    formatAmount,
    isValidAmount,
    isX402Healthy,
  } = usePayment({
    onSuccess: (payment) => {
      console.log('Payment successful:', payment)
      // Reset form
      setAmount('')
      setRecipient('')
      setDescription('')
      setErrors({})
    },
    onError: (error) => {
      console.error('Payment failed:', error)
      setErrors({ general: error.message })
    },
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (!isValidAmount(amount)) {
      newErrors.amount = 'Invalid amount or insufficient balance'
    }

    // Validate recipient
    if (!recipient) {
      newErrors.recipient = 'Recipient address is required'
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      newErrors.recipient = 'Invalid Ethereum address'
    }

    // Check if X402 service is healthy
    if (!isX402Healthy) {
      newErrors.general = 'X402 payment service is currently unavailable'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const paymentRequest: PaymentRequest = {
      id: `payment-${Date.now()}`,
      amount,
      recipient: recipient as Address,
      description: description || undefined,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'nebula-arena',
      },
    }

    createPayment(paymentRequest)
  }

  if (!isConnected) {
    return (
      <div className="payment-card">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Required</h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to make payments
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isX402Healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-xs ${isX402Healthy ? 'text-green-600' : 'text-red-600'}`}>
            X402 {isX402Healthy ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-6 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">USDC Balance</span>
          <span className="text-lg font-bold text-blue-900">
            {formatAmount(usdcBalance || '0')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={usdcBalance || '0'}
              className={`payment-input ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">USDC</span>
            </div>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Recipient Input */}
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={`payment-input ${errors.recipient ? 'border-red-300 focus:ring-red-500' : ''}`}
          />
          {errors.recipient && (
            <p className="mt-1 text-sm text-red-600">{errors.recipient}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for..."
            className="payment-input"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreatingPayment || !isX402Healthy}
          className="payment-button w-full flex items-center justify-center space-x-2"
        >
          {isCreatingPayment ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Send Payment</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Amount Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick amounts:</p>
        <div className="flex space-x-2">
          {['1', '5', '10', '25'].map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(quickAmount)}
              disabled={parseFloat(quickAmount) > parseFloat(usdcBalance || '0')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
