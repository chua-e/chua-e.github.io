"use strict";
function all() {
    customCursor();
    const clock = new Clock();
    clock.start();
}
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
                cursor.classList.remove('hovering');
            });
        });
    }
}
class Clock {
    constructor() {
        this.timerId = null;
        const el = document.getElementById('digi-clock');
        this.element = el;
    }
    start() {
        this.updateClock();
        this.timerId = window.setInterval(() => this.updateClock(), 1000);
    }
    stop() {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
    updateClock() {
        const now = new Date();
        this.element.textContent = now.toLocaleTimeString();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    all();
});
