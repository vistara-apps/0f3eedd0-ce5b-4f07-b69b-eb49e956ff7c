import axios, { AxiosInstance, AxiosError } from 'axios'
import { X402_CONFIG } from './wagmi'
import { 
  X402PaymentRequest, 
  X402PaymentResponse, 
  PaymentResponse, 
  PaymentStatus,
  PaymentError 
} from '@/types/payment'

class X402Service {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${X402_CONFIG.baseUrl}/${X402_CONFIG.version}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${X402_CONFIG.apiKey}`,
        'X-API-Version': X402_CONFIG.version,
      },
      timeout: 30000, // 30 seconds
    })

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[X402] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        })
        return config
      },
      (error) => {
        console.error('[X402] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[X402] Response ${response.status}:`, response.data)
        return response
      },
      (error: AxiosError) => {
        console.error('[X402] Response error:', error.response?.data || error.message)
        return Promise.reject(this.handleError(error))
      }
    )
  }

  /**
   * Create a new payment request
   */
  async createPayment(request: X402PaymentRequest): Promise<X402PaymentResponse> {
    try {
      const response = await this.client.post('/payments', request)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Get payment status by ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.get(`/payments/${paymentId}`)
      return this.mapToPaymentResponse(response.data)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await this.client.delete(`/payments/${paymentId}`)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Verify payment completion
   */
  async verifyPayment(paymentId: string, transactionHash: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.post(`/payments/${paymentId}/verify`, {
        transactionHash,
      })
      return this.mapToPaymentResponse(response.data)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Get payment history for an address
   */
  async getPaymentHistory(address: string, limit = 10, offset = 0): Promise<PaymentResponse[]> {
    try {
      const response = await this.client.get('/payments', {
        params: { address, limit, offset },
      })
      return response.data.payments.map(this.mapToPaymentResponse)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Health check for X402 service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200
    } catch (error) {
      console.error('[X402] Health check failed:', error)
      return false
    }
  }

  /**
   * Map X402 response to internal PaymentResponse format
   */
  private mapToPaymentResponse(data: any): PaymentResponse {
    return {
      id: data.paymentId || data.id,
      status: this.mapStatus(data.status),
      transactionHash: data.transactionHash,
      blockNumber: data.blockNumber,
      confirmations: data.confirmations,
      error: data.error,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }

  /**
   * Map X402 status to internal PaymentStatus enum
   */
  private mapStatus(status: string): PaymentStatus {
    switch (status.toLowerCase()) {
      case 'pending':
        return PaymentStatus.PENDING
      case 'processing':
      case 'submitted':
        return PaymentStatus.PROCESSING
      case 'confirmed':
      case 'completed':
        return PaymentStatus.CONFIRMED
      case 'failed':
      case 'rejected':
        return PaymentStatus.FAILED
      case 'expired':
      case 'cancelled':
        return PaymentStatus.EXPIRED
      default:
        return PaymentStatus.PENDING
    }
  }

  /**
   * Handle and format errors from X402 API
   */
  private handleError(error: AxiosError): PaymentError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any
      return {
        code: data.code || `HTTP_${error.response.status}`,
        message: data.message || error.message,
        details: data.details || error.response.data,
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        code: 'NETWORK_ERROR',
        message: 'No response from X402 service',
        details: error.request,
      }
    } else {
      // Something else happened
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error,
      }
    }
  }
}

// Export singleton instance
export const x402Service = new X402Service()

// Export class for testing
export { X402Service }
