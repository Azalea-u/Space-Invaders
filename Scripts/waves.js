const gameContainer = document.getElementById("game-container");

const enemyData = [
    { color: "cyan", points: 10, health: 1, dimensions: { width: 20, height: 20 } },
    { color: "lime", points: 20, health: 3, dimensions: { width: 25, height: 25 } },
    { color: "gold", points: 30, health: 5, dimensions: { width: 30, height: 30 } },
    { color: "orange", points: 40, health: 7, dimensions: { width: 35, height: 35 } },
    { color: "red", points: 50, health: 10, dimensions: { width: 40, height: 40 } },
];

let waveNumber = 10;
let activeEnemies = [];
let attackIntervalId;
const MAX_ROWS = 4;
const MIN_SPACING_Y = 50;

export function spawnWave() {
    const baseEnemyCount = 5;
    const additionalEnemies = Math.floor(waveNumber / 3);
    const rowCount = Math.min(1 + Math.floor(waveNumber / 5), MAX_ROWS);
    const spacing = 50;
    const startY = 100;

    for (let row = 0; row < rowCount; row++) {
        const enemyType = getEnemyType(waveNumber);
        const enemyCount = calculateEnemyCount(baseEnemyCount + additionalEnemies, enemyType, spacing);
        const rowY = startY + row * (enemyType.dimensions.height + MIN_SPACING_Y);
        spawnRow(enemyCount, spacing, rowY, enemyType);
    }

    startEnemyAttacks();
    waveNumber++;
}

function getEnemyType(waveNumber) {
    const index = Math.min(Math.floor(waveNumber / 3), enemyData.length - 1);
    return enemyData[index];
}

function calculateEnemyCount(baseCount, enemyType, spacing) {
    const containerWidth = gameContainer.offsetWidth;
    const enemyWidth = enemyType.dimensions.width;
    const maxCount = Math.floor((containerWidth + spacing) / (enemyWidth + spacing));
    return Math.min(baseCount, maxCount);
}

function spawnRow(count, spacing, startY, enemyAttributes) {
    const totalWidth = count * enemyAttributes.dimensions.width + (count - 1) * spacing;
    const startX = (gameContainer.offsetWidth - totalWidth) / 2;

    for (let i = 0; i < count; i++) {
        const x = startX + i * (enemyAttributes.dimensions.width + spacing);
        spawnEnemy(x, startY, enemyAttributes);
    }
}

function spawnEnemy(x, y, attributes) {
    const enemyElement = document.createElement("div");
    enemyElement.classList.add("enemy");
    enemyElement.style.left = `${x}px`;
    enemyElement.style.top = `${y}px`;
    enemyElement.style.width = `${attributes.dimensions.width}px`;
    enemyElement.style.height = `${attributes.dimensions.height}px`;
    enemyElement.style.backgroundColor = attributes.color;
    enemyElement.style.position = "absolute";

    enemyElement.dataset.points = attributes.points;
    enemyElement.dataset.health = attributes.health;

    gameContainer.appendChild(enemyElement);
    activeEnemies.push(enemyElement);
}

function startEnemyAttacks() {
    clearInterval(attackIntervalId);
    const baseInterval = 2000;
    const attackInterval = Math.max(baseInterval - waveNumber * 150, 100);

    attackIntervalId = setInterval(() => {
        if (activeEnemies.length === 0) return;

        const randomEnemy = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        enemyAttack(randomEnemy);
    }, attackInterval);
}

function enemyAttack(enemy) {
    if (!enemy) return;

    const attackProjectile = document.createElement("div");
    attackProjectile.classList.add("projectile");
    attackProjectile.style.width = "5px";
    attackProjectile.style.height = "15px";
    attackProjectile.style.backgroundColor = "yellow";
    attackProjectile.style.position = "absolute";
    attackProjectile.style.left = `${parseInt(enemy.style.left) + enemy.offsetWidth / 2 - 2.5}px`;
    attackProjectile.style.top = `${parseInt(enemy.style.top) + enemy.offsetHeight}px`;

    gameContainer.appendChild(attackProjectile);

    const moveInterval = setInterval(() => {
        const currentTop = parseInt(attackProjectile.style.top);
        attackProjectile.style.top = `${currentTop + 5}px`;

        if (currentTop > gameContainer.offsetHeight) {
            clearInterval(moveInterval);
            attackProjectile.remove();
        }
    }, 16);
}
