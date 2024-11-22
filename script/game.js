import { updatePlayerPosition, shootBullet, player } from './player.js';
import { render } from './render.js';

let gameRunning = true;
const pauseMenu = document.getElementById('pause-menu');
const timerDisplay = document.getElementById('timer');

let keysPressed = {};
let startTime = Date.now();

function togglePause() {
    gameRunning = !gameRunning;
    pauseMenu.style.display = gameRunning ? 'none' : 'block';
    if (gameRunning) requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
    const key = event.code;
    keysPressed[key] = true;

    if (key === 'Escape') togglePause();
    if (key === 'Space' && player.canshoot == true) shootBullet();
}

function handleKeyUp(event) {
    const key = event.code;
    keysPressed[key] = false;
    if (key === 'Space') player.canshoot = true
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsedTime}s`;
}

function gameLoop() {
    if (!gameRunning) return;

    updatePlayerPosition(keysPressed);
    updateTimer();
    render();

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
requestAnimationFrame(gameLoop);
