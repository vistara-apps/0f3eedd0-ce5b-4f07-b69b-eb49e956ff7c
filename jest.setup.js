import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_X402_BASE_URL = 'https://api.x402.test.com'
process.env.NEXT_PUBLIC_X402_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'test-project-id'

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
    isPending: false,
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
  useChainId: jest.fn(() => 8453), // Base mainnet
  useSwitchChain: jest.fn(() => ({
    switchChain: jest.fn(),
  })),
  useWalletClient: jest.fn(() => ({
    data: {
      writeContract: jest.fn(),
    },
  })),
  usePublicClient: jest.fn(() => ({
    readContract: jest.fn(),
    getTransaction: jest.fn(),
    getTransactionReceipt: jest.fn(),
    getBlock: jest.fn(),
    getBlockNumber: jest.fn(),
  })),
  createConfig: jest.fn(),
  http: jest.fn(),
}))

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
  QueryClientProvider: ({ children }) => children,
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
