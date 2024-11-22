import { updatePlayerPosition, shootBullet, player } from './player.js';
import { render } from './render.js';

let gameRunning = true;
let elapsedTime = 0;
let timerInterval = null;
let keysPressed = {};

const pauseMenu = document.getElementById('pause-menu');
const timerDisplay = document.getElementById('timer');

function togglePause() {
    gameRunning = !gameRunning;

    if (gameRunning) {
        pauseMenu.style.display = 'none';
        startTimer();
        requestAnimationFrame(gameLoop);
    } else {
        pauseMenu.style.display = 'block';
        stopTimer();
    }
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            elapsedTime++;
            timerDisplay.textContent = `Time: ${elapsedTime}s`;
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function handleKeyDown(event) {
    const key = event.code;
    keysPressed[key] = true;

    if (key === 'Escape') togglePause();
    if (key === 'Space' && player.canshoot) shootBullet();
}

function handleKeyUp(event) {
    const key = event.code;
    keysPressed[key] = false;

    if (key === 'Space') player.canshoot = true;
}

function gameLoop() {
    if (!gameRunning) return;

    updatePlayerPosition(keysPressed);
    render();

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

startTimer();
requestAnimationFrame(gameLoop);
