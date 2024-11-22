import { player, getBullets, updateBullets } from './player.js';

export function renderPlayer() {
    const gameContainer = document.getElementById('game-container');
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.left = `${player.x}px`;
    p.style.top = `${player.y}px`;
    p.style.width = `${player.width}px`;
    p.style.height = `${player.height}px`;
    p.style.backgroundColor = 'red';
    p.classList.add("ship")
    gameContainer.appendChild(p);
}

export function renderBullets() {
    const gameContainer = document.getElementById('game-container');
    const bullets = getBullets();

    bullets.forEach(bullet => {
        const b = document.createElement('div');
        b.style.position = 'absolute';
        b.style.left = `${bullet.x}px`;
        b.style.top = `${bullet.y}px`;
        b.style.width = `${bullet.width}px`;
        b.style.height = `${bullet.height}px`;
        b.style.backgroundColor = 'yellow';

        gameContainer.appendChild(b);
    });

    updateBullets();
}

export function render() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    renderPlayer();
    renderBullets();
}
