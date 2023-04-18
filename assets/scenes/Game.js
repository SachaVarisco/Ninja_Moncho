export default class Game extends Phaser.Scene {
  player;
  score;
  scoreText;
  gameOver;
  cursors;
  shapesGroup;
  isWin;
  myArray;
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("square", "./assets/images/Cuadrado.png");
    this.load.image("diamond", "./assets/images/Rombo.png");
    this.load.image("triangle", "./assets/images/Triangulo.png");
    this.load.image("ninja", "./assets/images/Ninja.png");
    this.load.image("ground", "./assets/images/platform.png");
    this.load.image("win", "./assets/images/win.png");
  }

  init() {
    this.gameOver = false;
    this.score = 0;
    this.isWin = false;
    this.myArray = [
      { F: "triangle", cant: 0 },
      { F: "square", cant: 0 },
      { F: "diamond", cant: 0 },
    ];
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    /*--- Create the sky--- */
    this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "sky")
      .setScale(0.555);

    /*--- Groups--- */
    let plataforms = this.physics.add.staticGroup();
    plataforms.create(400, 568, "ground").setScale(2).refreshBody();
    this.shapesGroup = this.physics.add.group();

    /*--- Players--- */
    this.player = this.physics.add.sprite(100, 450, "ninja");
    this.player.setCollideWorldBounds(true);

    /*--- Physics - Colliders--- */
    this.physics.add.collider(this.player, plataforms);
    this.physics.add.collider(this.player, this.shapesGroup);
    this.physics.add.collider(plataforms, this.shapesGroup);
    /*--- Physics - Overlaps--- */
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectAsteroid,
      null,
      this
    );
    this.physics.add.overlap(
      plataforms,
      this.shapesGroup,
      this.setGameOver,
      null,
      this
    );

    this.scoreText = this.add.text(20, 20, "Score:" + this.score, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFFFFF",
    });

    const secondsSpawnAsteroid = 3000;
    this.time.addEvent({
      delay: secondsSpawnAsteroid,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.gameOver || this.isWin) {
      this.physics.pause();
      return;
    }
    // Movement of player
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(250);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  onSecond() {
    if (!this.gameOver && !this.isWin) {
      let min = Math.ceil(20);
      let max = Math.floor(680);
      let randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      this.spawnAsteroid(randomNumber);
    }
  }

  spawnAsteroid(randomNumber) {
    let asteroid = this.add.image(randomNumber, 50, "");
    this.physics.add.existing(asteroid);
    asteroid.body.setCircle(25, 7, 7);
    this.shapesGroup.add(asteroid);

    if (randomNumber % 3 == 0) {
      asteroid.setTexture("square");
    } else if (randomNumber % 2 == 0) {
      asteroid.setTexture("diamond");
    } else if (randomNumber % 2 != 0) {
      asteroid.setTexture("triangle");
    }
  }

  collectAsteroid(player, asteroid) {
    let resultTriangle = this.myArray[0];
    let resultSquare = this.myArray.find((forma) => forma.F === "square");
    let resultDiamond = this.myArray.find((forma) => forma.F === "diamond");

    switch (asteroid.texture.key) {
      case "triangle":
        resultTriangle.cant++;
        this.score += 10;
        break;
      case "square":
        resultSquare.cant++;
        this.score += 20;
        break;
      case "diamond":
        resultDiamond.cant++;
        this.score += 10;
        break;
      default:
        break;
    }

    this.scoreText.setText(`Score: ${this.score.toString()}`);

    if (
      resultTriangle.cant >= 2 &&
      resultSquare.cant >= 2 &&
      resultDiamond.cant >= 2
    ) {
      this.add
        .image(this.scale.width / 2, this.scale.height / 2, "win")
        .setScale(0.25);
      this.physics.pause();
      this.isWin = true;
    }

    asteroid.destroy();
  }

  setGameOver() {
    this.gameOver = true;
  }
}
