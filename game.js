const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const healthBar = document.getElementById('health-bar');
const gameOverScreen = document.getElementById('game-over');

// Resize
let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Input
const keys = {};
const mouse = { x: width / 2, y: height / 2 };

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mousedown', shoot);

// Game State
let gameState = 'playing'; // playing, gameover
let score = 0;
let player = {
    x: width / 2,
    y: height / 2,
    radius: 15,
    health: 100,
    speed: 5
};

const projectiles = [];
const enemies = [];
const particles = [];
const pauseMenu = document.getElementById('pause-menu');

// Classes
class Projectile {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = 3;
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 15 + 10;
        this.color = Math.random() > 0.5 ? '#333' : '#666';
        this.velocity = { x: 0, y: 0 };
        this.speed = Math.random() * 2 + 1;
    }
    update() {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.velocity.x = Math.cos(angle) * this.speed;
        this.velocity.y = Math.sin(angle) * this.speed;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };
        this.alpha = 1;
        this.life = Math.random() * 0.5 + 0.5;
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Pause Functionality
const pauseOptions = document.querySelectorAll('.pause-item');
const contextDesc = document.getElementById('context-desc');

function togglePause() {
    if (gameState === 'gameover') return;

    if (gameState === 'playing') {
        gameState = 'paused';
        pauseMenu.classList.remove('hidden');
        // Small delay to allow CSS transition to catch the display change
        setTimeout(() => pauseMenu.classList.add('visible'), 10);
    } else if (gameState === 'paused') {
        gameState = 'playing';
        pauseMenu.classList.remove('visible');
        setTimeout(() => pauseMenu.classList.add('hidden'), 200);
        animate();
    }
}

// Menu Interactions
pauseOptions.forEach(item => {
    // Hover Effects
    item.addEventListener('mouseenter', () => {
        pauseOptions.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Update Description
        const desc = item.getAttribute('data-desc');
        if (contextDesc) contextDesc.innerText = desc;
    });

    // Click Actions
    item.addEventListener('click', () => {
        const action = item.innerText;

        if (action === 'RESUME') togglePause();
        if (action === 'SETTINGS') alert("Settings overlay not implemented in demo.");
        if (action === 'RESTART SIMULATION') location.reload();
        if (action === 'ACCESSIBILITY') alert("Accessibility options.");
        if (action === 'MAIN MENU') location.href = 'index.html';
        if (action === 'QUIT TO DESKTOP') {
            document.body.innerHTML = '';
            document.body.style.background = 'black';
            setTimeout(() => window.close(), 1000);
        }
    });
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') togglePause();
});

// document.getElementById('btn-resume').addEventListener('click', togglePause); // Removed old button listener

// Functions
function shoot() {
    if (gameState !== 'playing') return;

    // Calculate angle to mouse
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const velocity = {
        x: Math.cos(angle) * 15,
        y: Math.sin(angle) * 15
    };
    projectiles.push(new Projectile(player.x, player.y, velocity));
}

function spawnEnemy() {
    if (gameState !== 'playing') return;

    const side = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
    let x, y;

    if (side === 0) { x = Math.random() * width; y = -50; }
    else if (side === 1) { x = width + 50; y = Math.random() * height; }
    else if (side === 2) { x = Math.random() * width; y = height + 50; }
    else { x = -50; y = Math.random() * height; }

    enemies.push(new Enemy(x, y));
}
setInterval(spawnEnemy, 1000);

// Loop
function animate() {
    if (gameState === 'paused') return;
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // Player Movement
    if (gameState === 'playing') {
        if (keys['w'] || keys['arrowup']) player.y -= player.speed;
        if (keys['s'] || keys['arrowdown']) player.y += player.speed;
        if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
        if (keys['d'] || keys['arrowright']) player.x += player.speed;

        // Boundaries
        player.x = Math.max(player.radius, Math.min(width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(height - player.radius, player.y));
    }

    // Draw Player
    if (gameState === 'playing') {
        ctx.save();
        ctx.translate(player.x, player.y);
        const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }

    // Update Systems
    projectiles.forEach((p, pIndex) => {
        p.update();
        p.draw();

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            setTimeout(() => projectiles.splice(pIndex, 1), 0);
        }
    });

    enemies.forEach((enemy, eIndex) => {
        enemy.update();
        enemy.draw();

        // Collision: Projectile vs Enemy
        projectiles.forEach((p, pIndex) => {
            const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
            if (dist - enemy.radius - p.radius < 1) {
                // Destroy Enemy
                for (let i = 0; i < 8; i++) particles.push(new Particle(enemy.x, enemy.y, 'white'));
                setTimeout(() => {
                    enemies.splice(eIndex, 1);
                    projectiles.splice(pIndex, 1);
                    score += 100;
                    scoreEl.innerText = score;
                }, 0);
            }
        });

        // Collision: Player vs Enemy
        if (gameState === 'playing') {
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            if (dist - enemy.radius - player.radius < 1) {
                player.health -= 20;
                healthBar.style.width = player.health + '%';
                enemies.splice(eIndex, 1);
                for (let i = 0; i < 8; i++) particles.push(new Particle(enemy.x, enemy.y, 'red'));

                if (player.health <= 0) {
                    endGame();
                }
            }
        }
    });

    particles.forEach((p, index) => {
        if (p.alpha <= 0) particles.splice(index, 1);
        else {
            p.update();
            p.draw();
        }
    });
}

function endGame() {
    gameState = 'gameover';
    finalScoreEl.innerText = score;
    gameOverScreen.style.display = 'flex';
}

animate();
