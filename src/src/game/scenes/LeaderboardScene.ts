import Phaser from 'phaser'
import { StorageService, LeaderboardEntry } from '../services/StorageService'
import { DIFFICULTY_PREVIEWS } from '../types/game'

export default class LeaderboardScene extends Phaser.Scene {
  private entries: LeaderboardEntry[] = []
  private currentPage: number = 0
  private readonly entriesPerPage = 5

  constructor() {
    super({ key: 'LeaderboardScene' })
  }

  create() {
    const { width, height } = this.cameras.main.getBounds()
    
    // 加载排行榜数据
    this.entries = StorageService.getLeaderboard()

    // 创建标题
    this.add.text(width / 2, 50, 'LEADERBOARD', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5)

    // 创建表头
    this.createTableHeader(width)

    // 创建分页按钮
    this.createPaginationButtons(width, height)

    // 显示第一页数据
    this.showPage(0)

    // 返回按钮
    const backButton = this.add.text(width / 2, height - 50, 'Back to Menu', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.scene.start('DifficultyScene'))

    // 添加键盘控制
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('DifficultyScene')
    })
  }

  private createTableHeader(width: number) {
    const headers = ['Rank', 'Name', 'Score', 'Difficulty', 'Date']
    const positions = [0.1, 0.3, 0.5, 0.7, 0.9]

    headers.forEach((header, index) => {
      this.add.text(width * positions[index], 120, header, {
        fontSize: '24px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5)
    })
  }

  private showPage(page: number) {
    // 清除之前的条目
    this.children.getAll()
      .filter(obj => obj.getData('type') === 'entry')
      .forEach(obj => obj.destroy())

    const startIndex = page * this.entriesPerPage
    const endIndex = Math.min(startIndex + this.entriesPerPage, this.entries.length)
    const { width } = this.cameras.main.getBounds()

    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.entries[i]
      const y = 180 + (i - startIndex) * 50
      const positions = [0.1, 0.3, 0.5, 0.7, 0.9]

      // 排名
      this.createEntryText(width * positions[0], y, `#${i + 1}`)
      
      // 名字
      this.createEntryText(width * positions[1], y, entry.name)
      
      // 分数
      this.createEntryText(width * positions[2], y, entry.score.toString())
      
      // 难度
      this.createEntryText(
        width * positions[3],
        y,
        entry.difficulty,
        DIFFICULTY_PREVIEWS[entry.difficulty as keyof typeof DIFFICULTY_PREVIEWS].color
      )
      
      // 日期
      this.createEntryText(
        width * positions[4],
        y,
        new Date(entry.date).toLocaleDateString()
      )
    }
  }

  private createEntryText(x: number, y: number, text: string, color: string = '#ffffff') {
    return this.add.text(x, y, text, {
      fontSize: '20px',
      color: color,
      stroke: '#000000',
      strokeThickness: 2
    })
    .setOrigin(0.5)
    .setData('type', 'entry')
  }

  private createPaginationButtons(width: number, height: number) {
    const totalPages = Math.ceil(this.entries.length / this.entriesPerPage)
    
    if (totalPages <= 1) return

    // 上一页按钮
    this.add.text(width * 0.4, height - 50, '< Prev', {
      fontSize: '24px',
      color: '#ffffff'
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      if (this.currentPage > 0) {
        this.currentPage--
        this.showPage(this.currentPage)
      }
    })

    // 下一页按钮
    this.add.text(width * 0.6, height - 50, 'Next >', {
      fontSize: '24px',
      color: '#ffffff'
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      if (this.currentPage < totalPages - 1) {
        this.currentPage++
        this.showPage(this.currentPage)
      }
    })
  }
} 