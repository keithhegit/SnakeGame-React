import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, LeaderboardState } from '../types/leaderboard';
import { leaderboardService } from '../services/leaderboardService';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose
}) => {
  const [state, setState] = useState<LeaderboardState>({
    entries: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard();
    }
  }, [isOpen]);

  const loadLeaderboard = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const entries = await leaderboardService.getLeaderboard();
      setState(prev => ({ ...prev, entries, isLoading: false }));
    } catch (error) {
      console.error('加载排行榜错误:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '加载排行榜失败'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🏆 蛇王排行榜</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {state.isLoading ? (
          <div className="text-center py-8 text-gray-400">加载中...</div>
        ) : state.error ? (
          <div className="text-center py-8 text-red-500">{state.error}</div>
        ) : (
          <div className="space-y-3">
            {state.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white w-8">
                    {index + 1}.
                  </span>
                  <div className="ml-3">
                    <div className="text-white font-medium">
                      {entry.player_name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {entry.achieved_at.split('T')[0]}
                    </div>
                  </div>
                </div>
                <span className="text-yellow-400 font-bold text-xl">
                  {entry.score} 分
                </span>
              </div>
            ))}
            {state.entries.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                暂无记录
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 