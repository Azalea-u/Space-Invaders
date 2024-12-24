import { renderGame, playerPosition, playerShooting } from "./player.js";
import { spawnWave } from "./waves.js";

// Cache DOM selectors
const gameContainer = document.getElementById("game-container");
const Pause_Menu = document.getElementById("pause-screen");
const Resume_Button = document.getElementById("resume-button");
const Restart_Button = document.getElementById("restart-button");

let Key_Input = {};
let game_Running = true;

function Pause_Game() {
    game_Running = !game_Running;
    
    if (game_Running) {
        Pause_Menu.classList.add("hidden");
        requestAnimationFrame(gameloop);
    } else {
        Pause_Menu.classList.remove("hidden");
    }
}

function handleKeyInput(event) {
    if (event.type === "keydown") {
        Key_Input[event.key] = true;
        if (event.key === "Escape") Pause_Game();
    } else if (event.type === "keyup") {
        Key_Input[event.key] = false;
    }
}

let lastTime = 0;
const fpsInterval = 1000 / 60;

function gameloop(timestamp) {
    if (timestamp - lastTime >= fpsInterval) {
        lastTime = timestamp;
        if (game_Running) {
            playerPosition(Key_Input);
            if (Key_Input[" "] || Key_Input["Space"]) playerShooting();
            renderGame();

            if (shouldSpawnNextWave()) {
                spawnWave();
            }
        }
    }

    if (game_Running) {
        requestAnimationFrame(gameloop);
    }
}

function shouldSpawnNextWave() {
    const enemiesRemaining = document.querySelectorAll(".enemy").length;
    return enemiesRemaining === 0;
}

gameloop();

window.addEventListener("keydown", handleKeyInput);
window.addEventListener("keyup", handleKeyInput);

Resume_Button.addEventListener("click", Pause_Game);
Restart_Button.addEventListener("click", () => {
    location.reload();
});
