var player;
var platforms;
var score = 0;
var gameOver = false;
var cursors;
var triangle;
var diamond;
var square;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene:{preload: preload,create: create,update: update}
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('cielo', 'public/assets/images/Cielo.png');
    this.load.image('cuad', 'public/assets/images/Cuadrado.png');
    this.load.image('rombo', 'public/assets/images/Rombo.png');
    this.load.image('tri', 'public/assets/images/Triangulo.png');
    this.load.image('ninja', 'public/assets/images/Ninja.png');
    this.load.image('ground', 'public/assets/images/platform.png');
    
}

function create (){
    gameOver = false;
    score = 0;

    const timedEvent = this.time.addEvent({ 
        delay: 3000, 
        callback: onSecond, 
        callbackScope: this, 
        loop: true 
    });

    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'cielo').setScale(0.555);
    

    platforms = this.physics.add.staticGroup();

    diamond = this.physics.add.group();
    triangle = this.physics.add.group();
    square = this.physics.add.group();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, "ninja");
    
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);

    this.physics.add.collider(player, square);
    this.physics.add.collider(platforms, square);

    this.physics.add.collider(player, diamond);
    this.physics.add.collider(platforms, diamond);

    this.physics.add.collider(player, triangle);
    this.physics.add.collider(platforms, triangle);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(player, square, collectAsteroid, null, this);
    this.physics.add.overlap(platforms, square, setGameOver, null, this);

    this.physics.add.overlap(player, diamond, collectAsteroid, null, this);
    this.physics.add.overlap(platforms, diamond, setGameOver, null, this);

    this.physics.add.overlap(player, triangle, collectAsteroid, null, this);
    this.physics.add.overlap(platforms, triangle, setGameOver, null, this);
    
}
function update(){
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-250);
    
    } else if (cursors.right.isDown) {
        player.setVelocityX(250);
    
    } else {
        player.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function onSecond(){
    if(!gameOver){
        let min = Math.ceil(20);
        let max = Math.floor(680);
        let n = Math.floor(Math.random() * (max - min + 1) + min);
        console.log (n);

        /*switch (n) {
            case (n%3 == 0):
                console.log ("aa");
                const cuad = this.add.image(n, 50, "cuad");
                this.physics.add.existing(cuad);
                cuad.body.setCircle(25,7,7);
                square.add(cuad);
                break;
            case (n%2 == 0):
                console.log ("bb");
                const rombo = this.add.image(n, 50, "rombo");
                this.physics.add.existing(rombo);
                rombo.body.setCircle(25,7,7);
                diamond.add(rombo);
                break;
            case (n%2 != 0) :
                console.log ("cc");
                const tri = this.add.image(n, 50, "tri");
                this.physics.add.existing(tri);
                tri.body.setCircle(25,7,7);
                triangle.add(tri);
                break;
            default:
                break;
        }*/

        if (n%3 == 0) {
            console.log ("cuadrado");
            const cuad = this.add.image(n, 50, "cuad");
            this.physics.add.existing(cuad);
            cuad.body.setCircle(25,7,7);
            square.add(cuad);

        }else if (n%2 == 0) {
            console.log ("rombo");
            const rombo = this.add.image(n, 50, "rombo");
            this.physics.add.existing(rombo);
            rombo.body.setCircle(25,7,7);
            diamond.add(rombo);

        }  else if (n%2 != 0) {
            console.log ("triangulo");
            const tri = this.add.image(n, 50, "tri");
            this.physics.add.existing(tri);
            tri.body.setCircle(25,7,7);
            triangle.add(tri);
        }
    }
}
function collectAsteroid(player, asteroid){
    asteroid.destroy();
}
function setGameOver(){
    gameOver = true;
}