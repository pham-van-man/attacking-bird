let canvas = document.getElementById('themeGame');
let context = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, dx, dy) {
        this.x = x
        this.y = y
        this.radius = radius
        this.dx = dx
        this.dy = dy
        this.img = new Image();
        this.img.src = 'subject.png';
    }
}

let ball = new Ball(640, 640, 30, getRandomNumber(), 10);

class Paddle {
    constructor(width, height, x, y, speed) {
        this.width = width
        this.height = height
        this.x = x
        this.y = y
        this.speed = speed
        this.isMoveLeft = false;
        this.isMoveRight = false;
    }
}

let paddle = new Paddle(256, 20, 512, canvas.height - 20, 20);

class Brick {
    constructor(offSetX, offSetY, margin, width, height) {
        this.offSetX = offSetX;
        this.offSetY = offSetY;
        this.margin = margin;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = 'enemy.png';
    }
}

let brick = new Brick(25, 25, 25, 58.68, 58.68);
let brickList = [];
for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 15; j++) {
        brickList.push({
            x: brick.offSetX + j * (brick.width + brick.margin),
            y: brick.offSetY + i * (brick.height + brick.margin),
            isBroken: false
        })
    }
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37) {
        paddle.isMoveLeft = true;
    } else if (event.keyCode === 39) {
        paddle.isMoveRight = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.keyCode === 37) {
        paddle.isMoveLeft = false;
    } else if (event.keyCode === 39) {
        paddle.isMoveRight = false;
    }
});

function getRandomNumber() {
    let random = Math.random();
    let randomInRange = random * 11;
    let randomNumber = randomInRange - 5;
    return randomNumber;
}

function drawBall() {

    context.beginPath();
    context.drawImage(ball.img, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = '#DE3E55';
    context.fill();
    context.closePath();
}

function drawBricks() {
    brickList.forEach(function (br) {
        if (!br.isBroken) {
            context.beginPath();
            context.drawImage(brick.img, br.x, br.y, brick.width, brick.height)
            context.closePath();
        }
    });
}

function moveHandlingOfPaddle() {
    if (paddle.isMoveLeft) {
        paddle.x -= paddle.speed;
    } else if (paddle.isMoveRight) {
        paddle.x += paddle.speed;
    }
    if (paddle.x < 0) {
        paddle.x = 0
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

function collisionHandlingOfBallWithWall() {
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
}

function handleRedirectsOffBall() {
    ball.y += ball.dy;
    ball.x += ball.dx;
}

function isOverGame() {
    if (ball.y > canvas.height - ball.radius || scores === maxScores) {
        return false;
    } else {
        return true;
    }
}

function handlingCollisionsWithPaddle() {
    if (ball.x + ball.radius >= paddle.x
        && ball.x - ball.radius <= paddle.x + paddle.width
        && ball.y + ball.radius >= paddle.y) {
        ball.dy = -ball.dy;
    }
}

let scores = 0;
let maxScores = 30;

function handleCollisionsWithBricks() {
    brickList.forEach(function (br) {
        if (!br.isBroken) {
            if (ball.x + ball.radius >= br.x
                && ball.x - ball.radius <= br.x + brick.width
                && ball.y + ball.radius >= br.y
                && ball.y - ball.radius <= br.y + brick.height) {
                if (ball.dx > 0) {
                    ball.dx++;
                } else if (ball.dx < 0) {
                    ball.dx--;
                }
                if (ball.dy > 0) {
                    ball.dy++;
                } else if (ball.dy < 0) {
                    ball.dy--;
                }
                paddle.width = paddle.width - 4;
                paddle.speed++;
                ball.dy = -ball.dy;
                br.isBroken = true;
                scores++;
            }
        }
    })
}

function displayScores() {
    document.getElementById('scores').innerHTML = `${scores}`;
}

function moveBall() {
    if (isOverGame()) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        moveHandlingOfPaddle();
        collisionHandlingOfBallWithWall();
        handlingCollisionsWithPaddle();
        handleRedirectsOffBall();
        handleCollisionsWithBricks();
        requestAnimationFrame(moveBall);
    } else {
        if (scores === maxScores) {
            document.getElementById('inForGameOver').innerHTML = `<p id="text">YOU WIN!</p>`;
            gameOver();
        } else {
            displayScores();
            gameOver();
        }
    }
}

function gameOver() {
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('gameplay').style.display = 'none';
    document.getElementById('buttonStart').style.display = 'none';
}

function start() {
    document.getElementById('gameplay').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('buttonStart').style.display = 'none';
    moveBall();
}

function reStart() {
    resetGame();
}

function resetGame() {
    ball.x = 640;
    ball.y = 640;
    ball.dx = getRandomNumber();
    ball.dy = 10;
    ball.radius = 30;
    paddle.x = 512;
    paddle.width = 256;
    paddle.speed = 20;
    paddle.isMoveLeft = false;
    paddle.isMoveRight = false;
    brickList.forEach(function (br) {
        br.isBroken = false;
    });
    scores = 0;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameplay').style.display = 'block';
    document.getElementById('buttonStart').style.display = 'none';
    document.getElementById('inForGameOver').innerHTML = `<p id="text">Scores</p><p id="scores"></p>`;
    moveBall();
}

drawBall();
drawBricks();
drawPaddle();