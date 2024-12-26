export enum GameState {
  LOADING = 'LOADING',
  TUTORIAL = 'TUTORIAL',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

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