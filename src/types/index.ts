// Core data model types based on specifications

export interface User {
  userId: string;
  walletAddress: string;
  newsletterOptIn: boolean;
  createdAt: Date;
  nfts?: NFT[];
  newsletterSubscription?: NewsletterSubscription;
}

export interface NFT {
  nftId: string;
  ownerAddress: string;
  attributes: NFTAttributes;
  battleStats: BattleStats;
  level: number;
  user?: User;
}

export interface NFTAttributes {
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  element: 'fire' | 'water' | 'earth' | 'air' | 'void';
  power: number;
  defense: number;
  speed: number;
  special?: string;
}

export interface BattleStats {
  wins: number;
  losses: number;
  totalBattles: number;
  winRate: number;
  powerScore: number;
  lastBattleAt?: Date;
}

export interface BattleLog {
  battleId: string;
  player1Id: string;
  player2Id: string;
  winnerId: string;
  timestamp: Date;
  nftUsedP1: string;
  nftUsedP2: string;
  battleResult: BattleResult;
  rewardsEarned?: BattleRewards;
}

export interface BattleResult {
  rounds: BattleRound[];
  totalRounds: number;
  winner: string;
  experience: number;
  coinsEarned: number;
}

export interface BattleRound {
  roundNumber: number;
  player1Action: string;
  player2Action: string;
  damage: { player1: number; player2: number };
  roundWinner: string;
}

export interface BattleRewards {
  experience: number;
  coins: number;
  items?: string[];
  levelUp?: boolean;
}

export interface NewsletterSubscription {
  subscriptionId: string;
  userId: string;
  tier: 'free' | 'premium' | 'elite';
  subscribedAt: Date;
  unsubscribedAt?: Date;
  preferences: NewsletterPreferences;
}

export interface NewsletterPreferences {
  gameUpdates: boolean;
  battleResults: boolean;
  specialOffers: boolean;
  communityHighlights: boolean;
  strategyTips: boolean;
}

// UI Component Types
export interface ButtonVariant {
  variant: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface CardVariant {
  variant: 'default' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export interface AvatarVariant {
  variant: 'default' | 'withStatus';
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
}

// Game State Types
export interface GameState {
  currentUser: User | null;
  selectedNFT: NFT | null;
  battleState: BattleState | null;
  matchmaking: MatchmakingState;
  notifications: Notification[];
}

export interface BattleState {
  battleId: string;
  opponent: User;
  opponentNFT: NFT;
  currentRound: number;
  playerHealth: number;
  opponentHealth: number;
  isPlayerTurn: boolean;
  availableActions: BattleAction[];
  battleLog: string[];
}

export interface BattleAction {
  id: string;
  name: string;
  type: 'attack' | 'defend' | 'special';
  damage?: number;
  cooldown?: number;
  description: string;
}

export interface MatchmakingState {
  isSearching: boolean;
  estimatedWaitTime?: number;
  searchStartTime?: Date;
  preferredOpponentLevel?: number;
}

export interface Notification {
  id: string;
  type: 'battle_found' | 'battle_result' | 'newsletter' | 'reward' | 'level_up';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Wallet and Blockchain Types
export interface WalletState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  balance?: string;
  isConnecting: boolean;
  error?: string;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  chainId: number;
}

// Newsletter Types
export interface NewsletterContent {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  tier: 'free' | 'premium' | 'elite';
  tags: string[];
  readTime: number;
}

// Shop Types
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'eth';
  category: 'cosmetic' | 'power_up' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  available: boolean;
}

export interface UserInventory {
  userId: string;
  coins: number;
  items: InventoryItem[];
  lastUpdated: Date;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: Date;
  isEquipped?: boolean;
}

// Frame Types for Base Mini App
export interface FrameMetadata {
  title: string;
  image: string;
  buttons: FrameButton[];
  inputText?: string;
  postUrl?: string;
  refreshPeriod?: number;
}

export interface FrameButton {
  label: string;
  action: 'post' | 'post_redirect' | 'link';
  target?: string;
}

export interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    inputText?: string;
    castId?: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export interface FrameResponse {
  image: string;
  buttons?: FrameButton[];
  inputText?: string;
  postUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}
