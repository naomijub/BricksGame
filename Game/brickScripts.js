//Variables
var ball;
var plate;
var bricks = [];
var gameScore;
var score = 0;
var bgMusic;
var life = 3;
var gameOver = false;
var gameOn = true;
var mouseOI = true;
var initialSize = 20;

//Start Game 
function startGame() {
    ball = new component(10, 10, "red", 239, 250, "ball");
    plate = new component(80, 8, "blue", 210, 285);
    createBricks(initialSize);
    gameScore = new component("20px", "Consolas", "black", 300, 20, "text");
    bgMusic = new sound("ISwear.mp3");
    bgMusic.play();
    board.start();
}

var board =
{
    canvas: document.createElement("canvas"),

    start: function ()
    {
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.canvas.style.cursor = "crosshair";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 17); //updates 60 times per second

        window.addEventListener('keydown', function (e)
        {
            board.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e)
        {
            board.key = false;
        })
        window.addEventListener('mousemove', function (e) {
            board.x = e.pageX;
        })
    },

    clear: function ()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//Functions
//StartGame block
function createBricks(int) {
    bricks = new Array(int);
    for (i = 0; i < bricks.length; i++) {
        var x = ((i % 5) * 98) + 8;
        var y = (Math.floor(i / 5) * 22) + 25;
        bricks[i] = new component(80, 20, "green", x, y);
    }
}

//component block
function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type = type;
    if (this.type == "ball")
    {
        this.speedX = getRandomInt(0,2);
        this.speedY = getRandomInt(1,3);
    } else
    {
        this.speedX = 0;
        this.speedY = 0;
    }
    this.update = function ()
    {
        contx = board.context;
        if (this.type == "text")
        {
            contx.font = this.width + " " + this.height;
            contx.fillStyle = color;
            contx.fillText(this.text, this.x, this.y);
        }
        else
        {
            contx.fillStyle = color;
            contx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function ()
    {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.hitWall = function ()
    {
        if (this.x < 3 || this.x > 495)
        {
            this.speedX = -this.speedX;

        }
        if (this.y < 3)
        {
            this.speedY = -this.speedY;
        }
        if (this.y > 299)
        {
            die();
        }
    }
    this.reflect = function (obj, type)
    {
        if (type == "plate")
        {
            if (this.y >= (285 - this.height) && this.y < 295)
            {
                if ((this.x <= obj.x + obj.width) && (this.x + this.width >= obj.x))
                {
                    this.speedY = -this.speedY;
                }
            }
        }

        if (type == "brick")
        {
            if ((this.y + this.height >= obj.y) && (this.y <= obj.y + obj.height))
            {
                if ((this.x <= obj.x + obj.width) && (this.x + this.width >= obj.x))
                {
                    increaseScore();
                    this.speedY = -this.speedY;
                    return true;
                }
            }
        }
    }   
}

function getRandomInt(min, max) {
    return Math.floor((max * Math.random()) + 1);
}

function die() {
    life--;
    if(life <= 0)
    {
        gameOver = true;
    }    
    ball.x = 239;
    ball.y = 250;
}

function increaseScore() {
    score++;
}

//sound block
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.pauseSong = function(){
        this.sound.pause();
    }  
}

function pause() {
    bgMusic.pauseSong();
}

function play() {
    bgMusic.play();
}

//update game area
function updateGameArea() {
    board.clear();

    control();

    if (!gameOver)
    {
        ball.hitWall();
        ball.reflect(plate, "plate");
        ball.newPos();
    }
    ball.update();

    brickCollider();
    brickUpdater();

    plate.newPos();
    plate.update();

    scoreUpdate();
    if (hasBricks()) {
        resetGame();
    }
    stop();
}

function control() {
    if (mouseOI)
    {
        if (board.x > 0 && (plate.x > -20) && (plate.x < 442))
        {
            plate.x = board.x - 350;
        } else
        {
            if (plate.x < -19)
            {
                plate.x = -15;
            }
            if (plate.x > 442)
            {
                plate.x = 435;
            }
        }
    } else
    {
        if (board.key && board.key == 37) { plate.speedX = -1; }
        if (board.key && board.key == 39) { plate.speedX = 1; }
    }
}

function brickCollider() {
   for (i = 0; i < bricks.length; i++) {
       if (ball.reflect(bricks[i], "brick")) {
           bricks.splice(i, 1);
       }
    }     
}

function brickUpdater() {
    for (i = 0; i < bricks.length; i++) {
        bricks[i].update();
    }
}

function hasBricks() {
    if (bricks.length > 0)
    {
        return false;
    } else {
        return true;
    }
}

function scoreUpdate() {
    if (gameOn)
    {
        if (gameOver)
        {
            gameScore.text = "Game Over " + score;
        } else
        {
            gameScore.text = "Life: " + life + "  Score: " + score;
        }
        gameScore.update();
    }
}

function resetGame() {
    initialSize += 5;
    if (initialSize <= 40)
    {
        createBricks(initialSize);
    } else {
        ball.speedX = 0;
        ball.speedY = 0;
        ball.update();
        gameOn = false;
        gameScore.text = "You Win " + score;
        gameScore.update();         
    }
}

function stop() {
    plate.speedX = 0;
}

//Buttons functions
function moveLeft() {
    plate.speedX = -10;
}

function moveRight() {
    plate.speedX = +10;
}

function mouse()
{
    mouseOI = !mouseOI;
}