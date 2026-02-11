import { useState, useEffect } from 'react';
import { Pet } from '../lib/types';

interface BattleArenaProps {
  pets: Pet[];
  onClose: () => void;
  onBattle: (pet1Id: string, pet2Id: string) => void;
}

export default function BattleArena({ pets, onClose, onBattle }: BattleArenaProps) {
  const [myPetId, setMyPetId] = useState<string>('');
  const [opponentPet, setOpponentPet] = useState<Pet | null>(null);
  const [battling, setBattling] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  const myPet = pets.find(p => p.id === myPetId);

  // 模拟对手宠物
  const mockOpponents: Pet[] = [
    {
      id: 'op1',
      name: '暗影狼',
      owner: 'opponent',
      uri: '',
      strength: 75,
      agility: 90,
      intelligence: 60,
      rarity: 3,
      level: 18,
      experience: 800,
      hunger: 80,
      happiness: 85,
      birthTime: Date.now(),
      lastFedTime: Date.now(),
      isAlive: true,
      breedCount: 1,
    },
    {
      id: 'op2',
      name: '雷霆鹰',
      owner: 'opponent',
      uri: '',
      strength: 85,
      agility: 95,
      intelligence: 50,
      rarity: 2,
      level: 15,
      experience: 600,
      hunger: 90,
      happiness: 90,
      birthTime: Date.now(),
      lastFedTime: Date.now(),
      isAlive: true,
      breedCount: 0,
    },
    {
      id: 'op3',
      name: '冰霜巨龙',
      owner: 'opponent',
      uri: '',
      strength: 120,
      agility: 60,
      intelligence: 100,
      rarity: 4,
      level: 35,
      experience: 2500,
      hunger: 100,
      happiness: 100,
      birthTime: Date.now(),
      lastFedTime: Date.now(),
      isAlive: true,
      breedCount: 3,
    },
  ];

  const selectRandomOpponent = () => {
    const randomIndex = Math.floor(Math.random() * mockOpponents.length);
    setOpponentPet(mockOpponents[randomIndex]);
    setBattleLog([]);
    setWinner(null);
  };

  const calculateBattlePower = (pet: Pet) => {
    return (pet.strength * 2 + pet.agility + pet.intelligence) * pet.level * (pet.happiness / 100);
  };

  const startBattle = () => {
    if (!myPet || !opponentPet) return;

    setBattling(true);
    setBattleLog([]);
    setWinner(null);

    const myPower = calculateBattlePower(myPet);
    const oppPower = calculateBattlePower(opponentPet);

    // 模拟战斗过程
    const logs: string[] = [];
    logs.push(`⚔️ 战斗开始！`);
    logs.push(`${myPet.name} VS ${opponentPet.name}`);

    setTimeout(() => {
      logs.push(`📊 ${myPet.name} 战力: ${Math.floor(myPower)}`);
      setBattleLog([...logs]);
    }, 500);

    setTimeout(() => {
      logs.push(`📊 ${opponentPet.name} 战力: ${Math.floor(oppPower)}`);
      setBattleLog([...logs]);
    }, 1000);

    setTimeout(() => {
      logs.push(`🎲 投掷骰子决定命运...`);
      setBattleLog([...logs]);
    }, 1500);

    setTimeout(() => {
      // 加入随机因素
      const myRoll = Math.random() * 30;
      const oppRoll = Math.random() * 30;
      const myFinal = myPower + myRoll;
      const oppFinal = oppPower + oppRoll;

      logs.push(`🎲 ${myPet.name} 运气: +${Math.floor(myRoll)}`);
      logs.push(`🎲 ${opponentPet.name} 运气: +${Math.floor(oppRoll)}`);

      if (myFinal > oppFinal) {
        logs.push(`🎉 ${myPet.name} 获胜！`);
        setWinner('me');
        onBattle(myPetId, opponentPet.id);
      } else {
        logs.push(`😢 ${opponentPet.name} 获胜...`);
        setWinner('opponent');
      }

      setBattleLog([...logs]);
      setBattling(false);
    }, 2500);
  };

  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 4: return 'text-yellow-400';
      case 3: return 'text-purple-400';
      case 2: return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-white/10 w-full max-w-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold text-white">战斗竞技场</h2>
          <p className="text-gray-400 mt-2">
            选择你的宠物，挑战随机对手！
          </p>
        </div>

        {/* Pet Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* My Pet */}
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <h3 className="text-primary font-semibold mb-3">我的宠物</h3>
            <select
              value={myPetId}
              onChange={(e) => {
                setMyPetId(e.target.value);
                setBattleLog([]);
                setWinner(null);
              }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">选择宠物...</option>
              {pets.filter(p => p.isAlive).map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} (Lv.{pet.level})
                </option>
              ))}
            </select>

            {myPet && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">战力</span>
                  <span className="text-white font-bold">
                    {Math.floor(calculateBattlePower(myPet))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">稀有度</span>
                  <span className={getRarityColor(myPet.rarity)}>
                    {['普通', '稀有', '史诗', '传说'][myPet.rarity - 1]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Opponent */}
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <h3 className="text-red-400 font-semibold mb-3">对手</h3>
            {!opponentPet ? (
              <button
                onClick={selectRandomOpponent}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                🎲 随机匹配对手
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">{opponentPet.name}</span>
                  <span className={getRarityColor(opponentPet.rarity)}>
                    Lv.{opponentPet.level}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">战力</span>
                  <span className="text-white font-bold">
                    {Math.floor(calculateBattlePower(opponentPet))}
                  </span>
                </div>
                <button
                  onClick={selectRandomOpponent}
                  className="w-full py-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  换一个对手
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Battle Button */}
        <button
          onClick={startBattle}
          disabled={!myPet || !opponentPet || battling}
          className={`
            w-full py-3 rounded-xl font-bold text-lg transition-all mb-6
            ${!myPet || !opponentPet || battling
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 animate-pulse-glow'}
          `}
        >
          {battling ? '⚔️ 战斗中...' : '⚔️ 开始战斗！'}
        </button>

        {/* Battle Log */}
        {battleLog.length > 0 && (
          <div className={`
            rounded-xl p-4 mb-4 border
            ${winner === 'me'
              ? 'bg-green-500/10 border-green-500/20'
              : winner === 'opponent'
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-white/5 border-white/10'}
          `}>
            <h3 className="text-white font-semibold mb-2">战斗记录</h3>
            <div className="space-y-1 font-mono text-sm">
              {battleLog.map((log, i) => (
                <p
                  key={i}
                  className={`
                    ${log.includes('获胜') && winner === 'me' ? 'text-green-400' : 'text-gray-300'}
                    ${log.includes('获胜') && winner === 'opponent' ? 'text-red-400' : ''}
                  `}
                >
                  {log}
                </p>
              ))}
            </div>

            {winner === 'me' && (
              <div className="mt-3 pt-3 border-t border-white/10 text-center">
                <p className="text-green-400 font-semibold">🎉 胜利奖励</p>
                <p className="text-gray-400 text-sm">经验 +50，力量 +1</p>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-2">战斗规则</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 战力 = (力量×2 + 敏捷 + 智力) × 等级 × 快乐值%</li>
            <li>• 战斗加入随机运气因素 (-30 到 +30)</li>
            <li>• 胜者获得 50 经验和 1 点力量加成</li>
            <li>• 败者不会损失任何属性</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
