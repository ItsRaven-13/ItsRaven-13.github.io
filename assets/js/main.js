document.addEventListener('DOMContentLoaded', () => {
    const flowerContainer = document.getElementById('flower-container');
    // Cambia el fondo a negro al cargar
    document.body.style.background = '#000';

    // Estilos para las flores animadas
    const style = document.createElement('style');
    style.innerHTML = `
        #flower-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }
        .flower {
            position: absolute;
            pointer-events: none;
            animation: fadeIn 1.5s, float 4s ease-in-out infinite;
            opacity: 0;
            animation-fill-mode: forwards;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes float {
            0% { transform: translateY(0) scale(1) rotate(0deg); }
            50% { transform: translateY(-20px) scale(1.1) rotate(10deg); }
            100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        .petal {
            position: absolute;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle at 60% 40%, #ffe066 80%, #ffd700 100%);
            border-radius: 50% 50% 0 0;
            transform-origin: 50% 100%;
        }
        .center {
            position: absolute;
            left: 35%;
            top: 35%;
            width: 30%;
            height: 30%;
            background: radial-gradient(circle, #ffecb3 60%, #e6b800 100%);
            border-radius: 50%;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);

    // Mostrar flores automáticamente después de 3 segundos
    setTimeout(() => {
        flowerContainer.innerHTML = '';
        const numberOfFlowers = 20;
        // Dispersión: evitar que las flores estén muy juntas
        const minDistance = 100;
        const positions = [];
        let attempts = 0;
        let created = 0;
        while (created < numberOfFlowers && attempts < numberOfFlowers * 20) {
            attempts++;
            const size = Math.random() * 30 + 30; // Entre 30 y 60 px
            const x = Math.random() * (window.innerWidth - 60);
            const y = Math.random() * (window.innerHeight - 60);
            let tooClose = false;
            for (const pos of positions) {
                const dx = x - pos.x;
                const dy = y - pos.y;
                if (Math.sqrt(dx*dx + dy*dy) < minDistance) {
                    tooClose = true;
                    break;
                }
            }
            if (tooClose) continue;
            positions.push({x, y});
            created++;
            const flower = document.createElement('div');
            flower.classList.add('flower');
            flower.style.left = `${x}px`;
            flower.style.top = `${y}px`;
            flower.style.width = `${size}px`;
            flower.style.height = `${size}px`;
            const delay = Math.random() * 2;
            flower.style.animationDelay = `${delay}s, ${delay}s`;
            const petals = 6 + Math.floor(Math.random() * 3);
            for (let p = 0; p < petals; p++) {
                const petal = document.createElement('div');
                petal.classList.add('petal');
                petal.style.transform = `rotate(${(360/petals)*p}deg) translateY(-40%)`;
                flower.appendChild(petal);
            }
            const center = document.createElement('div');
            center.classList.add('center');
            flower.appendChild(center);

            // Arrastre solo para cada flor (mouse)
            flower.addEventListener('mousedown', (e) => {
                e.preventDefault();
                let offsetX = e.clientX - flower.offsetLeft;
                let offsetY = e.clientY - flower.offsetTop;
                flower.style.zIndex = 1000;
                flower.style.animationPlayState = 'paused';
                function onMouseMove(ev) {
                    flower.style.left = `${ev.clientX - offsetX}px`;
                    flower.style.top = `${ev.clientY - offsetY}px`;
                }
                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    flower.style.zIndex = '';
                    flower.style.animationPlayState = '';
                }
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            // Arrastre táctil solo para cada flor (touch)
            flower.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                let offsetX = touch.clientX - flower.offsetLeft;
                let offsetY = touch.clientY - flower.offsetTop;
                flower.style.zIndex = 1000;
                flower.style.animationPlayState = 'paused';
                function onTouchMove(ev) {
                    const t = ev.touches[0];
                    flower.style.left = `${t.clientX - offsetX}px`;
                    flower.style.top = `${t.clientY - offsetY}px`;
                }
                function onTouchEnd() {
                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    flower.style.zIndex = '';
                    flower.style.animationPlayState = '';
                }
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', onTouchEnd);
            });
            flowerContainer.appendChild(flower);
        }
    }, 3000);
});
