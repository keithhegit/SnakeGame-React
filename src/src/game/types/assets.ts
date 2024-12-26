export interface GameAsset {
  key: string
  type: 'image' | 'audio' | 'spritesheet'
  path: string
}

export const GAME_ASSETS: GameAsset[] = [
  // 游戏核心资源
  {
    key: 'snake-head',
    type: 'image',
    path: '/assets/images/snake-head.png'
  },
  {
    key: 'snake-body',
    type: 'image',
    path: '/assets/images/snake-body.png'
  },
  {
    key: 'food',
    type: 'image',
    path: '/assets/images/food.png'
  },
  
  // UI资源
  {
    key: 'button',
    type: 'image',
    path: '/assets/ui/button.png'
  },
  {
    key: 'joystick-base',
    type: 'image',
    path: '/assets/ui/joystick-base.png'
  },
  {
    key: 'joystick-stick',
    type: 'image',
    path: '/assets/ui/joystick-stick.png'
  }
] 