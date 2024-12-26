import { create } from 'zustand'
import { GameState, Difficulty, GameSettings, DIFFICULTY_SETTINGS } from '@/types/game'

interface GameStore {
  state: GameState
  difficulty: Difficulty
  settings: GameSettings
  score: number
  lives: number
  timeLeft: number
  comboCount: number
  
  setState: (state: GameState) => void
  setDifficulty: (difficulty: Difficulty) => void
  setScore: (score: number) => void
  setLives: (lives: number) => void
  setTimeLeft: (time: number) => void
  setComboCount: (count: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  state: GameState.DIFFICULTY_SELECT,
  difficulty: Difficulty.EASY,
  settings: DIFFICULTY_SETTINGS[Difficulty.EASY],
  score: 0,
  lives: 3,
  timeLeft: 35,
  comboCount: 0,

  setState: (state) => set({ state }),
  setDifficulty: (difficulty) => set({ 
    difficulty,
    settings: DIFFICULTY_SETTINGS[difficulty],
    lives: DIFFICULTY_SETTINGS[difficulty].lives,
    timeLeft: DIFFICULTY_SETTINGS[difficulty].timeLimit
  }),
  setScore: (score) => set({ score }),
  setLives: (lives) => set({ lives }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  setComboCount: (count) => set({ comboCount: count }),
  resetGame: () => set((state) => ({
    score: 0,
    lives: state.settings.lives,
    timeLeft: state.settings.timeLimit,
    comboCount: 0
  }))
})) 