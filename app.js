const playBoard = document.querySelector('.play-board')
const scoreElement = document.querySelector('.score')
const highScoreElement = document.querySelector('.high-score')
const controls = document.querySelectorAll('.controls i')

let gameOver = false
let foodX, foodY 
let snakeX = 5, snakeY = 10
let snakeBody = []
let velocityX = 0, velocityY = 0
let setIntervalId
let score = 0
let highScore = localStorage.getItem('high-score') || 0
highScoreElement.innerHTML = `High Score: ${highScore}`


let initialTouchX, initialTouchY, finalTouchX, finalTouchY;

//==================================================================================================
// Add touch event listeners to the game board
playBoard.addEventListener('touchstart', handleTouchStart, false);
playBoard.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = event.touches[0].clientX;
  const yUp = event.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    // Horizontal swipe
    if (xDiff > 0 && velocityX !== 1) {
      // Swipe left
      velocityX = -1;
      velocityY = 0;
    } else if (velocityX !== -1) {
      // Swipe right
      velocityX = 1;
      velocityY = 0;
    } 
  } else {
    // Vertical swipe
    if (yDiff > 0 && velocityY !== 1) {
      // Swipe up
      velocityX = 0;
      velocityY = -1;
    } else if (velocityY !== -1) {
      // Swipe down
      velocityX = 0;
      velocityY = 1;
    }
    event.preventDefault();
  }

  // Reset swipe tracking variables
  xDown = null;
  yDown = null;
}

//==================================================================================================


const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1
    foodY = Math.floor(Math.random() * 30) + 1
    timer-= 10
    console.log(timer)
}

function handleGameOver() {
    clearInterval(setIntervalId)
    alert('Game over! Play again?')
    location.reload()

}

function changeDirection(e) {
    if (e.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0
        velocityY = -1
    } else if (e.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0
        velocityY = 1
    } else if (e.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1
        velocityY = 0
    } else if (e.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1
        velocityY = 0   
    } 
}

controls.forEach(control => {
    control.addEventListener('click', () => changeDirection({key: control.dataset.key}))
})

const initGame = () => {
    if (gameOver) return handleGameOver()

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition()
        snakeBody.push([foodX, foodY])
        score++
        highScore = score >= highScore ? score : highScore
        localStorage.setItem('high-score', highScore)
        scoreElement.innerHTML = `Score: ${score}`
        highScoreElement.innerHTML = `High Score: ${highScore}`
    } 

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]
        
    }

    snakeBody[0] = [snakeX, snakeY]
    snakeX += velocityX
    snakeY += velocityY

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`        
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] == snakeBody[i][0]) {
            gameOver = true
        }
    }
    playBoard.innerHTML = htmlMarkup
}

let timer = 125

changeFoodPosition()
setIntervalId = setInterval(initGame, timer)
document.addEventListener('keydown', changeDirection)