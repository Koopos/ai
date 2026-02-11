import { useState } from 'react';
import { Pet, PetCardProps } from '../lib/types';

const AttributeBar = ({ label, value, maxValue, color }: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) => (
  <div className="mb-2">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      />
    </div>
  </div>
);

export default function PetCard({
  pet,
  onFeed,
  onTrain,
  getRarityColor,
  getRarityName,
}: PetCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [animating, setAnimating] = useState<string | null>(null);

  const getPetEmoji = () => {
    // 根据稀有度和属性返回不同表情
    if (pet.rarity === 4) return '🐉';
    if (pet.rarity === 3) return '🦄';
    if (pet.rarity === 2) return '🦊';
    return '🐱';
  };

  const handleAction = (action: string, callback: () => void) => {
    setAnimating(action);
    callback();
    setTimeout(() => setAnimating(null), 500);
  };

  const getTimeSinceLastFed = () => {
    const hours = Math.floor((Date.now() - pet.lastFedTime) / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div
      className={`
        bg-card rounded-2xl overflow-hidden border border-white/10
        hover:border-primary/50 transition-all duration-300
        ${animating ? 'animate-pulse' : ''}
      `}
    >
      {/* Pet Image & Rarity */}
      <div className={`relative h-48 bg-gradient-to-br ${getRarityColor(pet.rarity)} flex items-center justify-center`}>
        <div className="text-8xl transform hover:scale-110 transition-transform duration-300">
          {getPetEmoji()}
        </div>
        {/* Rarity Badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-semibold">{getRarityName(pet.rarity)}</span>
        </div>
        {/* Level Badge */}
        <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-semibold">Lv.{pet.level}</span>
        </div>
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{pet.name}</h3>

        {/* Status Bars */}
        <div className="mb-4">
          <AttributeBar label="力量" value={pet.strength} maxValue={255} color="bg-red-500" />
          <AttributeBar label="敏捷" value={pet.agility} maxValue={255} color="bg-green-500" />
          <AttributeBar label="智力" value={pet.intelligence} maxValue={255} color="bg-blue-500" />
          <AttributeBar label="饥饿" value={pet.hunger} maxValue={100} color="bg-yellow-500" />
          <AttributeBar label="快乐" value={pet.happiness} maxValue={100} color="bg-pink-500" />
        </div>

        {/* Experience Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">经验值</span>
            <span className="text-secondary font-semibold">
              {pet.experience} / {pet.level * 100}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(pet.experience / (pet.level * 100)) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-gray-400">上次喂食</span>
            <p className="text-white">{getTimeSinceLastFed()}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <span className="text-gray-400">繁殖次数</span>
            <p className="text-white">{pet.breedCount}/5</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleAction('feed', onFeed)}
            disabled={pet.hunger >= 100}
            className={`
              w-full py-2 rounded-lg font-semibold transition-all
              ${pet.hunger >= 100
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black'}
            `}
          >
            🍖 喂食
          </button>

          <button
            onClick={() => setShowActions(!showActions)}
            className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-semibold transition-all"
          >
            💪 训练 {showActions ? '▲' : '▼'}
          </button>

          {showActions && (
            <div className="grid grid-cols-3 gap-2 animate-fadeIn">
              <button
                onClick={() => handleAction('str', () => onTrain('strength'))}
                disabled={pet.hunger < 20}
                className="py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm disabled:opacity-50"
              >
                力量 +2
              </button>
              <button
                onClick={() => handleAction('agi', () => onTrain('agility'))}
                disabled={pet.hunger < 20}
                className="py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm disabled:opacity-50"
              >
                敏捷 +2
              </button>
              <button
                onClick={() => handleAction('int', () => onTrain('intelligence'))}
                disabled={pet.hunger < 20}
                className="py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm disabled:opacity-50"
              >
                智力 +2
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
