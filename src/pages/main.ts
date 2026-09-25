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

customCursor();