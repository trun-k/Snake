const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

let blockSize = 20;
let rows = canvas.height/blockSize;
let columns = canvas.width/blockSize;
let time = 120;
let speedBump = 4;
let dx = -1;
let dy = 0;
let snake = []
snake.push({x: (columns/2), y: (rows/2)});
let foodX = 0;
let foodY = 0;
let score = 0;
let interval;
let menu = document.getElementsByClassName("menu");
let lightsElement = document.getElementById("lights");
let scoreElement = document.getElementById("score");
let lights = 1;


// audios
let eat = new sound("audio/eat.mp3");
let gameOver = new sound("audio/game_over.mp3");

// controls
let leftPressed = false;
let rightPressed = false;
let topPressed = false;
let bottomPressed = false;

// event listeners for key pressed
document.addEventListener("keydown", keyDownHandler, false);
lightsElement.addEventListener("click", darkModeHandler, false);

// key down
function keyDownHandler(event){
    if(event.key === "Left" || event.key === "ArrowLeft"){
        leftPressed = true;
        rightPressed = false;
        topPressed = false;
        bottomPressed = false;
    }else if(event.key === "Right" || event.key === "ArrowRight"){
        leftPressed = false;
        rightPressed = true;
        topPressed = false;
        bottomPressed = false;
    }else if(event.key === "Up" || event.key === "ArrowUp"){
        leftPressed = false;
        rightPressed = false;
        topPressed = true;
        bottomPressed = false;
    }else if(event.key === "Down" || event.key === "ArrowDown"){
        leftPressed = false;
        rightPressed = false;
        topPressed = false;
        bottomPressed = true;
    }
    console.log(leftPressed + " " + rightPressed + " " + topPressed + " " + bottomPressed);
}

// generate co-ordinates for food
function generateFood(){
    foodX = Math.floor(Math.random()*columns);
    foodY = Math.floor(Math.random()*rows);
    while(snake.length!==rows*columns && snake.find(cell=>cell.x===foodX && cell.y===foodY)){
        foodX = Math.floor(Math.random()*columns);
        foodY = Math.floor(Math.random()*rows);
    }
}

// draw food for the snake
function drawFood(){
    context.beginPath();
    context.rect(foodX*blockSize, foodY*blockSize, blockSize, blockSize);
    context.fillStyle = "#FF0000";
    context.fill();
    context.closePath();
}

// draw the snake
function drawSnake(){
    for(let i=0;i<snake.length;i++){
        context.beginPath();
        context.rect(snake[i].x*blockSize, snake[i].y*blockSize, blockSize, blockSize);
        context.fillStyle = "#009900";
        context.fill();
        context.closePath();
    }
}

// create an audio element and use it for sound
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// draws the game
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    if(snake[0].x===foodX && snake[0].y===foodY){
        score++;
        snake.splice(0,0, {x:foodX, y:foodY});
        eat.play();
        increaseSpeed();
        generateFood();
    }
    drawScore();
    if(leftPressed && dx===0){
        dx = -1;
        dy = 0;
    }else if(rightPressed && dx===0){
        dx = 1;
        dy = 0;
    }else if(topPressed && dy===0){
        dx = 0;
        dy = -1;
    }else if(bottomPressed && dy===0){
        dx = 0;
        dy = 1;
    }
    let headX = snake[0].x;
    let headY = snake[0].y;
    if(headX + dx < 0){
        headX = columns + dx;
    }else if(headX + dx >= columns){
        headX = 0;
    }else{
        headX += dx;
    }
    if(headY + dy < 0){
        headY = rows + dy;
    }else if(headY + dy >= rows){
        headY = 0;
    }else{
        headY += dy;
    }
    if(snake.find(cell=>cell.x===headX && cell.y===headY)){
        gameOver.play();
        alert(`Game over! Your score is: ${score}. Restart?`, score);
        document.location.reload();
        clearInterval(interval);
        /*
        score = 0;
        time = 120;
        snake = [{x: (columns/2), y: (rows/2)}];
        dx = -1;
        dy = 0;
        generateFood();
        */
    }else{
        snake.splice(0,0, {x:headX, y:headY});
        snake.pop();
    }
}

function increaseSpeed(){
    time = Math.max(20, time-speedBump);
    clearInterval(interval);
    interval = setInterval(draw, time);
}

function setup(){
    generateFood();
    interval = setInterval(draw, time);
}

function drawScore(){
    scoreElement.textContent = `Score: ${score}`;
}

function darkModeHandler(){
    if(lights===1){
        lights = 0;
        document.body.style.backgroundColor = "#121212";
        lightsElement.innerHTML = `<u>lights on</u>`;
        lightsElement.style.color = "#EEE";
        scoreElement.style.color = "#EEE";
    }else{
        lights = 1;
        document.body.style.backgroundColor = "#FFFFFF";
        lightsElement.innerHTML = `<u>lights off</u>`;
        lightsElement.style.color = "#000";
        scoreElement.style.color = "#000";
    }
}

setup();