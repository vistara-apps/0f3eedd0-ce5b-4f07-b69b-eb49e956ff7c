'use client'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export function WalletConnection() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const isOnBase = chainId === base.id || chainId === baseSepolia.id
  const currentChain = chainId === base.id ? 'Base Mainnet' : 
                     chainId === baseSepolia.id ? 'Base Sepolia' : 'Unknown'

  if (isConnected && address) {
    return (
      <div className="payment-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Wallet Connected</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Connected</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="bg-gray-50 p-2 rounded-md">
              <code className="text-sm text-gray-800">
                {address.slice(0, 6)}...{address.slice(-4)}
              </code>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Network
            </label>
            <div className="flex items-center justify-between">
              <span className={`text-sm px-2 py-1 rounded ${
                isOnBase ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentChain}
              </span>
              {!isOnBase && (
                <button
                  onClick={() => switchChain({ chainId: base.id })}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Switch to Base
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connector
            </label>
            <span className="text-sm text-gray-600 capitalize">
              {connector?.name || 'Unknown'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => disconnect()}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="payment-card">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-sm text-gray-600">
          Connect your wallet to start making payments with USDC on Base
        </p>
      </div>
      
      <div className="space-y-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{connector.name}</span>
            {isPending && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-700">
          💡 Make sure you're connected to Base network for USDC payments
        </p>
      </div>
    </div>
  )
}
