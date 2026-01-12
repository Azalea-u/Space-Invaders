import { enemies } from './waves.js'

const gameContainer = document.getElementById("game-container")
const liveElement = document.getElementById('lives')

const player = {
    x: gameContainer.offsetWidth / 2,
    y: gameContainer.offsetHeight - 100,
    width: 30,
    height: 30,
    speed: 6,
    lives: 3,
    fireRate: 500,
    shootingSpeed: 8,
    shootingMultiplier: 1,
    bullets: [],
    lastShot: 0,
    lastDamage: 0,
}

const margin = 20
let livesNumber = 3

function playerPosition(input) {
    player.y = gameContainer.offsetHeight - 80
    if (input["ArrowLeft"] && player.x > margin) player.x -= player.speed;
    if (input["ArrowRight"] && player.x < gameContainer.offsetWidth - player.width - margin - 8) player.x += player.speed;
}

function renderPlayer() {
    let playerElement = gameContainer.querySelector(".player");
    if (!playerElement) {
        playerElement = document.createElement("div");
        playerElement.classList.add("player");
        gameContainer.appendChild(playerElement);
    }
    playerElement.style.width = `${player.width}px`
    playerElement.style.height = `${player.height}px`
    playerElement.style.left = `${player.x}px`
    playerElement.style.top = `${player.y}px`
}

function playerAttack() {
    if (Date.now() - player.lastShot < player.fireRate) return
    player.lastShot = Date.now()

    const spacing = 15
    const startX = player.x + player.width / 2 - (spacing * (player.shootingMultiplier - 1)) / 2

    for (let i = 0; i < player.shootingMultiplier; i++) {
        player.bullets.push({
            x: startX + i * spacing - 2,
            y: player.y,
            height: 8,
            width: 4,
        })
    }
}


function renderBullets() {
    player.bullets.forEach((bullet) => {
        const bulletElement = document.createElement('div')
        bulletElement.classList.add("player-bullet")
        bulletElement.style.width = `${bullet.width}px`
        bulletElement.style.height = `${bullet.height}px`
        bulletElement.style.left = `${bullet.x}px`
        bulletElement.style.top = `${bullet.y}px`
        gameContainer.appendChild(bulletElement)
    })
    updateBulletsPosition()
}


function updateBulletsPosition() {
    player.bullets.forEach((bullet, index) => {
        bullet.y -= player.shootingSpeed
        if (bullet.y + bullet.height < 0) {
            player.bullets.splice(index, 1)
        }
    })
}

function checkDamage() {
    const damageCooldown = 500
    enemies.forEach((enemy) => {
        // Iterate through each bullet of the current enemy
        enemy.bullets.forEach((bullet, bulletIndex) => {
            // Check if the bullet collides with the player
            if (isCollision(bullet, player)) {
                const currentTime = Date.now() // Get the current time in milliseconds
                if (currentTime - player.lastDamage >= damageCooldown) {
                    // Bullet hit the player and enough time has passed since the last damage
                    player.lastDamage = currentTime // Update the last damage time
                    enemy.bullets.splice(bulletIndex, 1) // Remove the bullet
                    livesNumber -= 1
                    liveElement.textContent = `Lives: ${livesNumber}`
                }
            }
        });
    });
}
// Collision detection function
function isCollision(bullet, player) {
    return (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
    )
}


export { player, livesNumber, playerPosition, renderPlayer, playerAttack, renderBullets, checkDamage, isCollision }