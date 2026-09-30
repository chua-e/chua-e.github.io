import { Project, projects } from "./projects.js";
import { Paper, papers } from "./papers.js"

function all():void {
    customCursor();
    initializePageNavigation();

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

function initializePageNavigation(): void {
    const main = document.getElementById('page-content');
    const pageNameElement = document.getElementById('page-name');
    const links = document.querySelectorAll<HTMLAnchorElement>('.sidebar a[data-page]');

    if (!main) {
        return;
    }

    const aboutContent = main.innerHTML;
    const pageFiles: Record<string, string> = {
        resume: 'src/pages/resume.html',
        projects: 'src/pages/projects.html',
        research: 'src/pages/research.html',
        fortune: 'src/pages/fortune.html'
    };
    const pageTitles: Record<string, string> = {
        about: 'ABOUT ME',
        resume: 'CURRICULUM VITAE',
        projects: 'PROJECTS',
        research: 'RESEARCH',
        fortune: 'TRY YOUR FORTUNE'
    };
    let requestId = 0;

    const showPage = async (pageName: string): Promise<void> => {
        const selectedPage = pageName === 'about' || pageFiles[pageName] ? pageName : 'about';
        const currentRequestId = ++requestId;

        if (pageNameElement) {
            pageNameElement.textContent = pageTitles[selectedPage];
        }

        links.forEach((link) => {
            if (link.dataset.page === selectedPage) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        if (selectedPage === 'about') {
            main.innerHTML = aboutContent;
            return;
        }

        try {
            const response = await fetch(pageFiles[selectedPage]);
            if (!response.ok) {
                throw new Error(`Page request failed: ${response.status}`);
            }

            const content = await response.text();
            if (currentRequestId === requestId) {
                main.innerHTML = content;
                if (selectedPage === 'projects') {
                    showProjectList();
                }
            }
        } catch {
            if (currentRequestId === requestId) {
                main.innerHTML = '<section><h2>Page unavailable</h2><p>This page could not be loaded.</p></section>';
            }
        }
    };

    window.addEventListener('hashchange', () => {
        void showPage(window.location.hash.slice(1) || 'about');
    });

    if (!window.location.hash) {
        window.history.replaceState(null, '', '#about');
    }
    void showPage(window.location.hash.slice(1));
}

function showProjectList(): void {
    const list = document.querySelector<HTMLDivElement>("#proj-row-list");
    const preview = document.querySelector<HTMLDivElement>("#proj-view");

    if (!list || !preview) {
        return;
    }

    const projectButtons = projects.map((project) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "project-link";
        button.textContent = project.name;

        const caret = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        caret.setAttribute("viewBox", "0 0 16 16");
        caret.setAttribute("width", "16");
        caret.setAttribute("height", "16");
        caret.setAttribute("fill", "currentColor");
        caret.setAttribute("class", "project-caret");
        caret.setAttribute("aria-hidden", "true");

        const caretPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        caretPath.setAttribute("d", "m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z");
        caret.append(caretPath);
        button.prepend(caret);

        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            list.querySelectorAll<HTMLButtonElement>(".project-link").forEach((item) => {
                item.setAttribute("aria-pressed", String(item === button));
            });
            showProjectDetails(project, preview);
        });
        return button;
    });

    list.replaceChildren(...projectButtons);
}

function showProjectDetails(project: typeof projects[number], preview: HTMLDivElement): void {
    const heading = document.createElement("h2");
    heading.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const tags = document.createElement("p");
    tags.className = "project-tags";
    tags.textContent = project.tags.join(" | ");

    const details: HTMLElement[] = [heading, description];
    if (project.tags.length > 0) {
        details.push(tags);
    }

    if (project.link) {
        const link = document.createElement("a");
        link.className = "project-github";
        link.href = project.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "GitHub";
        details.push(link);
    }

    preview.replaceChildren(...details);
}

document.addEventListener("DOMContentLoaded", () => {
    all();
});