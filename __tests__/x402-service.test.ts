import { X402Service } from '@/lib/x402-service'
import { PaymentStatus } from '@/types/payment'

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}))

describe('X402Service', () => {
  let service: X402Service
  let mockAxios: any

  beforeEach(() => {
    service = new X402Service()
    mockAxios = (service as any).client
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createPayment', () => {
    it('should create a payment request successfully', async () => {
      const mockResponse = {
        data: {
          paymentId: 'test-payment-id',
          status: 'pending',
          paymentUrl: 'https://example.com/pay',
          expiresAt: '2024-01-01T00:00:00Z',
        },
      }

      mockAxios.post.mockResolvedValue(mockResponse)

      const request = {
        amount: '10.00',
        currency: 'USDC' as const,
        network: 'base' as const,
        recipient: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        description: 'Test payment',
      }

      const result = await service.createPayment(request)

      expect(mockAxios.post).toHaveBeenCalledWith('/payments', request)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle payment creation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            code: 'INVALID_AMOUNT',
            message: 'Amount must be positive',
          },
        },
      }

      mockAxios.post.mockRejectedValue(mockError)

      const request = {
        amount: '-10.00',
        currency: 'USDC' as const,
        network: 'base' as const,
        recipient: '0x1234567890123456789012345678901234567890' as `0x${string}`,
      }

      await expect(service.createPayment(request)).rejects.toMatchObject({
        code: 'INVALID_AMOUNT',
        message: 'Amount must be positive',
      })
    })
  })

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      const mockResponse = {
        data: {
          paymentId: 'test-payment-id',
          status: 'confirmed',
          transactionHash: '0xabcdef',
          blockNumber: 12345,
          confirmations: 10,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:05:00Z',
        },
      }

      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await service.getPaymentStatus('test-payment-id')

      expect(mockAxios.get).toHaveBeenCalledWith('/payments/test-payment-id')
      expect(result.status).toBe(PaymentStatus.CONFIRMED)
      expect(result.id).toBe('test-payment-id')
    })
  })

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockResponse = {
        data: {
          paymentId: 'test-payment-id',
          status: 'confirmed',
          transactionHash: '0xabcdef',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:05:00Z',
        },
      }

      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await service.verifyPayment('test-payment-id', '0xabcdef')

      expect(mockAxios.post).toHaveBeenCalledWith('/payments/test-payment-id/verify', {
        transactionHash: '0xabcdef',
      })
      expect(result.status).toBe(PaymentStatus.CONFIRMED)
    })
  })

  describe('healthCheck', () => {
    it('should return true when service is healthy', async () => {
      mockAxios.get.mockResolvedValue({ status: 200 })

      const result = await service.healthCheck()

      expect(mockAxios.get).toHaveBeenCalledWith('/health')
      expect(result).toBe(true)
    })

    it('should return false when service is unhealthy', async () => {
      mockAxios.get.mockRejectedValue(new Error('Service unavailable'))

      const result = await service.healthCheck()

      expect(result).toBe(false)
    })
  })

  describe('status mapping', () => {
    it('should map X402 statuses to internal PaymentStatus enum', () => {
      const testCases = [
        { x402Status: 'pending', expected: PaymentStatus.PENDING },
        { x402Status: 'processing', expected: PaymentStatus.PROCESSING },
        { x402Status: 'submitted', expected: PaymentStatus.PROCESSING },
        { x402Status: 'confirmed', expected: PaymentStatus.CONFIRMED },
        { x402Status: 'completed', expected: PaymentStatus.CONFIRMED },
        { x402Status: 'failed', expected: PaymentStatus.FAILED },
        { x402Status: 'rejected', expected: PaymentStatus.FAILED },
        { x402Status: 'expired', expected: PaymentStatus.EXPIRED },
        { x402Status: 'cancelled', expected: PaymentStatus.EXPIRED },
        { x402Status: 'unknown', expected: PaymentStatus.PENDING },
      ]

      testCases.forEach(({ x402Status, expected }) => {
        const mapped = (service as any).mapStatus(x402Status)
        expect(mapped).toBe(expected)
      })
    })
  })
})
