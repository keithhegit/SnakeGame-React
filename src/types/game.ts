export enum GameState {
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  READY = 'READY',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  NAME_INPUT = 'NAME_INPUT',
  LEADERBOARD = 'LEADERBOARD'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface GameSettings {
  speed: number;
  timeLimit: number;
  lives: number;
  wallCollision: boolean;
  foodTimeout?: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, GameSettings> = {
  [Difficulty.EASY]: {
    speed: 4,
    timeLimit: 35,
    lives: 3,
    wallCollision: true
  },
  [Difficulty.MEDIUM]: {
    speed: 6,
    timeLimit: 60,
    lives: 1,
    wallCollision: true
  },
  [Difficulty.HARD]: {
    speed: 8,
    timeLimit: 90,
    lives: 1,
    wallCollision: true,
    foodTimeout: 5000
  }
} 