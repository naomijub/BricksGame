//Variables
var head;
var apple;
var bgMusic;
var body = [];
var size = 3;
var gameOver = false;

//Start Game
function startGame() {
    head = new component(10, 10, "red", 50, 50, "head");
    appleInit();
    bodyMaker(size);
    bgMusic = new sound("AKMU.mp3");
    bgMusic.play();
    board.start();
}

var board =
{
    canvas: document.createElement("canvas"),

    start: function ()
    {
        this.canvas.width = 200;
        this.canvas.height = 300;
        this.canvas.style.cursor = "none";
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
    },

    clear: function ()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//Functions
//start game block
function appleInit() {
    var x = getRandomInt(0, 20) * 10;
    var y = getRandomInt(0, 30) * 10;
    apple = new component(9, 9, "green", x, y, "apple");
}

function bodyMaker(int) {
    if (int == 3)
    {
        body = new Array(int);
        if (head.dir == "y")
        {
            body[0] = new component(9, 9, "white", head.x, head.y + 10, "body");
        } else
        {
            body[0] = new component(9, 9, "white", head.x + 10, head.y, "body");
        }
        for (i = 1; i < body.length; i++)
        {
            if (body[i - 1].dir == "y")
            {
                body[i] = new component(9, 9, "white", body[i - 1].x, body[i - 1].y + 10, "body");
            } else
            {
                body[i] = new component(9, 9, "white", body[i - 1].x + 10, body[i - 1].y, "body");
            }
        }
    }
    if (int > body.length) {
         if (body[body.length - 1].dir == "y")
        {
            bodyAux = new component(9, 9, "white", body[body.length - 1].x, body[body.length - 1].y + 10, "body");
        } else {
            bodyAux = new component(9, 9, "white", body[body.length - 1].x + 10, body[body.length - 1].y, "body");
        }
        body.push(bodyAux);
     }
       
}

function getRandomInt(min, max) {
    return Math.floor((max * Math.random()) + 1);
}

//component block
function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.dir = "y";
    this.type = type;
    this.moveX = 0;
    this.moveY = 0;
    this.update = function ()
    {
        contx = board.context;
        contx.fillStyle = color;
        contx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.newPos = function ()
    {
        this.x += this.moveX;
        this.y += this.moveY;
    }

    this.hitWall = function ()
    {
        if (this.x < 1 || this.x > 80)
        {
            die()

        }
        if (this.y < 1 || this.y > 150)
        {
            die();
        }
    }
}

function die() {
    gameOver = true;
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

    controller();
    move();

    if (!gameOver)
    {
        head.update();

        bodyUpdater();

        apple.update();
    }
    stop();
}

function controller() {
    if (board.key && board.key == 37) { head.moveX = -10; head.moveY = 0; head.dir = "x"; }
    if (board.key && board.key == 39) { head.moveX = 10; head.moveY = 0; head.dir = "x"; } 
    if (board.key && board.key == 38) { head.moveY = -10; head.moveX = 0; head.dir = "y"; }   
    if (board.key && board.key == 40) { head.moveY = 10; head.moveX = 0; head.dir = "y"; } 
}

function move() {
    head.newPos();
    //checks if head ate apple
    //add body if true;
    // move all body

}

function bodyUpdater() {
    for (i = 0; i < body.length; i++) {
        body[i].update();    
    }
}

function stop() {
    //constricts movement
}
