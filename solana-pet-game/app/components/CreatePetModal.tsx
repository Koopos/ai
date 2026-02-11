import { useState } from 'react';

interface CreatePetModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
  loading: boolean;
}

const petSuggestions = [
  '小萌龙', '水晶精灵', '火焰凤凰', '闪电狼',
  '月光猫咪', '星辰兔', '森林熊', '海洋海豚',
];

export default function CreatePetModal({ onClose, onCreate, loading }: CreatePetModalProps) {
  const [name, setName] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setName(suggestion);
    setSelectedSuggestion(suggestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl border border-white/10 w-full max-w-md p-6 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🎲</div>
          <h2 className="text-2xl font-bold text-white">铸造新宠物</h2>
          <p className="text-gray-400 mt-2">
            为你的新宠物取一个名字，属性将随机生成！
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">宠物名字</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSelectedSuggestion(null);
              }}
              placeholder="输入宠物名字..."
              maxLength={20}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">快速选择</label>
            <div className="flex flex-wrap gap-2">
              {petSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-all
                    ${selectedSuggestion === suggestion
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'}
                  `}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">铸造费用</span>
              <span className="text-primary font-semibold">0.01 SOL</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              费用将用于支持游戏开发和社区
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className={`
                flex-1 py-3 rounded-lg font-semibold transition-all
                ${!name.trim() || loading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'}
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  铸造中...
                </span>
              ) : (
                '🎲 开始铸造'
              )}
            </button>
          </div>
        </form>

        {/* Rarity Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            稀有度概率: 普通 60% | 稀有 25% | 史诗 12% | 传说 3%
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
