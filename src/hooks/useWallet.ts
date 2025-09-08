import { useCallback, useEffect } from 'react';
import { useGameActions, useWallet as useWalletState } from '@/store/gameStore';
import { userApi, blockchainApi } from '@/lib/api';
import { isValidAddress } from '@/lib/utils';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const walletState = useWalletState();
  const { setWalletState, connectWallet, disconnectWallet, setCurrentUser, addNotification } = useGameActions();

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      addNotification({
        type: 'battle_result',
        title: 'Wallet Not Found',
        message: 'Please install a Web3 wallet like MetaMask or use Base Wallet.',
      });
      return;
    }

    try {
      setWalletState({ isConnecting: true, error: undefined });

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      const numericChainId = parseInt(chainId, 16);

      // Check if we're on Base network (8453)
      if (numericChainId !== 8453) {
        try {
          // Try to switch to Base network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }], // Base mainnet
          });
        } catch (switchError: any) {
          // If the chain hasn't been added to the user's wallet
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x2105',
                    chainName: 'Base',
                    nativeCurrency: {
                      name: 'Ethereum',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org'],
                  },
                ],
              });
            } catch (addError) {
              throw new Error('Failed to add Base network');
            }
          } else {
            throw switchError;
          }
        }
      }

      // Get balance
      const balanceResponse = await blockchainApi.getBalance(address);
      const balance = balanceResponse.success ? balanceResponse.data?.result : '0';

      // Connect wallet in store
      connectWallet(address, 8453);
      setWalletState({ balance, isConnecting: false });

      // Fetch or create user profile
      const userResponse = await userApi.getProfile(address);
      if (userResponse.success && userResponse.data) {
        setCurrentUser(userResponse.data);
      } else {
        // Create new user profile
        const newUser = {
          userId: address,
          walletAddress: address,
          newsletterOptIn: false,
          createdAt: new Date(),
        };
        setCurrentUser(newUser);
      }

      addNotification({
        type: 'battle_result',
        title: 'Wallet Connected',
        message: `Successfully connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setWalletState({
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      });
      
      addNotification({
        type: 'battle_result',
        title: 'Connection Failed',
        message: error.message || 'Failed to connect wallet',
      });
    }
  }, [setWalletState, connectWallet, setCurrentUser, addNotification]);

  const disconnect = useCallback(() => {
    disconnectWallet();
    addNotification({
      type: 'battle_result',
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected.',
    });
  }, [disconnectWallet, addNotification]);

  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      console.error('Network switch error:', error);
      addNotification({
        type: 'battle_result',
        title: 'Network Switch Failed',
        message: 'Failed to switch network',
      });
    }
  }, [addNotification]);

  const signMessage = useCallback(async (message: string) => {
    if (!window.ethereum || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletState.address],
      });
      return signature;
    } catch (error: any) {
      console.error('Message signing error:', error);
      throw new Error('Failed to sign message');
    }
  }, [walletState.address]);

  // Listen for account and network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== walletState.address) {
        // Account changed, reconnect
        connect();
      }
    };

    const handleChainChanged = (chainId: string) => {
      const numericChainId = parseInt(chainId, 16);
      setWalletState({ chainId: numericChainId });
      
      if (numericChainId !== 8453) {
        addNotification({
          type: 'battle_result',
          title: 'Wrong Network',
          message: 'Please switch to Base network for full functionality.',
        });
      }
    };

    const handleDisconnect = () => {
      disconnect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [walletState.address, connect, disconnect, setWalletState, addNotification]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0 && !walletState.isConnected) {
          connect();
        }
      } catch (error) {
        console.error('Auto-connect error:', error);
      }
    };

    autoConnect();
  }, [connect, walletState.isConnected]);

  return {
    ...walletState,
    connect,
    disconnect,
    switchNetwork,
    signMessage,
    isWalletAvailable: !!window.ethereum,
    isCorrectNetwork: walletState.chainId === 8453,
  };
}
