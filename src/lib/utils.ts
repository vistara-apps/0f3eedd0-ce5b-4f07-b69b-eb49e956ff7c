import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, totalBattles: number): number {
  if (totalBattles === 0) return 0;
  return Math.round((wins / totalBattles) * 100);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: string): string {
  const ether = BigInt(wei) / BigInt(10 ** 18);
  return ether.toString();
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: string): string {
  const wei = BigInt(Math.floor(parseFloat(ether) * 10 ** 18));
  return wei.toString();
}

/**
 * Get rarity color class
 */
export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'text-gray-400';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'legendary':
      return 'text-accent';
    default:
      return 'text-gray-400';
  }
}

/**
 * Get element color class
 */
export function getElementColor(element: string): string {
  switch (element.toLowerCase()) {
    case 'fire':
      return 'text-red-400';
    case 'water':
      return 'text-blue-400';
    case 'earth':
      return 'text-green-400';
    case 'air':
      return 'text-cyan-400';
    case 'void':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Calculate battle power score
 */
export function calculatePowerScore(
  power: number,
  defense: number,
  speed: number,
  level: number
): number {
  return Math.floor((power * 2 + defense + speed) * (1 + level * 0.1));
}

/**
 * Generate battle damage with randomness
 */
export function calculateBattleDamage(
  attackerPower: number,
  defenderDefense: number,
  randomFactor = 0.2
): number {
  const baseDamage = Math.max(1, attackerPower - defenderDefense);
  const randomMultiplier = 1 + (Math.random() - 0.5) * randomFactor;
  return Math.floor(baseDamage * randomMultiplier);
}

/**
 * Check if battle action is on cooldown
 */
export function isActionOnCooldown(
  lastUsed: Date,
  cooldownSeconds: number
): boolean {
  const now = new Date();
  const timeDiff = (now.getTime() - lastUsed.getTime()) / 1000;
  return timeDiff < cooldownSeconds;
}

/**
 * Format battle log message
 */
export function formatBattleLog(
  action: string,
  attacker: string,
  defender: string,
  damage?: number
): string {
  if (damage) {
    return `${attacker} used ${action} on ${defender} for ${damage} damage!`;
  }
  return `${attacker} used ${action}!`;
}

/**
 * Generate Frame metadata for Base Mini App
 */
export function generateFrameMetadata(
  title: string,
  image: string,
  buttons: Array<{ label: string; action: string; target?: string }>
) {
  return {
    'fc:frame': 'vNext',
    'fc:frame:title': title,
    'fc:frame:image': image,
    ...buttons.reduce((acc, button, index) => {
      acc[`fc:frame:button:${index + 1}`] = button.label;
      if (button.action !== 'post') {
        acc[`fc:frame:button:${index + 1}:action`] = button.action;
      }
      if (button.target) {
        acc[`fc:frame:button:${index + 1}:target`] = button.target;
      }
      return acc;
    }, {} as Record<string, string>),
  };
}

/**
 * Validate Frame request signature
 */
export async function validateFrameRequest(
  body: any,
  trustedData: string
): Promise<boolean> {
  // Implementation would depend on Farcaster's signature validation
  // This is a placeholder for the actual validation logic
  try {
    // Validate the trusted data signature
    // This would involve cryptographic verification
    return true;
  } catch (error) {
    console.error('Frame validation error:', error);
    return false;
  }
}

/**
 * Parse IPFS URL to gateway URL
 */
export function parseIPFSUrl(ipfsUrl: string): string {
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${hash}`;
  }
  return ipfsUrl;
}

/**
 * Retry async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError!;
}
