import { renderPlayer, playerPosition, playerAttack, renderBullets, checkDamage, livesNumber } from "./player.js";
import { spawnEnemies, renderEnemies, updateEnemyPositions, checkBulletCollisions, startNewWave, enemies, enemiesAttack, renderEnemiesBullets, updateEnemiesBulletsPosition } from "./waves.js";
const colors = ["#FF0000", "#008000", "#0000FF", "#FFFF00"];

const Pause_Menu = document.getElementById("pause-screen")
const Resume_Button = document.getElementById("resume-button")
const Restart_Button = document.getElementById("restart-button")
const Game_Over = document.getElementById("game-over")
const gameContainer = document.getElementById("game-container")
const wavesElement = document.getElementById('Waves')
let TimeElement = document.getElementById('timer')

let key_Inputs = {}
let game_Running = true
let gameOver = false
let waveNumber = 1
let seconds = 0;
let mseconds = 0;
let minutes = 0
let isFirstWave = true;  // Flag to track if it's the first wave

function setTime() {
    mseconds++;
    if (mseconds === 60) {
        mseconds = 0;
        seconds++;
    }
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    TimeElement.textContent = `Timer: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
function Pause_Game() {

    if (!gameOver) {
        game_Running = !game_Running
        if (game_Running) {
            Pause_Menu.classList.add("hidden")
            requestAnimationFrame(gameloop)
        } else {
            Pause_Menu.classList.remove("hidden")
        }
    }

}
function GameOver() {
    if (livesNumber <= 0) {
        Game_Over.classList.remove("hidden")
        gameOver = true
    }
}

function handleKeyInput(event) {
    if (event.type === "keydown") {
        key_Inputs[event.key] = true
        if (event.key === "Escape") Pause_Game()
    } else if (event.type === "keyup") {
        key_Inputs[event.key] = false;
    }
}
const spaceBarSound = new Audio('./shoot.wav');  // Replace with the path to your sound file
function gameloop() {
    if (!gameOver) {
        if (game_Running) {
            playerPosition(key_Inputs)
            gameContainer.innerHTML = ""
            renderPlayer()
            if (key_Inputs[" "] || key_Inputs["Space"]) {
                spaceBarSound.play()
                playerAttack()
            }
            renderBullets()
            let color = colors[Math.floor(Math.random() * colors.length)];
            renderEnemies(color)
            setTime()
            updateEnemyPositions()
            checkBulletCollisions()
            enemiesAttack()
            renderEnemiesBullets()
            updateEnemiesBulletsPosition()
            if (enemies.length === 0 && !isFirstWave) {
                waveNumber++
                wavesElement.textContent = `Waves: ${waveNumber}`;
                startNewWave()
            }
            if (isFirstWave && enemies.length > 0) {
                isFirstWave = false;  // Now the first wave has been completed
            }
            checkDamage()

        }
        if (game_Running) {
            requestAnimationFrame(gameloop);
        }
        GameOver()
    }

}

gameloop()

window.addEventListener("keydown", handleKeyInput)
window.addEventListener("keyup", handleKeyInput)

Resume_Button.addEventListener("click", Pause_Game)
Restart_Button.addEventListener("click", () => {
    location.reload()
})
document.getElementById("restart-button2").addEventListener("click", () => {
    location.reload()
})

spawnEnemies()