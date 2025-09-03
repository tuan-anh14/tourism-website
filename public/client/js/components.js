// Component Loader
class ComponentLoader {
    constructor() {
        this.components = {};
    }

    // Load component from file
    async loadComponent(name, selector) {
        try {
            const response = await fetch(`components/${name}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${name} component`);
            }
            const html = await response.text();
            this.components[name] = html;
            
            // Insert component into DOM
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = html;
                this.initializeComponent(name);
            }
        } catch (error) {
            console.error(`Error loading ${name} component:`, error);
        }
    }

    // Initialize component-specific functionality
    initializeComponent(name) {
        switch (name) {
            case 'header':
                this.initializeHeader();
                break;
            case 'footer':
                this.initializeFooter();
                break;
        }
    }

    // Initialize header functionality
    initializeHeader() {
        // Mobile menu toggle
        const menuBtn = document.querySelector(".menu-btn");
        const navlinks = document.querySelector(".nav-links");

        if (menuBtn && navlinks) {
            menuBtn.addEventListener("click", () => {
                navlinks.classList.toggle("mobile-menu");
            });
        }

        // Dark mode functionality
        const checkbox = document.getElementById("checkbox");
        if (checkbox) {
            this.initializeDarkMode(checkbox);
        }

        // Set active navigation based on current page
        this.setActiveNavigation();
    }

    // Initialize footer functionality
    initializeFooter() {
        // Add any footer-specific functionality here
        console.log('Footer component loaded');
    }

    // Initialize dark mode
    initializeDarkMode(checkbox) {
        function checkDarkMode() {
            if (
                localStorage.getItem("tourism_website_darkmode") !== null &&
                localStorage.getItem("tourism_website_darkmode") === "true"
            ) {
                document.body.classList.add("dark");
                checkbox.checked = true;
            }
        }

        checkDarkMode();

        checkbox.addEventListener("change", () => {
            document.body.classList.toggle("dark");
            document.body.classList.contains("dark")
                ? localStorage.setItem("tourism_website_darkmode", true)
                : localStorage.setItem("tourism_website_darkmode", false);
        });
    }

    // Set active navigation based on current page
    setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links li a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (currentPage === 'index.html' && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            } else if (currentPage === 'events.html' && link.getAttribute('href') === 'events.html') {
                link.classList.add('active');
            }
        });
    }

    // Load all components
    async loadAllComponents() {
        await Promise.all([
            this.loadComponent('header', '#header-placeholder'),
            this.loadComponent('footer', '#footer-placeholder')
        ]);
    }
}

// Initialize component loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const componentLoader = new ComponentLoader();
    componentLoader.loadAllComponents();
});
