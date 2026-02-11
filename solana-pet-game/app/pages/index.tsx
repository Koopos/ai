import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Head from 'next/head';
import PetCard from '../components/PetCard';
import CreatePetModal from '../components/CreatePetModal';
import BreedModal from '../components/BreedModal';
import BattleArena from '../components/BattleArena';
import { useState, useEffect } from 'react';
import { Pet } from '../lib/types';

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [pets, setPets] = useState<Pet[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 模拟宠物数据
  const mockPets: Pet[] = [
    {
      id: '1',
      name: '小火龙',
      owner: publicKey?.toBase58() || '',
      uri: '/pets/fire-dragon.png',
      strength: 85,
      agility: 72,
      intelligence: 68,
      rarity: 3,
      level: 12,
      experience: 450,
      hunger: 80,
      happiness: 95,
      birthTime: Date.now() - 86400000 * 7,
      lastFedTime: Date.now() - 3600000,
      isAlive: true,
      breedCount: 0,
    },
    {
      id: '2',
      name: '水晶精灵',
      owner: publicKey?.toBase58() || '',
      uri: '/pets/crystal-fairy.png',
      strength: 45,
      agility: 88,
      intelligence: 95,
      rarity: 4,
      level: 25,
      experience: 1200,
      hunger: 60,
      happiness: 75,
      birthTime: Date.now() - 86400000 * 30,
      lastFedTime: Date.now() - 7200000,
      isAlive: true,
      breedCount: 2,
    },
  ];

  useEffect(() => {
    if (connected) {
      setPets(mockPets);
    }
  }, [connected]);

  const handleCreatePet = async (name: string) => {
    setLoading(true);
    try {
      const newPet: Pet = {
        id: Date.now().toString(),
        name,
        owner: publicKey?.toBase58() || '',
        uri: '/pets/default.png',
        strength: Math.floor(Math.random() * 100) + 1,
        agility: Math.floor(Math.random() * 100) + 1,
        intelligence: Math.floor(Math.random() * 100) + 1,
        rarity: 1,
        level: 1,
        experience: 0,
        hunger: 100,
        happiness: 100,
        birthTime: Date.now(),
        lastFedTime: Date.now(),
        isAlive: true,
        breedCount: 0,
      };

      const total = newPet.strength + newPet.agility + newPet.intelligence;
      if (total > 250) newPet.rarity = 4;
      else if (total > 200) newPet.rarity = 3;
      else if (total > 150) newPet.rarity = 2;

      setPets([...pets, newPet]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('创建宠物失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBreedPets = async (parent1Id: string, parent2Id: string, childName: string) => {
    setLoading(true);
    try {
      const parent1 = pets.find(p => p.id === parent1Id);
      const parent2 = pets.find(p => p.id === parent2Id);
      if (!parent1 || !parent2) return;

      const mutation = Math.floor(Math.random() * 21) - 10;
      const childPet: Pet = {
        id: Date.now().toString(),
        name: childName,
        owner: publicKey?.toBase58() || '',
        uri: '/pets/baby.png',
        strength: Math.max(1, Math.min(255, Math.floor((parent1.strength + parent2.strength) / 2) + mutation)),
        agility: Math.max(1, Math.min(255, Math.floor((parent1.agility + parent2.agility) / 2) + mutation)),
        intelligence: Math.max(1, Math.min(255, Math.floor((parent1.intelligence + parent2.intelligence) / 2) + mutation)),
        rarity: 1,
        level: 1,
        experience: 0,
        hunger: 100,
        happiness: 100,
        birthTime: Date.now(),
        lastFedTime: Date.now(),
        isAlive: true,
        breedCount: 0,
        parent1: parent1Id,
        parent2: parent2Id,
      };

      const total = childPet.strength + childPet.agility + childPet.intelligence;
      if (total > 250) childPet.rarity = 4;
      else if (total > 200) childPet.rarity = 3;
      else if (total > 150) childPet.rarity = 2;

      setPets(pets.map(p => {
        if (p.id === parent1Id) return { ...p, breedCount: p.breedCount + 1 };
        if (p.id === parent2Id) return { ...p, breedCount: p.breedCount + 1 };
        return p;
      }).concat(childPet));

      setShowBreedModal(false);
    } catch (error) {
      console.error('繁殖失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBattle = (pet1Id: string, _pet2Id: string) => {
    setPets(pets.map(pet => {
      if (pet.id === pet1Id) {
        const newExp = pet.experience + 50;
        const expNeeded = pet.level * 100;
        if (newExp >= expNeeded && pet.level < 100) {
          return {
            ...pet,
            experience: newExp - expNeeded,
            level: pet.level + 1,
            strength: Math.min(pet.strength + 3, 255),
            agility: Math.min(pet.agility + 3, 255),
            intelligence: Math.min(pet.intelligence + 3, 255),
          };
        }
        return { ...pet, experience: newExp };
      }
      return pet;
    }));
  };

  const handleFeedPet = (petId: string) => {
    setPets(pets.map(pet => {
      if (pet.id === petId) {
        return {
          ...pet,
          hunger: Math.min(pet.hunger + 30, 100),
          happiness: Math.min(pet.happiness + 10, 100),
          lastFedTime: Date.now(),
        };
      }
      return pet;
    }));
  };

  const handleTrainPet = (petId: string, attribute: 'strength' | 'agility' | 'intelligence') => {
    setPets(pets.map(pet => {
      if (pet.id === petId && pet.hunger > 20) {
        const newExp = pet.experience + 15;
        const expNeeded = pet.level * 100;
        let newLevel = pet.level;
        let finalExp = newExp;
        let strBonus = 0, agiBonus = 0, intBonus = 0;

        if (newExp >= expNeeded && pet.level < 100) {
          newLevel = pet.level + 1;
          finalExp = newExp - expNeeded;
          strBonus = 3;
          agiBonus = 3;
          intBonus = 3;
        }

        return {
          ...pet,
          hunger: pet.hunger - 20,
          experience: finalExp,
          level: newLevel,
          [attribute]: Math.min(pet[attribute] + 2, 255),
          strength: Math.min(pet.strength + strBonus, 255),
          agility: Math.min(pet.agility + agiBonus, 255),
          intelligence: Math.min(pet.intelligence + intBonus, 255),
        };
      }
      return pet;
    }));
  };

  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 4: return 'from-yellow-400 to-orange-500';
      case 3: return 'from-purple-400 to-pink-500';
      case 2: return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityName = (rarity: number) => {
    switch (rarity) {
      case 4: return '传说';
      case 3: return '史诗';
      case 2: return '稀有';
      default: return '普通';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Head>
        <title>Solana Pet Game - 加密宠物养成</title>
        <meta name="description" content="基于Solana的NFT宠物养成游戏" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐾</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Solana Pet Game
            </h1>
          </div>
          <WalletMultiButton className="!bg-gradient-to-r !from-primary !to-secondary !rounded-full !py-2 !px-4" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-6 animate-bounce-slow">🐾</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              欢迎来到加密宠物世界
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              连接你的 Solana 钱包，开始养育你的专属 NFT 宠物！
            </p>
            <div className="flex flex-col gap-4 text-left bg-card/50 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white">游戏特色</h3>
              <ul className="space-y-2 text-gray-300">
                <li>🎭 随机生成独特属性和稀有度</li>
                <li>🍖 喂食和训练提升宠物能力</li>
                <li>💕 繁殖产生更强大的后代</li>
                <li>⚔️ 与其他玩家的宠物战斗</li>
                <li>🏪 在市场上交易你的宠物</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card/50 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">我的宠物</p>
                <p className="text-3xl font-bold text-white">{pets.length}</p>
              </div>
              <div className="bg-card/50 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">传说宠物</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {pets.filter(p => p.rarity === 4).length}
                </p>
              </div>
              <div className="bg-card/50 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">总等级</p>
                <p className="text-3xl font-bold text-secondary">
                  {pets.reduce((sum, p) => sum + p.level, 0)}
                </p>
              </div>
              <div className="bg-card/50 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">钱包地址</p>
                <p className="text-sm font-mono text-primary truncate">
                  {publicKey?.toBase58().slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                🎲 铸造新宠物
              </button>
              <button
                onClick={() => setShowBreedModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                💕 繁殖宠物
              </button>
              <button
                onClick={() => setShowBattleModal(true)}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105"
              >
                ⚔️ 战斗竞技场
              </button>
              <button className="bg-card border border-white/20 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-card/80 transition-all">
                🏪 宠物市场
              </button>
            </div>

            {/* Pets Grid */}
            <h2 className="text-2xl font-bold text-white mb-4">我的宠物</h2>
            {pets.length === 0 ? (
              <div className="text-center py-16 bg-card/30 rounded-xl border border-dashed border-white/20">
                <div className="text-6xl mb-4">🐣</div>
                <p className="text-gray-400 text-lg">你还没有宠物</p>
                <p className="text-gray-500">点击上方按钮铸造你的第一只宠物！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onFeed={() => handleFeedPet(pet.id)}
                    onTrain={(attr) => handleTrainPet(pet.id, attr)}
                    getRarityColor={getRarityColor}
                    getRarityName={getRarityName}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Solana Pet Game - 基于 Solana 的 NFT 宠物养成游戏</p>
          <p className="mt-2">Powered by Anchor & Next.js</p>
        </div>
      </footer>

      {/* Modals */}
      {showCreateModal && (
        <CreatePetModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePet}
          loading={loading}
        />
      )}
      {showBreedModal && (
        <BreedModal
          pets={pets}
          onClose={() => setShowBreedModal(false)}
          onBreed={handleBreedPets}
          loading={loading}
        />
      )}
      {showBattleModal && (
        <BattleArena
          pets={pets}
          onClose={() => setShowBattleModal(false)}
          onBattle={handleBattle}
        />
      )}
    </div>
  );
}
