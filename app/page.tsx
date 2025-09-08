'use client'

import { WalletConnection } from '@/components/WalletConnection'
import { PaymentForm } from '@/components/PaymentForm'
import { PaymentStatus } from '@/components/PaymentStatus'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌌 Nebula Arena Payment System
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Secure USDC payments on Base using X402 protocol
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Base Network</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>USDC Payments</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>X402 Protocol</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <WalletConnection />
          <PaymentForm />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PaymentStatus />
          
          {/* Features Card */}
          <div className="payment-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ✨ Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">X402 Integration</h4>
                  <p className="text-sm text-gray-600">Seamless payment processing with X402 protocol</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Base Network</h4>
                  <p className="text-sm text-gray-600">Fast and low-cost transactions on Base L2</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Secure Payments</h4>
                  <p className="text-sm text-gray-600">End-to-end encrypted payment processing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Real-time Tracking</h4>
                  <p className="text-sm text-gray-600">Live payment status and confirmation tracking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info Card */}
          <div className="payment-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Technical Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Protocol:</span>
                <span className="font-medium">X402</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium">Base (Ethereum L2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-medium">USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet:</span>
                <span className="font-medium">Wagmi + Viem</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-medium">Next.js 14</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Built with ❤️ for Nebula Arena • Powered by X402 Protocol
        </p>
        <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-400">
          <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
            Base Network
          </a>
          <span>•</span>
          <a href="https://www.centre.io/usdc" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
            USDC
          </a>
          <span>•</span>
          <a href="https://wagmi.sh" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
            Wagmi
          </a>
        </div>
      </div>
    </div>
  )
}
