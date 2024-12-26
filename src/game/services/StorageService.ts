import { Difficulty } from '../types/game'

export interface GameSettings {
  controlType: 'keyboard' | 'touch' | 'joystick'
  username: string
  difficulty: Difficulty
}

export interface GameProgress {
  highScores: {
    [Difficulty.EASY]: number
    [Difficulty.MEDIUM]: number
    [Difficulty.HARD]: number
  }
  totalGames: number
  totalScore: number
  longestSnake: number
  fastestWin: number
}

const DEFAULT_SETTINGS: GameSettings = {
  controlType: 'keyboard',
  username: 'Player',
  difficulty: Difficulty.MEDIUM
}

const DEFAULT_PROGRESS: GameProgress = {
  highScores: {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0
  },
  totalGames: 0,
  totalScore: 0,
  longestSnake: 0,
  fastestWin: 0
}

export class StorageService {
  private static readonly SETTINGS_KEY = 'snake-game-settings'
  private static readonly PROGRESS_KEY = 'snake-game-progress'

  static getSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY)
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  }

  static saveSettings(settings: Partial<GameSettings>) {
    const current = this.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated))
  }

  static getProgress(): GameProgress {
    try {
      const stored = localStorage.getItem(this.PROGRESS_KEY)
      return stored ? { ...DEFAULT_PROGRESS, ...JSON.parse(stored) } : DEFAULT_PROGRESS
    } catch {
      return DEFAULT_PROGRESS
    }
  }

  static updateProgress(update: (current: GameProgress) => Partial<GameProgress>) {
    const current = this.getProgress()
    const updates = update(current)
    const updated = { ...current, ...updates }
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(updated))
    return updated
  }

  static clearAll() {
    localStorage.removeItem(this.SETTINGS_KEY)
    localStorage.removeItem(this.PROGRESS_KEY)
  }
} 