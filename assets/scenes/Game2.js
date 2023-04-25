export default class Game2 extends Phaser.Scene{
    player;
  score;
  scoreText;
  gameOver;
  cursors;
  shapesGroup;
  KeyR;
  isWin;
  myArray;
  constructor() {
    super("Game2");
  }

  

  init(data) {
    this.score = data.score;
    this.gameOver = false;
    this.isWin = false;
    this.myArray = [
      { F: "triangle", cant: 0 },
      { F: "square", cant: 0 },
      { F: "diamond", cant: 0 },
    ];
    this.cursors = this.input.keyboard.createCursorKeys();
    this.KeyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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
      this.restartSceneWithKeyR();
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
    if (randomNumber % 5 == 0){
        asteroid.setTexture("redDiamond").setTint(0xff0000);
    } else if (randomNumber % 3 == 0) {
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
      case "redDiamond":
        this.score -= 20;
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
      this.restartSceneWithKeyR();
    }

    asteroid.destroy();
  }

  setGameOver(ground, asteroid) {
    if (asteroid.texture.key == "redDiamond") {
        asteroid.destroy();
    }else{
        this.gameOver = true;
    }   
  }

  restartSceneWithKeyR() {
    this.shapesGroup.children.entries.forEach((item) => item.destroy());
    this.add
      .image(this.scale.width / 2, this.scale.height / 2 + 200, "keyR")
      .setScale(0.25);
    if (this.KeyR.isDown) {
      this.gameOver = false;
      this.isWin = false;
      setTimeout(() => {
        this.scene.start("Game2", { score: this.score });
      }, 1000);
    }
  }
}