const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let playerX = 10;
let playerY = 290;
let score = 0;
const lasers = [];
const enemies = [];

const shootSound = new Audio('shoot.wav'); // You'll need to create or find these sound files
const explosionSound = new Audio('explosion.wav');

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        playerY -= 10;
    }
    if (event.key === 'ArrowDown') {
        playerY += 10;
    }
    if (event.key === 'ArrowLeft') {
        playerX -= 10;
    }
    if (event.key === 'ArrowRight') {
        playerX += 10;
    }
    if (event.key === ' ') {
        createLaser();
    }
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
});

function createLaser() {
    const laser = document.createElement('div');
    laser.className = 'laser';
    laser.style.left = (playerX + 50) + 'px';
    laser.style.top = (playerY + 8) + 'px';
    gameContainer.appendChild(laser);
    lasers.push(laser);
    shootSound.play();
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = '800px';
    enemy.style.top = Math.random() * 570 + 'px';
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

function gameLoop() {
    // Move lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        let laserX = parseInt(laser.style.left);
        laserX += 5;
        laser.style.left = laserX + 'px';

        if (laserX > 800) {
            laser.remove();
            lasers.splice(i, 1);
        }
    }

    // Move enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        let enemyX = parseInt(enemy.style.left);
        enemyX -= 3;
        enemy.style.left = enemyX + 'px';

        if (enemyX < -30) {
            enemy.remove();
            enemies.splice(i, 1);
        }

        // Collision detection
        for (let j = lasers.length - 1; j >= 0; j--) {
            const laser = lasers[j];
            const laserRect = laser.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (
                laserRect.left < enemyRect.right &&
                laserRect.right > enemyRect.left &&
                laserRect.top < enemyRect.bottom &&
                laserRect.bottom > enemyRect.top
            ) {
                laser.remove();
                lasers.splice(j, 1);
                enemy.remove();
                enemies.splice(i, 1);
                score += 10;
                scoreDisplay.textContent = 'Score: ' + score;
                explosionSound.play();
            }
        }
    }

    // Create new enemies periodically
    if (Math.random() < 0.02) {
        createEnemy();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

