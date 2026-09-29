function all():void {
    customCursor();

    const clock = new Clock();
    clock.start();

    getDate();

}

function customCursor():void {
    const cursor = document.getElementById('cursor') as HTMLDivElement | null;

    if (cursor) {
    const offset = 10; 

    window.addEventListener('mousemove', (e: MouseEvent): void => {
        const x = e.clientX - offset;
        const y = e.clientY - offset;
        
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    });

    const hoverTargets = document.querySelectorAll<HTMLElement>('.hoverable');

    hoverTargets.forEach((target) => {
        target.addEventListener('mouseenter', (): void => {
        cursor.classList.add('hovering');
        });

        target.addEventListener('mouseleave', (): void => {
        cursor.classList.remove('hovering');
        });
    });
    }
}

class Clock {
    private element: HTMLElement;
    private timerId: number | null = null;

    constructor() {
        const el = document.getElementById('digi-clock') as HTMLDivElement;
        this.element = el;
    }

    public start(): void {
        this.updateClock();
        this.timerId = window.setInterval(() => this.updateClock(), 1000);
    }

    public stop(): void {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    private updateClock(): void {
        const now = new Date();
        this.element.textContent = now.toLocaleTimeString();
    }
}

function getDate():void {
    const dateDiv = document.getElementById('date-display') as HTMLDivElement | null;

    if (dateDiv) {
        const today: Date = new Date();

        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };

        dateDiv.textContent = today.toLocaleDateString('en-US', options);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    all();
});