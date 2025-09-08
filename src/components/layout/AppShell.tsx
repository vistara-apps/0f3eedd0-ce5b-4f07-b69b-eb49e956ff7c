import React from 'react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { useCurrentUser, useNotifications } from '@/store/gameStore';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { formatAddress } from '@/lib/utils';
import { Sword, Home, Trophy, ShoppingBag, Mail, Bell, Wallet } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, className }) => {
  const { isConnected, address, connect, disconnect, isConnecting } = useWallet();
  const currentUser = useCurrentUser();
  const notifications = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navigation = [
    { name: 'Arena', href: '/', icon: Home, current: true },
    { name: 'Battle', href: '/battle', icon: Sword, current: false },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, current: false },
    { name: 'Shop', href: '/shop', icon: ShoppingBag, current: false },
    { name: 'Newsletter', href: '/newsletter', icon: Mail, current: false },
  ];

  return (
    <div className={cn('min-h-screen bg-bg text-text', className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-subtle/20 bg-bg/80 backdrop-blur-sm">
        <div className="container-app">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">Nebula Arena</h1>
                <p className="text-xs text-subtle">Dominate the NFT Arena</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              {isConnected && (
                <button className="relative p-2 rounded-lg hover:bg-surface/50 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-bg text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Wallet Connection */}
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <Avatar
                    size="sm"
                    src={currentUser?.walletAddress ? `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.walletAddress}` : undefined}
                    fallback={address ? address.slice(2, 4).toUpperCase() : '??'}
                  />
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{formatAddress(address!)}</div>
                    <div className="text-xs text-subtle">Connected</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnect}
                    className="text-xs"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connect}
                  loading={isConnecting}
                  className="flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-t border-subtle/20 sm:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors',
                  item.current
                    ? 'text-accent bg-accent/10'
                    : 'text-subtle hover:text-text hover:bg-surface/50'
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Side Navigation (Desktop) */}
      <nav className="fixed left-0 top-16 bottom-0 w-64 bg-surface/50 backdrop-blur-sm border-r border-subtle/20 hidden sm:block">
        <div className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  item.current
                    ? 'text-accent bg-accent/10 font-medium'
                    : 'text-subtle hover:text-text hover:bg-surface/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* User Stats (Desktop) */}
        {isConnected && currentUser && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-surface/80 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.walletAddress}`}
                  fallback={currentUser.walletAddress.slice(2, 4).toUpperCase()}
                />
                <div>
                  <div className="text-sm font-medium">{formatAddress(currentUser.walletAddress)}</div>
                  <div className="text-xs text-subtle">
                    {currentUser.newsletterOptIn ? 'Newsletter Subscriber' : 'Free Player'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-subtle">NFTs</div>
                  <div className="font-semibold">{currentUser.nfts?.length || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-subtle">Battles</div>
                  <div className="font-semibold">
                    {currentUser.nfts?.reduce((total, nft) => total + nft.battleStats.totalBattles, 0) || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content offset for desktop sidebar */}
      <div className="sm:ml-64 pb-16 sm:pb-0">
        {/* Content goes here - handled by children */}
      </div>
    </div>
  );
};

export { AppShell };
