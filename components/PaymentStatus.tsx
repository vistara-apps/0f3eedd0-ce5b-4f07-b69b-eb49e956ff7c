'use client'

import { useEffect, useState } from 'react'
import { usePayment } from '@/hooks/usePayment'
import { PaymentStatus as PaymentStatusEnum, TransactionDetails } from '@/types/payment'

export function PaymentStatus() {
  const { currentPayment, getTransactionDetails } = usePayment()
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  useEffect(() => {
    if (currentPayment?.transactionHash && !transactionDetails) {
      setIsLoadingDetails(true)
      getTransactionDetails(currentPayment.transactionHash)
        .then(setTransactionDetails)
        .catch(console.error)
        .finally(() => setIsLoadingDetails(false))
    }
  }, [currentPayment?.transactionHash, getTransactionDetails, transactionDetails])

  if (!currentPayment) {
    return null
  }

  const getStatusColor = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.CONFIRMED:
        return 'status-success'
      case PaymentStatusEnum.FAILED:
      case PaymentStatusEnum.EXPIRED:
        return 'status-error'
      case PaymentStatusEnum.PENDING:
      case PaymentStatusEnum.PROCESSING:
        return 'status-pending'
      default:
        return 'status-pending'
    }
  }

  const getStatusIcon = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.CONFIRMED:
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case PaymentStatusEnum.FAILED:
      case PaymentStatusEnum.EXPIRED:
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case PaymentStatusEnum.PENDING:
      case PaymentStatusEnum.PROCESSING:
        return (
          <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
        )
      default:
        return null
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="payment-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(currentPayment.status)}`}>
          {getStatusIcon(currentPayment.status)}
          <span className="text-sm font-medium capitalize">
            {currentPayment.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Payment ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment ID
          </label>
          <div className="bg-gray-50 p-2 rounded-md">
            <code className="text-sm text-gray-800">{currentPayment.id}</code>
          </div>
        </div>

        {/* Transaction Hash */}
        {currentPayment.transactionHash && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Hash
            </label>
            <div className="bg-gray-50 p-2 rounded-md">
              <a
                href={`https://basescan.org/tx/${currentPayment.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {formatAddress(currentPayment.transactionHash)}
              </a>
            </div>
          </div>
        )}

        {/* Block Number & Confirmations */}
        {currentPayment.blockNumber && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Number
              </label>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-800">
                  {currentPayment.blockNumber.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmations
              </label>
              <div className="bg-gray-50 p-2 rounded-md">
                <span className="text-sm text-gray-800">
                  {currentPayment.confirmations || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created At
            </label>
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="text-sm text-gray-800">
                {formatTimestamp(currentPayment.createdAt)}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated At
            </label>
            <div className="bg-gray-50 p-2 rounded-md">
              <span className="text-sm text-gray-800">
                {formatTimestamp(currentPayment.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {currentPayment.error && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Error
            </label>
            <div className="bg-red-50 border border-red-200 p-2 rounded-md">
              <span className="text-sm text-red-600">{currentPayment.error}</span>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        {transactionDetails && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Transaction Details</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <code className="text-sm text-gray-800">
                      {formatAddress(transactionDetails.from)}
                    </code>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <code className="text-sm text-gray-800">
                      {formatAddress(transactionDetails.to)}
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gas Used
                  </label>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-800">
                      {parseInt(transactionDetails.gasUsed).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gas Price (Gwei)
                  </label>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-800">
                      {(parseInt(transactionDetails.gasPrice) / 1e9).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Transaction Details */}
        {isLoadingDetails && (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
            <span className="text-sm text-gray-600">Loading transaction details...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
        {currentPayment.transactionHash && (
          <a
            href={`https://basescan.org/tx/${currentPayment.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View on BaseScan
          </a>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Refresh Status
        </button>
      </div>
    </div>
  )
}
