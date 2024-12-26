/// <reference types="phaser" />

declare module 'phaser' {
  import Phaser = require('phaser');
  export default Phaser;
  export = Phaser;
}

declare namespace Phaser {
  interface Scene {
    add: Phaser.GameObjects.GameObjectFactory;
    cameras: Phaser.Cameras.Scene2D.CameraManager;
    input: Phaser.Input.InputPlugin;
    load: Phaser.Loader.LoaderPlugin;
    tweens: Phaser.Tweens.TweenManager;
    time: Phaser.Time.Clock;
    scene: Phaser.Scenes.ScenePlugin;
  }

  namespace GameObjects {
    interface GameObjectFactory {
      text(x: number, y: number, text: string | string[], style?: any): Text;
      container(x: number, y: number): Container;
      rectangle(x: number, y: number, width: number, height: number, color?: number, alpha?: number): Rectangle;
      sprite(x: number, y: number, texture: string, frame?: string | number): Sprite;
    }

    interface Container extends GameObject {
      add(gameObjects: GameObject[]): this;
      setScale(scale: number): this;
    }

    interface Text extends GameObject {
      setOrigin(x: number, y?: number): this;
      setAlpha(alpha: number): this;
      setText(text: string): this;
      setColor(color: string): this;
      setVisible(visible: boolean): this;
      setStyle(style: any): this;
    }

    interface Rectangle extends GameObject {
      setOrigin(x: number, y?: number): this;
    }

    interface Sprite extends GameObject {
      setOrigin(x: number, y?: number): this;
      setPosition(x: number, y: number): this;
      getCenter(): Phaser.Math.Vector2;
    }

    interface GameObject {
      x: number;
      y: number;
      destroy(): void;
    }
  }

  namespace Input {
    interface InputPlugin {
      keyboard: Keyboard.KeyboardPlugin;
    }

    namespace Keyboard {
      interface KeyboardPlugin {
        on(event: string, callback: Function, context?: any): void;
        once(event: string, callback: Function, context?: any): void;
        off(event: string, callback?: Function, context?: any): void;
        createCursorKeys(): CursorKeys;
        addKeys(config: object): { [key: string]: Key };
      }

      interface Key {
        isDown: boolean;
      }

      interface CursorKeys {
        up: Key;
        down: Key;
        left: Key;
        right: Key;
      }
    }
  }

  namespace Tweens {
    interface TweenManager {
      add(config: TweenBuilderConfig | object): Tween;
    }

    interface Tween {
      stop(): this;
      destroy(): void;
    }
  }

  namespace Cameras {
    namespace Scene2D {
      interface CameraManager {
        main: Camera;
      }

      interface Camera {
        getBounds(): { width: number; height: number };
      }
    }
  }

  namespace Scenes {
    interface ScenePlugin {
      start(key: string): void;
      pause(key?: string): void;
      resume(key?: string): void;
    }
  }

  namespace Math {
    class Vector2 {
      x: number;
      y: number;
      constructor(x?: number, y?: number);
      set(x: number, y: number): this;
      length(): number;
      normalize(): this;
      scale(scale: number): this;
    }

    namespace Distance {
      function Between(x1: number, y1: number, x2: number, y2: number): number;
    }
  }
} 