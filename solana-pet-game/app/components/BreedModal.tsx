import { useState } from 'react';
import { Pet } from '../lib/types';

interface BreedModalProps {
  pets: Pet[];
  onClose: () => void;
  onBreed: (parent1Id: string, parent2Id: string, childName: string) => void;
  loading: boolean;
}

export default function BreedModal({ pets, onClose, onBreed, loading }: BreedModalProps) {
  const [parent1Id, setParent1Id] = useState<string>('');
  const [parent2Id, setParent2Id] = useState<string>('');
  const [childName, setChildName] = useState('');

  const parent1 = pets.find(p => p.id === parent1Id);
  const parent2 = pets.find(p => p.id === parent2Id);

  const canBreed = () => {
    if (!parent1 || !parent2) return false;
    if (parent1.id === parent2.id) return false;
    if (parent1.level < 5 || parent2.level < 5) return false;
    if (parent1.breedCount >= 5 || parent2.breedCount >= 5) return false;
    return true;
  };

  const getPredictedStats = () => {
    if (!parent1 || !parent2) return null;
    return {
      strength: Math.floor((parent1.strength + parent2.strength) / 2),
      agility: Math.floor((parent1.agility + parent2.agility) / 2),
      intelligence: Math.floor((parent1.intelligence + parent2.intelligence) / 2),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canBreed() && childName.trim()) {
      onBreed(parent1Id, parent2Id, childName.trim());
    }
  };

  const breedablePets = pets.filter(p => p.level >= 5 && p.breedCount < 5);

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
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-white">繁殖宠物</h2>
          <p className="text-gray-400 mt-2">
            选择两只宠物进行繁殖，获得更强壮的后代！
          </p>
        </div>

        {breedablePets.length < 2 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-gray-400">
              你需要至少两只 5 级以上且繁殖次数未满的宠物才能进行繁殖
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parent Selection */}
            <div className="grid grid-cols-2 gap-4">
              {/* Parent 1 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">父母 1</label>
                <select
                  value={parent1Id}
                  onChange={(e) => setParent1Id(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">选择宠物...</option>
                  {breedablePets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} (Lv.{pet.level})
                    </option>
                  ))}
                </select>
                {parent1 && (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-300">
                      <p>力量: {parent1.strength}</p>
                      <p>敏捷: {parent1.agility}</p>
                      <p>智力: {parent1.intelligence}</p>
                      <p>繁殖: {parent1.breedCount}/5</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Parent 2 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">父母 2</label>
                <select
                  value={parent2Id}
                  onChange={(e) => setParent2Id(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">选择宠物...</option>
                  {breedablePets
                    .filter(p => p.id !== parent1Id)
                    .map(pet => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} (Lv.{pet.level})
                      </option>
                    ))}
                </select>
                {parent2 && (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-300">
                      <p>力量: {parent2.strength}</p>
                      <p>敏捷: {parent2.agility}</p>
                      <p>智力: {parent2.intelligence}</p>
                      <p>繁殖: {parent2.breedCount}/5</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Predicted Stats */}
            {getPredictedStats() && (
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="text-white font-semibold mb-2">预期后代属性</h3>
                <p className="text-xs text-gray-400 mb-3">
                  属性为父母平均值，可能有 ±10 的随机变异
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-red-400 text-2xl font-bold">
                      {getPredictedStats()!.strength}
                    </p>
                    <p className="text-gray-400 text-sm">力量</p>
                  </div>
                  <div>
                    <p className="text-green-400 text-2xl font-bold">
                      {getPredictedStats()!.agility}
                    </p>
                    <p className="text-gray-400 text-sm">敏捷</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-2xl font-bold">
                      {getPredictedStats()!.intelligence}
                    </p>
                    <p className="text-gray-400 text-sm">智力</p>
                  </div>
                </div>
              </div>
            )}

            {/* Child Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">后代名字</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="为宝宝取个名字..."
                maxLength={20}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Cost Info */}
            <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">繁殖费用</span>
                <span className="text-yellow-400 font-semibold">0.05 SOL</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                父母各消耗一次繁殖机会
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!canBreed() || !childName.trim() || loading}
                className={`
                  flex-1 py-3 rounded-lg font-semibold transition-all
                  ${!canBreed() || !childName.trim() || loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90'}
                `}
              >
                {loading ? '繁殖中...' : '💕 开始繁殖'}
              </button>
            </div>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-2">繁殖规则</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 宠物需要达到 5 级才能繁殖</li>
            <li>• 每只宠物最多繁殖 5 次</li>
            <li>• 后代属性为父母平均值 ± 随机变异</li>
            <li>• 优秀父母有更高概率生出稀有后代</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
