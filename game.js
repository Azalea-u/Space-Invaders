let score = 0
let lives = 3
let gameRunning = true

const gameContainer = document.getElementById('game-container')
const pauseMenu = document.getElementById('pause-menu')
const timerDisplay = document.getElementById('timer')

const player = {
    x: 300,
    y: 800,
    width: 25,
    height: 25,
    speed: 6,
}

const bullets = []
const bulletSpeed = 9
const numBullets = 1
const movementMargin = 25

let keysPressed = {}
let canShoot = true

function togglePause() {
    gameRunning = !gameRunning
    pauseMenu.style.display = gameRunning ? 'none' : 'block'
    if (gameRunning) requestAnimationFrame(gameLoop)
}

function handleKeyDown(event) {
    const key = event.code
    keysPressed[key] = true

    if (key === 'Escape') togglePause()
    if (key === 'Space' && canShoot) shootBullet()
}

function handleKeyUp(event) {
    const key = event.code
    keysPressed[key] = false

    if (key === 'Space') canShoot = true
}

function shootBullet() {
    const spacing = 15
    const totalWidth = (numBullets - 1) * spacing
    const startX = player.x + player.width / 2 - totalWidth / 2

    for (let i = 0; i < numBullets; i++) {
        bullets.push({
            x: startX + i * spacing,
            y: player.y,
            width: 5,
            height: 10,
        })
    }

    canShoot = false
}

function updatePlayerPosition() {
    if (keysPressed['ArrowLeft'] && player.x > movementMargin) player.x -= player.speed
    if (keysPressed['ArrowRight'] && player.x < gameContainer.offsetWidth - player.width - movementMargin) player.x += player.speed
    if (keysPressed['ArrowUp'] && player.y > movementMargin) player.y -= player.speed
    if (keysPressed['ArrowDown'] && player.y < gameContainer.offsetHeight - player.height - movementMargin) player.y += player.speed
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed

        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1) // Remove bullets that leave the screen
        }
    })
}

function renderPlayer() {
    const playerElement = document.createElement('div')
    playerElement.style.position = 'absolute'
    playerElement.style.left = `${player.x}px`
    playerElement.style.top = `${player.y}px`
    playerElement.style.width = `${player.width}px`
    playerElement.style.height = `${player.height}px`
    playerElement.style.backgroundColor = 'red'

    gameContainer.appendChild(playerElement)
}

function renderBullets() {
    bullets.forEach(bullet => {
        const bulletElement = document.createElement('div')
        bulletElement.style.position = 'absolute'
        bulletElement.style.left = `${bullet.x}px`
        bulletElement.style.top = `${bullet.y}px`
        bulletElement.style.width = `${bullet.width}px`
        bulletElement.style.height = `${bullet.height}px`
        bulletElement.style.backgroundColor = 'yellow'

        gameContainer.appendChild(bulletElement)
    })
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
    timerDisplay.textContent = `Time: ${elapsedTime}s`
}

function render() {
    gameContainer.innerHTML = ''
    renderPlayer()
    renderBullets()
}

function gameLoop() {
    if (!gameRunning) return

    updatePlayerPosition()
    updateBullets()
    updateTimer()
    render()

    requestAnimationFrame(gameLoop)
}

const startTime = Date.now()
window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)
requestAnimationFrame(gameLoop)
