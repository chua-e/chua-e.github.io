import { projects } from "./projects.js";
function all() {
    customCursor();
    initializePageNavigation();
    const clock = new Clock();
    clock.start();
    getDate();
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
function getDate() {
    const dateDiv = document.getElementById('date-display');
    if (dateDiv) {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateDiv.textContent = today.toLocaleDateString('en-US', options);
    }
}
function initializePageNavigation() {
    const main = document.getElementById('page-content');
    const pageNameElement = document.getElementById('page-name');
    const links = document.querySelectorAll('.sidebar a[data-page]');
    if (!main) {
        return;
    }
    const aboutContent = main.innerHTML;
    const pageFiles = {
        resume: 'src/pages/resume.html',
        projects: 'src/pages/projects.html',
        research: 'src/pages/research.html',
        fortune: 'src/pages/fortune.html'
    };
    const pageTitles = {
        about: 'ABOUT ME',
        resume: 'RESUME',
        projects: 'PROJECTS',
        research: 'RESEARCH',
        fortune: 'TRY YOUR FORTUNE'
    };
    let requestId = 0;
    const showPage = async (pageName) => {
        const selectedPage = pageName === 'about' || pageFiles[pageName] ? pageName : 'about';
        const currentRequestId = ++requestId;
        if (pageNameElement) {
            pageNameElement.textContent = pageTitles[selectedPage];
        }
        links.forEach((link) => {
            if (link.dataset.page === selectedPage) {
                link.setAttribute('aria-current', 'page');
            }
            else {
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
        }
        catch {
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
function showProjectList() {
    const list = document.querySelector("#proj-row-list");
    if (list) {
        list.replaceChildren(...projects.map((project) => {
            const link = document.createElement("a");
            link.href = project.link || '#';
            link.textContent = project.name;
            return link;
        }));
    }
}
document.addEventListener("DOMContentLoaded", () => {
    all();
});
