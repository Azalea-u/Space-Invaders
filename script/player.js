export const player = {
    x: 300,
    y: 800,
    width: 25,
    height: 25,
    speed: 6,
    canshoot: true,
};

const bullets = [];
const bulletSpeed = 9;
const numBullets = 1;
const movementMargin = 25;

export function updatePlayerPosition(keysPressed) {
    const gameContainer = document.getElementById('game-container');

    if (keysPressed['ArrowLeft'] && player.x > movementMargin) player.x -= player.speed;
    if (keysPressed['ArrowRight'] && player.x < gameContainer.offsetWidth - player.width - movementMargin) player.x += player.speed;
    if (keysPressed['ArrowUp'] && player.y > movementMargin) player.y -= player.speed;
    if (keysPressed['ArrowDown'] && player.y < gameContainer.offsetHeight - player.height - movementMargin) player.y += player.speed;
}

export function shootBullet() {
    const spacing = 15;
    const totalWidth = (numBullets - 1) * spacing;
    const startX = player.x + player.width / 2 - totalWidth / 2;

    for (let i = 0; i < numBullets; i++) {
        bullets.push({
            x: startX + i * spacing,
            y: player.y,
            width: 5,
            height: 10,
        });
    }
    player.canshoot= false
}

export function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;

        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1); // Remove bullets that leave the screen
        }
    });
}

export function getBullets() {
    return bullets;
}
