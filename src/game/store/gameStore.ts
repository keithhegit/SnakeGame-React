import { create } from 'zustand'
import { StorageService, GameSettings, GameProgress } from '../services/StorageService'
import { GameState, GameStore, GameSettings, Difficulty } from '../types/game'

const defaultSettings: GameSettings = {
  speed: 150,
  wallCollision: false,
  gridSize: 40,
  startLength: 3,
  growthRate: 1
}

const calculateMultiplier = (combo: number): number => {
  if (combo >= 10) return 3.0
  if (combo >= 7) return 2.5
  if (combo >= 5) return 2.0
  if (combo >= 3) return 1.5
  return 1.0
}

interface GameStore {
  state: GameState
  score: {
    score: number
    combo: number
    multiplier: number
  }
  lives: number
  timeLeft: number
  settings: GameSettings
  difficulty: Difficulty
  highScore: number
  progress: GameProgress
  
  addScore: (baseScore: number) => void
  resetCombo: () => void
  setScore: (score: number) => void
  setHighScore: (score: number) => void
  setLives: (lives: number) => void
  setState: (state: GameState) => void
  setPaused: (isPaused: boolean) => void
  setSettings: (settings: Partial<GameSettings>) => void
  resetGame: () => void
  updateSettings: (settings: Partial<GameSettings>) => void
  updateProgress: (update: (current: GameProgress) => Partial<GameProgress>) => void
  handleGameOver: () => void
  validateGameState: () => boolean
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: GameState.LOADING,
  score: {
    score: 0,
    combo: 0,
    multiplier: 1
  },
  lives: 3,
  timeLeft: 60,
  settings: defaultSettings,
  difficulty: Difficulty.EASY,
  highScore: 0,
  progress: StorageService.getProgress(),
  
  addScore: (baseScore) => set(state => {
    const newCombo = state.score.combo + 1
    const multiplier = calculateMultiplier(newCombo)
    const difficultyMultiplier = {
      [Difficulty.EASY]: 1.0,
      [Difficulty.MEDIUM]: 1.5,
      [Difficulty.HARD]: 2.0
    }[state.difficulty]

    const finalScore = Math.floor(
      baseScore * multiplier * difficultyMultiplier
    )

    return {
      score: {
        score: state.score.score + finalScore,
        combo: newCombo,
        multiplier
      }
    }
  }),

  resetCombo: () => set(state => ({
    score: {
      ...state.score,
      combo: 0,
      multiplier: 1
    }
  })),

  setScore: (score) => set({ score }),
  setHighScore: (score) => set({ highScore: score }),
  setLives: (lives) => set({ lives }),
  setState: (state) => set({ state }),
  setPaused: (isPaused) => set(state => ({ 
    state: isPaused ? GameState.PAUSED : GameState.PLAYING 
  })),
  setSettings: (settings) => set(state => ({ 
    settings: { ...state.settings, ...settings } 
  })),
  resetGame: () => set({
    score: {
      score: 0,
      combo: 0,
      multiplier: 1
    },
    lives: 3,
    timeLeft: 60,
    state: GameState.LOADING
  }),

  updateSettings: (settings) => {
    StorageService.saveSettings(settings)
    set({ settings: { ...get().settings, ...settings } })
  },

  updateProgress: (update) => {
    const newProgress = StorageService.updateProgress(update)
    set({ progress: newProgress })
  },

  handleGameOver: () => {
    const { score, difficulty, progress } = get()
    
    get().updateProgress((current) => ({
      totalGames: current.totalGames + 1,
      totalScore: current.totalScore + score.score,
      highScores: {
        ...current.highScores,
        [difficulty]: Math.max(current.highScores[difficulty], score.score)
      }
    }))

    set({ state: GameState.GAME_OVER })
  },

  validateGameState: () => {
    const state = get()
    const validations = [
      {
        check: () => state.lives >= 0,
        message: 'Lives cannot be negative'
      },
      {
        check: () => state.timeLeft >= 0,
        message: 'Time cannot be negative'
      },
      {
        check: () => state.score.multiplier >= 1,
        message: 'Score multiplier cannot be less than 1'
      },
      {
        check: () => state.score.combo >= 0,
        message: 'Combo cannot be negative'
      }
    ]

    const errors = validations
      .filter(v => !v.check())
      .map(v => v.message)

    if (errors.length > 0) {
      console.error('Game state validation failed:', errors)
      // 重置到安全状态
      get().resetGame()
      return false
    }
    return true
  }
})) 