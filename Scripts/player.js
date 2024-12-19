// Cache the game container
const gameContainer = document.getElementById("game-container");

export const player = {
    x: gameContainer.offsetWidth / 2 - 16,
    y: gameContainer.offsetHeight - 80,
    width: 30,
    height: 30,
    speed: 6,
    lives: 3,
    fireRate: 500,
    shootingSpeed: 8,
    shootingMultiplier: 1,
    bullets: [],
    lastShot: 0,
};

const margin = 20;
const bulletPool = [];
let bulletElements = [];

function getBulletFromPool() {
    return bulletPool.length ? bulletPool.pop() : { x: 0, y: 0, width: 5, height: 10, dom: null };
}

function releaseBullet(bullet) {
    bulletPool.push(bullet);
}

export function playerPosition(input) {
    if (input["ArrowLeft"] && player.x > margin) player.x -= player.speed;
    if (input["ArrowRight"] && player.x < gameContainer.offsetWidth - player.width - margin - 8) player.x += player.speed;
    if (input["ArrowUp"] && player.y > margin + 100) player.y -= player.speed;
    if (input["ArrowDown"] && player.y < gameContainer.offsetHeight - player.height - margin - 8) player.y += player.speed;
}

export function playerShooting() {
    if (Date.now() - player.lastShot < player.fireRate) return;
    player.lastShot = Date.now();

    const spacing = 15;
    const startX = player.x + player.width / 2 - spacing * (player.shootingMultiplier - 1) / 2;

    for (let i = 0; i < player.shootingMultiplier; i++) {
        const bullet = getBulletFromPool();
        bullet.x = startX + spacing * i;
        bullet.y = player.y;
        bullet.dom = bullet.dom || document.createElement("div");
        bullet.dom.classList.add("player-bullet");
        bulletElements.push(bullet);
        gameContainer.appendChild(bullet.dom); // Append new bullets only once.
    }
}

function playerBulletPosition() {
    for (let i = bulletElements.length - 1; i >= 0; i--) {
        const bullet = bulletElements[i];
        bullet.y -= player.shootingSpeed;

        if (bullet.y < 0) {
            releaseBullet(bullet);
            bulletElements.splice(i, 1);
        } else {
            bullet.dom.style.left = `${bullet.x}px`;
            bullet.dom.style.top = `${bullet.y}px`;
        }
    }
}

export function renderGame() {
    renderPlayer();
    renderPlayerBullet();
}

function renderPlayer() {
    let playerElement = gameContainer.querySelector(".player");
    if (!playerElement) {
        playerElement = document.createElement("div");
        playerElement.classList.add("player");
        gameContainer.appendChild(playerElement);
    }
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
}

function renderPlayerBullet() {
    const fragment = document.createDocumentFragment();

    for (const bullet of bulletElements) {
        fragment.appendChild(bullet.dom); // Append existing bullet elements.
    }

    const bulletsInDOM = Array.from(gameContainer.querySelectorAll(".player-bullet"));
    bulletsInDOM.forEach((bulletElement) => {
        if (!bulletElements.some((b) => b.dom === bulletElement)) {
            bulletElement.remove();
        }
    });

    gameContainer.appendChild(fragment);
    playerBulletPosition();
}
