import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';
import { retryWithBackoff } from './utils';

/**
 * Base API client configuration
 */
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }
}

// Create API client instances
export const api = new ApiClient();
export const baseApi = new ApiClient(process.env.NEXT_PUBLIC_BASE_RPC_URL);
export const newsletterApi = new ApiClient(process.env.NEXT_PUBLIC_NEWSLETTER_API_URL);
export const farcasterApi = new ApiClient(process.env.NEXT_PUBLIC_FARCASTER_HUB_URL);

/**
 * User API functions
 */
export const userApi = {
  async getProfile(address: string) {
    return api.get(`/users/${address}`);
  },

  async updateProfile(address: string, data: any) {
    return api.put(`/users/${address}`, data);
  },

  async getNFTs(address: string) {
    return api.get(`/users/${address}/nfts`);
  },

  async getBattleHistory(address: string, page = 1, limit = 10) {
    return api.get<PaginatedResponse<any>>(`/users/${address}/battles`, {
      page,
      limit,
    });
  },
};

/**
 * NFT API functions
 */
export const nftApi = {
  async getNFT(nftId: string) {
    return api.get(`/nfts/${nftId}`);
  },

  async getNFTMetadata(tokenId: string, contractAddress: string) {
    return api.get(`/nfts/metadata`, {
      tokenId,
      contractAddress,
    });
  },

  async updateNFTStats(nftId: string, stats: any) {
    return api.put(`/nfts/${nftId}/stats`, stats);
  },
};

/**
 * Battle API functions
 */
export const battleApi = {
  async findMatch(nftId: string, preferredLevel?: number) {
    return api.post('/battles/matchmaking', {
      nftId,
      preferredLevel,
    });
  },

  async getBattle(battleId: string) {
    return api.get(`/battles/${battleId}`);
  },

  async performAction(battleId: string, action: string) {
    return api.post(`/battles/${battleId}/action`, { action });
  },

  async getBattleHistory(page = 1, limit = 10) {
    return api.get<PaginatedResponse<any>>('/battles/history', {
      page,
      limit,
    });
  },

  async getLeaderboard(page = 1, limit = 10) {
    return api.get<PaginatedResponse<any>>('/battles/leaderboard', {
      page,
      limit,
    });
  },
};

/**
 * Newsletter API functions
 */
export const newsletterApiService = {
  async subscribe(email: string, walletAddress: string, tier = 'free') {
    return api.post('/newsletter/subscribe', {
      email,
      walletAddress,
      tier,
    });
  },

  async unsubscribe(subscriptionId: string) {
    return api.post('/newsletter/unsubscribe', { subscriptionId });
  },

  async updatePreferences(subscriptionId: string, preferences: any) {
    return api.put(`/newsletter/preferences/${subscriptionId}`, preferences);
  },

  async getContent(tier = 'free', page = 1, limit = 10) {
    return api.get<PaginatedResponse<any>>('/newsletter/content', {
      tier,
      page,
      limit,
    });
  },
};

/**
 * Shop API functions
 */
export const shopApi = {
  async getItems(category?: string, page = 1, limit = 20) {
    return api.get<PaginatedResponse<any>>('/shop/items', {
      category,
      page,
      limit,
    });
  },

  async purchaseItem(itemId: string, quantity = 1) {
    return api.post('/shop/purchase', {
      itemId,
      quantity,
    });
  },

  async getUserInventory(address: string) {
    return api.get(`/shop/inventory/${address}`);
  },

  async equipItem(itemId: string, nftId: string) {
    return api.post('/shop/equip', {
      itemId,
      nftId,
    });
  },
};

/**
 * Blockchain API functions
 */
export const blockchainApi = {
  async getBalance(address: string) {
    return retryWithBackoff(async () => {
      const response = await baseApi.post('', {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      });
      return response;
    });
  },

  async getNFTOwnership(contractAddress: string, tokenId: string) {
    return retryWithBackoff(async () => {
      const response = await baseApi.post('', {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: contractAddress,
            data: `0x6352211e${tokenId.padStart(64, '0')}`, // ownerOf(uint256)
          },
          'latest',
        ],
        id: 1,
      });
      return response;
    });
  },

  async getTransactionReceipt(txHash: string) {
    return retryWithBackoff(async () => {
      const response = await baseApi.post('', {
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1,
      });
      return response;
    });
  },
};

/**
 * Farcaster API functions
 */
export const farcasterApiService = {
  async getUserProfile(fid: number) {
    return retryWithBackoff(async () => {
      const response = await farcasterApi.get(`/users/${fid}`);
      return response;
    });
  },

  async getUserByAddress(address: string) {
    return retryWithBackoff(async () => {
      const response = await farcasterApi.get(`/users?addresses=${address}`);
      return response;
    });
  },

  async getCasts(fid: number, limit = 10) {
    return retryWithBackoff(async () => {
      const response = await farcasterApi.get(`/casts?fid=${fid}&limit=${limit}`);
      return response;
    });
  },
};

/**
 * IPFS API functions
 */
export const ipfsApi = {
  async uploadMetadata(metadata: any) {
    return api.post('/ipfs/upload', metadata);
  },

  async getMetadata(hash: string) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${hash}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

/**
 * Frame API functions for Base Mini App
 */
export const frameApi = {
  async validateRequest(frameData: any) {
    return api.post('/frames/validate', frameData);
  },

  async processAction(frameData: any) {
    return api.post('/frames/action', frameData);
  },

  async generateImage(data: any) {
    return api.post('/frames/image', data);
  },
};

/**
 * Analytics API functions
 */
export const analyticsApi = {
  async trackEvent(event: string, properties: any) {
    return api.post('/analytics/track', {
      event,
      properties,
      timestamp: new Date().toISOString(),
    });
  },

  async getStats(timeRange = '7d') {
    return api.get(`/analytics/stats?range=${timeRange}`);
  },
};

/**
 * Notification API functions
 */
export const notificationApi = {
  async getNotifications(page = 1, limit = 20) {
    return api.get<PaginatedResponse<any>>('/notifications', {
      page,
      limit,
    });
  },

  async markAsRead(notificationId: string) {
    return api.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead() {
    return api.put('/notifications/read-all');
  },

  async subscribe(endpoint: string, keys: any) {
    return api.post('/notifications/subscribe', {
      endpoint,
      keys,
    });
  },
};
