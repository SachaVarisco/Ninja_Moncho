export default class  preload extends Phaser.Scene {
    constructor() {
  
      super("preload");
    }

    preload() {
        this.load.image("sky", "./assets/images/sky.png");
        this.load.image("square", "./assets/images/square.png");
        this.load.image("diamond", "./assets/images/diamond.png");
        this.load.image("redDiamond", "./assets/images/diamond.png")
        this.load.image("triangle", "./assets/images/triangle.png");
        this.load.image("ninja", "./assets/images/ninja.png");
        this.load.image("ground", "./assets/images/platform.png");
        this.load.image("win", "./assets/images/win.png");
        this.load.image("keyR", "./assets/images/keyR.png");
    }
    create(){
        this.scene.start("Game");
    }
    
}  