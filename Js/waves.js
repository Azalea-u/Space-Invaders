import { player } from './player.js'

const gameContainer = document.getElementById("game-container")
const ScoreElement = document.getElementById('score')

const enemies = []
const enemyWidth = 30
const enemyHeight = 30
const enemySpeed = 2
let ScoreNumber = 0
let rows = 2
let cols = 4

const margin = 20
const enemySVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 33 33" width="100" height="100"><path class="icon-path" d="M29.963 24.982v-5.947h-2.91v5.969h-3.037v2.953h-7.048v-2.975h7.048v-2.972h-14.991v2.973l6.030 0.021v2.973h-6.051v-2.951h-3.036v-6.010h-2.911v5.947h-3.057v-9.004h2.995v-2.891h2.973v-3.057h3.057v-2.994h2.994v3.003l8.983 0.024v-3.027h2.994v3.036h3.057v2.974h2.953v2.973h3.014v8.982h-3.057zM12.019 13.005h-2.994v2.995h2.994v-2.995zM23.996 13.005h-2.994v2.995h2.994v-2.995zM5.968 4.023h3.057v2.994h-3.057v-2.994zM27.053 4.023v2.994h-3.057v-2.994h3.057z"></path></svg>`;


function spawnEnemies() {

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: col * (enemyWidth + 10) + 50,
                y: row * (enemyHeight + 10) + 50,
                width: enemyWidth,
                height: enemyHeight,
                speed: enemySpeed,
                alive: true,
                bullets: [],
                direction: 'right',
            });
        }
    }
}

// Render enemies
function renderEnemies(color = "blue") {

    enemies.forEach(enemy => {
        if (enemy.alive) {
            // console.log(color);
            const enemyElement = document.createElement('div')
            enemyElement.classList.add('enemy')
            enemyElement.style.width = `${enemy.width}px`
            enemyElement.style.height = `${enemy.height}px`
            enemyElement.style.left = `${enemy.x}px`
            enemyElement.style.top = `${enemy.y}px`
            if (!enemyElement.querySelector('.enemy-svg')) {
                const svgElement = new DOMParser().parseFromString(enemySVG, 'image/svg+xml').documentElement
                svgElement.classList.add('enemy')
                enemyElement.appendChild(svgElement)
            }
            const svgPath = enemyElement.querySelector(".icon-path")
            svgPath.setAttribute("fill", color)
            gameContainer.appendChild(enemyElement)
        }
    });
}

// Update enemy positions (movement)
function updateEnemyPositions() {
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            if (enemy.x + enemy.width >= gameContainer.offsetWidth - margin) {
                enemy.direction = 'left'
            } else if (enemy.x <= margin) {
                enemy.direction = 'right'
            }
            // this for moving
            if (enemy.direction === 'right') {
                enemy.x += enemy.speed
            } else if (enemy.direction === 'left') {
                enemy.x -= enemy.speed
            }
        }
    })
}


const killedsound = new Audio('./invaderkilled.wav')
// Detect collisions with bullets
function checkBulletCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (enemy.alive && isCollision(bullet, enemy)) {
                // Bullet hit the enemy
                enemy.alive = false // Mark enemy as dead
                player.bullets.splice(bulletIndex, 1)// Remove bullet
                enemies.splice(enemyIndex, 1)
                ScoreNumber += 10
                killedsound.play()
                ScoreElement.textContent = `Score: ${ScoreNumber}`
            }
        });
    });
}

// Collision detection function
function isCollision(bullet, enemy) {
    return (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    )
}

let lastAttackTime = 0
let attackInterval = 1000



function enemiesAttack() {
    const currentTime = Date.now()
    if (currentTime - lastAttackTime < attackInterval) return
    lastAttackTime = currentTime

    // Randomize which enemy will attack by selecting a random enemy from the alive ones
    const availableEnemies = enemies.filter(enemy => enemy.alive)

    if (availableEnemies.length === 0) return // No enemies to attack
    const randomEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)]
    const startX = randomEnemy.x + randomEnemy.width / 2
    const startY = randomEnemy.y + randomEnemy.height
    const randomSpeed = Math.random() * 6 + 6 // Random bullet speed
    randomEnemy.bullets.push({
        x: startX,
        y: startY,
        height: 10,
        width: 5,
        speed: randomSpeed,
    })
}




function renderEnemiesBullets() {
    enemies.forEach((enemy) => {
        enemy.bullets.forEach((bullet) => {
            const bulletElement = document.createElement('div')
            bulletElement.classList.add("player-bullet")
            bulletElement.style.width = `${bullet.width}px`
            bulletElement.style.height = `${bullet.height}px`
            bulletElement.style.left = `${bullet.x}px`
            bulletElement.style.top = `${bullet.y}px`
            bulletElement.style.backgroundColor = "cyan"
            gameContainer.appendChild(bulletElement)
        })
    })
}


function updateEnemiesBulletsPosition() {
    enemies.forEach((enemy) => {
        enemy.bullets.forEach((bullet, index) => {
            bullet.y += 8
            if (bullet.y + bullet.height < 0) {
                enemies.bullets.splice(index, 1)
            }
        })
    })

}
let currentWave = 1
function startNewWave() {
    if (currentWave % 10 === 0) {
        if (player.shootingMultiplier < 3) {
            player.shootingMultiplier = Math.min(player.shootingMultiplier + 1, 10)
        }

    }
    if (rows < 6) {
        rows++
    }
    if (cols < 16) {
        cols += 2
    }
    attackInterval = Math.max(attackInterval - 100, 100)
    player.fireRate = Math.max(player.fireRate - 10, 280)
    spawnEnemies()
    currentWave++
}

export { enemies, spawnEnemies, renderEnemies, updateEnemyPositions, checkBulletCollisions, isCollision, startNewWave, enemiesAttack, renderEnemiesBullets, updateEnemiesBulletsPosition };