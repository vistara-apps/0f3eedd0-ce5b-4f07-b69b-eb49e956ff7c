import React from 'react';
import { cn, getRarityColor, getElementColor, calculatePowerScore } from '@/lib/utils';
import { NFT } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing } from '@/components/ui/ProgressRing';

interface NFTCardProps {
  nft: NFT;
  selected?: boolean;
  onClick?: () => void;
  showStats?: boolean;
  className?: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  selected = false,
  onClick,
  showStats = true,
  className,
}) => {
  const powerScore = calculatePowerScore(
    nft.attributes.power,
    nft.attributes.defense,
    nft.attributes.speed,
    nft.level
  );

  const winRate = nft.battleStats.totalBattles > 0 
    ? Math.round((nft.battleStats.wins / nft.battleStats.totalBattles) * 100)
    : 0;

  return (
    <Card
      className={cn(
        'nft-card',
        `nft-card-rarity-${nft.attributes.rarity}`,
        {
          'nft-card-selected': selected,
        },
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm truncate">{nft.attributes.name}</CardTitle>
          <div className="flex items-center space-x-1">
            <span className={cn('text-xs font-medium', getRarityColor(nft.attributes.rarity))}>
              {nft.attributes.rarity.toUpperCase()}
            </span>
            <span className="text-xs text-subtle">Lv.{nft.level}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* NFT Image */}
        <div className="relative mb-3">
          <div className="aspect-square rounded-md overflow-hidden bg-surface/50">
            <img
              src={nft.attributes.image}
              alt={nft.attributes.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-nft.png';
              }}
            />
          </div>
          
          {/* Element Badge */}
          <div className="absolute top-2 left-2">
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium bg-bg/80 backdrop-blur-sm',
              getElementColor(nft.attributes.element)
            )}>
              {nft.attributes.element}
            </div>
          </div>

          {/* Power Score */}
          <div className="absolute top-2 right-2">
            <div className="px-2 py-1 rounded-full text-xs font-bold bg-accent/90 text-bg">
              {powerScore}
            </div>
          </div>
        </div>

        {showStats && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-xs text-subtle">Power</div>
                <div className="text-sm font-semibold text-red-400">{nft.attributes.power}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-subtle">Defense</div>
                <div className="text-sm font-semibold text-blue-400">{nft.attributes.defense}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-subtle">Speed</div>
                <div className="text-sm font-semibold text-green-400">{nft.attributes.speed}</div>
              </div>
            </div>

            {/* Battle Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ProgressRing
                  value={winRate}
                  size={32}
                  strokeWidth={3}
                  color={winRate >= 70 ? '#10b981' : winRate >= 50 ? '#f59e0b' : '#ef4444'}
                >
                  <span className="text-xs font-bold">{winRate}%</span>
                </ProgressRing>
                <div>
                  <div className="text-xs text-subtle">Win Rate</div>
                  <div className="text-xs text-text">
                    {nft.battleStats.wins}W / {nft.battleStats.losses}L
                  </div>
                </div>
              </div>

              {nft.attributes.special && (
                <div className="text-xs text-accent font-medium">
                  ⚡ {nft.attributes.special}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { NFTCard };
