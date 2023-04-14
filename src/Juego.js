
var player;
var score;
var scoreText;
var gameOver;
var cursors;
var figura;
var cuad;
var tri;
var rombo;
var myArray=[
    {F:"triangulo", cant:0},
    {F:"cuadrado", cant:0},
    {F:"rombo", cant:0},
];

const config = {
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

const game = new Phaser.Game(config);

function preload(){
    this.load.image('cielo', 'public/assets/images/Cielo.png');
    this.load.image('cuad', 'public/assets/images/Cuadrado.png');
    this.load.image('rombo', 'public/assets/images/Rombo.png');
    this.load.image('tri', 'public/assets/images/Triangulo.png');
    this.load.image('ninja', 'public/assets/images/Ninja.png');
    this.load.image('suelo', 'public/assets/images/platform.png'); 
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
    

    let platforms = this.physics.add.staticGroup();

    figura = this.physics.add.group();
    

    platforms.create(400, 568, 'suelo').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, "ninja");
    
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);

    this.physics.add.collider(player, figura);
    this.physics.add.collider(platforms, figura);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(player, figura, collectAsteroid, null, this);
    this.physics.add.overlap(platforms, figura, setGameOver, null, this);

    scoreText = this.add.text(20, 20, "Score:" + score, {
        fontSize: "32px",
        fontStyle: 'bold', 
        fill: "#FFFFFF",
    });
    
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

    scoreText.text = "Score: " + score.toString();
}

function onSecond(){
    if(!gameOver){
        let min = Math.ceil(20);
        let max = Math.floor(680);
        let n = Math.floor(Math.random() * (max - min + 1) + min);

        if (n%3 == 0) {
            cuad = this.add.image(n, 50, "cuad");
            this.physics.add.existing(cuad);
            cuad.body.setCircle(25,7,7);
            figura.add(cuad);

        }else if (n%2 == 0) {
            rombo = this.add.image(n, 50, "rombo");
            this.physics.add.existing(rombo);
            rombo.body.setCircle(25,7,7);
            figura.add(rombo);

        }else if (n%2 != 0) {
            tri = this.add.image(n, 50, "tri");
            this.physics.add.existing(tri);
            tri.body.setCircle(25,7,7);
            figura.add(tri);
        }
    }
}
function collectAsteroid(player, asteroid){
    let resultado = myArray.find( forma => forma.F === 'triangulo');
    let resultado1 = myArray.find( forma => forma.F === 'cuadrado');
    let resultado2 = myArray.find( forma => forma.F === 'rombo');

    switch (asteroid) {
        case tri:
            resultado.cant++;
            score += 10;
            break;
        case cuad:
            resultado.cant++;
            score += 20;
            break;
        case rombo:
            resultado.cant++;
            score += 10;
            break;
    
        default:
            break;
    }

    myArray.forEach(function(formas) {
        if (resultado.cant >= 2 && resultado1.cant >= 2 && resultado2.cant >= 2) {
            console.log("wawa")
        }
    });
    asteroid.destroy();
}

function setGameOver(){
    gameOver = true;
}