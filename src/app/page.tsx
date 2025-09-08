'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useCurrentUser, useUserNFTs, useGameActions } from '@/store/gameStore';
import { userApi, nftApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { NFTCard } from '@/components/game/NFTCard';
import { Sword, Trophy, Users, Zap, Plus, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const { isConnected, connect } = useWallet();
  const currentUser = useCurrentUser();
  const userNFTs = useUserNFTs();
  const { setUserNFTs, setLoading, addNotification } = useGameActions();
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);

  // Load user NFTs when wallet is connected
  useEffect(() => {
    const loadUserNFTs = async () => {
      if (!isConnected || !currentUser?.walletAddress) return;

      setIsLoadingNFTs(true);
      try {
        const response = await userApi.getNFTs(currentUser.walletAddress);
        if (response.success && response.data) {
          setUserNFTs(response.data);
        }
      } catch (error) {
        console.error('Failed to load NFTs:', error);
        addNotification({
          type: 'battle_result',
          title: 'Error',
          message: 'Failed to load your NFTs',
        });
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    loadUserNFTs();
  }, [isConnected, currentUser?.walletAddress, setUserNFTs, addNotification]);

  // Mock data for demonstration
  const mockStats = {
    totalPlayers: 12847,
    activeBattles: 234,
    totalBattles: 89234,
    topPlayer: '0x1234...5678',
  };

  const mockNFTs = [
    {
      nftId: '1',
      ownerAddress: currentUser?.walletAddress || '',
      attributes: {
        name: 'Cosmic Warrior',
        image: '/placeholder-nft.png',
        rarity: 'legendary',
        element: 'fire',
        power: 95,
        defense: 78,
        speed: 88,
        special: 'Flame Strike',
      },
      battleStats: {
        wins: 23,
        losses: 7,
        totalBattles: 30,
        winStreak: 5,
        highestWinStreak: 8,
        lastBattleAt: new Date(),
      },
      level: 15,
    },
    {
      nftId: '2',
      ownerAddress: currentUser?.walletAddress || '',
      attributes: {
        name: 'Void Assassin',
        image: '/placeholder-nft.png',
        rarity: 'epic',
        element: 'void',
        power: 82,
        defense: 65,
        speed: 98,
        special: 'Shadow Step',
      },
      battleStats: {
        wins: 18,
        losses: 12,
        totalBattles: 30,
        winStreak: 2,
        highestWinStreak: 6,
        lastBattleAt: new Date(),
      },
      level: 12,
    },
  ];

  // Use mock data if no real NFTs are loaded
  const displayNFTs = userNFTs.length > 0 ? userNFTs : (isConnected ? mockNFTs : []);

  if (!isConnected) {
    return (
      <div className="container-app py-8">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-display font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Nebula Arena
            </h1>
            <p className="text-body text-subtle mb-8 max-w-2xl mx-auto">
              Dominate the NFT Arena, stay connected via exclusive intel. Battle with your NFTs, 
              climb the leaderboards, and receive exclusive updates through our premium newsletter.
            </p>
            <Button size="lg" onClick={connect} className="mb-8">
              Connect Wallet to Enter Arena
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Sword className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-heading font-semibold mb-2">Epic Battles</h3>
              <p className="text-caption text-subtle">
                Engage in strategic NFT battles with fair matchmaking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-heading font-semibold mb-2">Leaderboards</h3>
              <p className="text-caption text-subtle">
                Climb the ranks and prove your dominance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-heading font-semibold mb-2">Power Progression</h3>
              <p className="text-caption text-subtle">
                Level up your NFTs and unlock new abilities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-heading font-semibold mb-2">Community</h3>
              <p className="text-caption text-subtle">
                Join our newsletter for exclusive content and updates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Arena Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockStats.totalPlayers.toLocaleString()}</div>
                <div className="text-caption text-subtle">Total Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockStats.activeBattles}</div>
                <div className="text-caption text-subtle">Active Battles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockStats.totalBattles.toLocaleString()}</div>
                <div className="text-caption text-subtle">Total Battles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockStats.topPlayer}</div>
                <div className="text-caption text-subtle">Top Player</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-display font-bold mb-2">
          Welcome back, Warrior! 🔥
        </h1>
        <p className="text-body text-subtle">
          Ready to dominate the arena? Select your NFT and start battling!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="cursor-pointer hover:bg-surface/50 transition-colors">
          <CardContent className="p-6 text-center">
            <Sword className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-heading font-semibold mb-2">Find Battle</h3>
            <p className="text-caption text-subtle mb-4">
              Enter matchmaking and find worthy opponents
            </p>
            <Button className="w-full">Start Battle</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-surface/50 transition-colors">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-heading font-semibold mb-2">Leaderboard</h3>
            <p className="text-caption text-subtle mb-4">
              Check your ranking and see top players
            </p>
            <Button variant="outline" className="w-full">View Rankings</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-surface/50 transition-colors">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-heading font-semibold mb-2">Newsletter</h3>
            <p className="text-caption text-subtle mb-4">
              Get exclusive intel and strategy tips
            </p>
            <Button variant="outline" className="w-full">Subscribe</Button>
          </CardContent>
        </Card>
      </div>

      {/* User NFTs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading font-semibold">Your Battle NFTs</h2>
          {displayNFTs.length === 0 && (
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Get NFTs
            </Button>
          )}
        </div>

        {isLoadingNFTs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="aspect-square bg-surface rounded-lg mb-4"></div>
                  <div className="h-4 bg-surface rounded mb-2"></div>
                  <div className="h-3 bg-surface rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNFTs.map((nft) => (
              <NFTCard
                key={nft.nftId}
                nft={nft}
                onClick={() => {
                  // Handle NFT selection for battle
                  addNotification({
                    type: 'battle_result',
                    title: 'NFT Selected',
                    message: `${nft.attributes.name} is ready for battle!`,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-subtle" />
              </div>
              <h3 className="text-heading font-semibold mb-2">No NFTs Found</h3>
              <p className="text-caption text-subtle mb-6">
                You need battle-ready NFTs to participate in the arena. 
                Get some NFTs to start your journey!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Browse NFT Marketplace
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Arena Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-subtle/20 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Epic battle completed</div>
                  <div className="text-xs text-subtle">Cosmic Warrior defeated Shadow Beast</div>
                </div>
              </div>
              <div className="text-xs text-subtle">2 hours ago</div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-subtle/20 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Level up achieved</div>
                  <div className="text-xs text-subtle">Void Assassin reached level 12</div>
                </div>
              </div>
              <div className="text-xs text-subtle">1 day ago</div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div>
                  <div className="text-sm font-medium">Newsletter subscribed</div>
                  <div className="text-xs text-subtle">Welcome to exclusive intel updates</div>
                </div>
              </div>
              <div className="text-xs text-subtle">3 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
