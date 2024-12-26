import Phaser from 'phaser'
import { GameState, Difficulty } from '../types/game'
import { useGameStore } from '../store/gameStore'

export default class ReadyScene extends Phaser.Scene {
  private gameStore: typeof useGameStore
  private titleText: Phaser.GameObjects.Text
  private difficultyTexts: Phaser.GameObjects.Text[]
  private selectedDifficulty: number = 0

  constructor() {
    super({ key: 'ReadyScene' })
    this.gameStore = useGameStore
    this.difficultyTexts = []
  }

  create() {
    this.createTitle()
    this.createDifficultyMenu()
    this.setupControls()
    
    this.gameStore.setState({ state: GameState.DIFFICULTY_SELECT })
  }

  private createTitle() {
    const { width, height } = this.cameras.main
    
    this.titleText = this.add.text(width / 2, height * 0.3, 'SNAKE GAME', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5)

    this.tweens.add({
      targets: this.titleText,
      scale: { from: 0.5, to: 1 },
      duration: 1000,
      ease: 'Bounce'
    })
  }

  private createDifficultyMenu() {
    const difficulties = [
      { text: 'EASY', color: '#00ff00' },
      { text: 'MEDIUM', color: '#ffff00' },
      { text: 'HARD', color: '#ff0000' }
    ]

    const startY = this.cameras.main.height * 0.5
    
    difficulties.forEach((diff, index) => {
      const text = this.add.text(
        this.cameras.main.width / 2,
        startY + index * 60,
        diff.text,
        {
          fontSize: '32px',
          color: diff.color,
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5)

      text.setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          this.selectedDifficulty = index
          this.updateDifficultySelection()
        })
        .on('pointerdown', () => {
          this.startGame(index)
        })

      this.difficultyTexts.push(text)
    })

    this.updateDifficultySelection()
  }

  private setupControls() {
    this.input.keyboard.on('keydown-UP', () => {
      this.selectedDifficulty = (this.selectedDifficulty - 1 + 3) % 3
      this.updateDifficultySelection()
    })

    this.input.keyboard.on('keydown-DOWN', () => {
      this.selectedDifficulty = (this.selectedDifficulty + 1) % 3
      this.updateDifficultySelection()
    })

    this.input.keyboard.on('keydown-ENTER', () => {
      this.startGame(this.selectedDifficulty)
    })
  }

  private updateDifficultySelection() {
    this.difficultyTexts.forEach((text, index) => {
      const isSelected = index === this.selectedDifficulty
      text.setScale(isSelected ? 1.2 : 1)
      text.setAlpha(isSelected ? 1 : 0.7)
    })
  }

  private startGame(difficultyIndex: number) {
    const difficulty = [
      Difficulty.EASY,
      Difficulty.MEDIUM,
      Difficulty.HARD
    ][difficultyIndex]

    this.gameStore.setState({
      difficulty,
      state: GameState.PLAYING
    })

    this.scene.start('MainScene')
  }
} 