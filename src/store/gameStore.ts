import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  User,
  NFT,
  BattleState,
  MatchmakingState,
  Notification,
  WalletState,
  UserInventory,
} from '@/types';

interface GameState {
  // User state
  currentUser: User | null;
  walletState: WalletState;
  
  // NFT state
  userNFTs: NFT[];
  selectedNFT: NFT | null;
  
  // Battle state
  battleState: BattleState | null;
  matchmaking: MatchmakingState;
  
  // UI state
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  // Inventory state
  inventory: UserInventory | null;
  
  // Newsletter state
  newsletterOptIn: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setWalletState: (state: Partial<WalletState>) => void;
  setUserNFTs: (nfts: NFT[]) => void;
  setSelectedNFT: (nft: NFT | null) => void;
  setBattleState: (state: BattleState | null) => void;
  setMatchmaking: (state: Partial<MatchmakingState>) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInventory: (inventory: UserInventory | null) => void;
  setNewsletterOptIn: (optIn: boolean) => void;
  
  // Complex actions
  connectWallet: (address: string, chainId: number) => void;
  disconnectWallet: () => void;
  startMatchmaking: (nftId: string, preferredLevel?: number) => void;
  stopMatchmaking: () => void;
  updateNFTStats: (nftId: string, stats: Partial<NFT['battleStats']>) => void;
  clearBattleState: () => void;
  reset: () => void;
}

const initialMatchmakingState: MatchmakingState = {
  isSearching: false,
  estimatedWaitTime: undefined,
  searchStartTime: undefined,
  preferredOpponentLevel: undefined,
};

const initialWalletState: WalletState = {
  isConnected: false,
  address: undefined,
  chainId: undefined,
  balance: undefined,
  isConnecting: false,
  error: undefined,
};

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: null,
        walletState: initialWalletState,
        userNFTs: [],
        selectedNFT: null,
        battleState: null,
        matchmaking: initialMatchmakingState,
        notifications: [],
        isLoading: false,
        error: null,
        inventory: null,
        newsletterOptIn: false,

        // Basic setters
        setCurrentUser: (user) => set({ currentUser: user }),
        
        setWalletState: (state) =>
          set((prev) => ({
            walletState: { ...prev.walletState, ...state },
          })),
        
        setUserNFTs: (nfts) => set({ userNFTs: nfts }),
        
        setSelectedNFT: (nft) => set({ selectedNFT: nft }),
        
        setBattleState: (state) => set({ battleState: state }),
        
        setMatchmaking: (state) =>
          set((prev) => ({
            matchmaking: { ...prev.matchmaking, ...state },
          })),
        
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              {
                ...notification,
                id: Math.random().toString(36).substring(2),
                timestamp: new Date(),
                read: false,
              },
              ...state.notifications,
            ],
          })),
        
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        
        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        setInventory: (inventory) => set({ inventory }),
        
        setNewsletterOptIn: (optIn) => set({ newsletterOptIn: optIn }),

        // Complex actions
        connectWallet: (address, chainId) => {
          set({
            walletState: {
              isConnected: true,
              address,
              chainId,
              isConnecting: false,
              error: undefined,
            },
          });
        },

        disconnectWallet: () => {
          set({
            walletState: initialWalletState,
            currentUser: null,
            userNFTs: [],
            selectedNFT: null,
            battleState: null,
            matchmaking: initialMatchmakingState,
            inventory: null,
          });
        },

        startMatchmaking: (nftId, preferredLevel) => {
          const nft = get().userNFTs.find((n) => n.nftId === nftId);
          if (nft) {
            set({
              selectedNFT: nft,
              matchmaking: {
                isSearching: true,
                searchStartTime: new Date(),
                preferredOpponentLevel: preferredLevel,
                estimatedWaitTime: 30, // Initial estimate
              },
            });
          }
        },

        stopMatchmaking: () => {
          set({
            matchmaking: initialMatchmakingState,
          });
        },

        updateNFTStats: (nftId, stats) => {
          set((state) => ({
            userNFTs: state.userNFTs.map((nft) =>
              nft.nftId === nftId
                ? {
                    ...nft,
                    battleStats: { ...nft.battleStats, ...stats },
                  }
                : nft
            ),
            selectedNFT:
              state.selectedNFT?.nftId === nftId
                ? {
                    ...state.selectedNFT,
                    battleStats: { ...state.selectedNFT.battleStats, ...stats },
                  }
                : state.selectedNFT,
          }));
        },

        clearBattleState: () => {
          set({
            battleState: null,
            matchmaking: initialMatchmakingState,
          });
        },

        reset: () => {
          set({
            currentUser: null,
            walletState: initialWalletState,
            userNFTs: [],
            selectedNFT: null,
            battleState: null,
            matchmaking: initialMatchmakingState,
            notifications: [],
            isLoading: false,
            error: null,
            inventory: null,
            newsletterOptIn: false,
          });
        },
      }),
      {
        name: 'nebula-arena-game-state',
        partialize: (state) => ({
          currentUser: state.currentUser,
          walletState: state.walletState,
          userNFTs: state.userNFTs,
          selectedNFT: state.selectedNFT,
          newsletterOptIn: state.newsletterOptIn,
          inventory: state.inventory,
        }),
      }
    ),
    {
      name: 'nebula-arena-store',
    }
  )
);

// Selectors for better performance
export const useWallet = () => useGameStore((state) => state.walletState);
export const useCurrentUser = () => useGameStore((state) => state.currentUser);
export const useUserNFTs = () => useGameStore((state) => state.userNFTs);
export const useSelectedNFT = () => useGameStore((state) => state.selectedNFT);
export const useBattleState = () => useGameStore((state) => state.battleState);
export const useMatchmaking = () => useGameStore((state) => state.matchmaking);
export const useNotifications = () => useGameStore((state) => state.notifications);
export const useInventory = () => useGameStore((state) => state.inventory);

// Action selectors
export const useGameActions = () =>
  useGameStore((state) => ({
    setCurrentUser: state.setCurrentUser,
    setWalletState: state.setWalletState,
    setUserNFTs: state.setUserNFTs,
    setSelectedNFT: state.setSelectedNFT,
    setBattleState: state.setBattleState,
    setMatchmaking: state.setMatchmaking,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    markNotificationAsRead: state.markNotificationAsRead,
    setLoading: state.setLoading,
    setError: state.setError,
    setInventory: state.setInventory,
    setNewsletterOptIn: state.setNewsletterOptIn,
    connectWallet: state.connectWallet,
    disconnectWallet: state.disconnectWallet,
    startMatchmaking: state.startMatchmaking,
    stopMatchmaking: state.stopMatchmaking,
    updateNFTStats: state.updateNFTStats,
    clearBattleState: state.clearBattleState,
    reset: state.reset,
  }));
