// --- Настройка холста (Canvas) ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер холста равным размеру окна
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Инициализация размера


// --- Настройки неонового следа ---
let particles = [];
const particleCount = 2; // Сколько частиц добавлять за один кадр
const particleColor = '#00f2ff'; // Твой неоновый голубой
const trailLength = 50; // Примерная длина следа (количество кадров)


// Класс частицы
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2; // Стартовый размер частицы
        this.baseSize = 2;
        this.alpha = 1; // Стартовая прозрачность
        this.alphaStep = 1 / trailLength; // На сколько уменьшать прозрачность каждый кадр
    }

    // Метод обновления состояния частицы
    update() {
        this.size = Math.max(0.1, this.size * 0.98); // Частица немного уменьшается
        this.alpha -= this.alphaStep; // Частица становится прозрачнее
    }

    // Метод отрисовки частицы
    draw() {
        if (this.alpha <= 0) return; // Не рисуем, если прозрачность <= 0

        ctx.globalAlpha = this.alpha; // Задаем прозрачность
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // --- ЭФФЕКТ СВЕЧЕНИЯ (Следа) ---
        ctx.shadowBlur = 10; // Сила свечения
        ctx.shadowColor = particleColor; // Цвет свечения
        
        ctx.closePath();
    }
}


// --- Обработка движения мыши ---
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Добавляем новые частицы при движении
    for (let i = 0; i < particleCount; i++) {
        // Добавляем небольшой разброс
        const offsetX = (Math.random() - 0.5) * 5;
        const offsetY = (Math.random() - 0.5) * 5;
        particles.push(new Particle(mouseX + offsetX, mouseY + offsetY));
    }
});


// --- Главный цикл анимации ---
function animate() {
    // Очищаем холст, но сохраняем небольшое "послесвечение"
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0; // Отключаем тень для очистки
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // У тебя в body задано pointer-events: none, поэтому клики проходят сквозь.
    // Но для анимации нам нужно "стереть" старые частицы.
    // Если pointer-events: auto, то кликать нельзя.
    // Это хитрый способ: мы рисуем на прозрачном холсте.

    // Обновляем и рисуем все частицы
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Удаляем старые, невидимые частицы
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate); // Запускаем следующий кадр
}

// Запускаем анимацию
animate();
const typeSelect = document.getElementById('type');
const lengthInput = document.getElementById('length');
const totalSpan = document.getElementById('total');
