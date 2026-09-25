"use strict";
function customCursor() {
    const cursor = document.getElementById('cursor');
    if (cursor) {
        const offset = 10;
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX - offset;
            const y = e.clientY - offset;
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        });
        const hoverTargets = document.querySelectorAll('.hoverable');
        hoverTargets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.add('hovering');
            });
        });
    }
}
customCursor();
