// Events Page JavaScript

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

function checkDarkMode() {
    if (
        localStorage.getItem("tourism_website_darkmode") !== null &&
        localStorage.getItem("tourism_website_darkmode") === "true"
    ) {
        document.body.classList.add("dark");
        if (checkbox) checkbox.checked = true;
    }
}

if (checkbox) {
    checkbox.addEventListener("change", () => {
        document.body.classList.toggle("dark");
        document.body.classList.contains("dark")
            ? localStorage.setItem("tourism_website_darkmode", true)
            : localStorage.setItem("tourism_website_darkmode", false);
    });
}

// Scroll to top functionality
let mybutton = document.getElementById("upbtn");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        if (mybutton) mybutton.style.display = "block";
    } else {
        if (mybutton) mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Initialize dark mode check
checkDarkMode();

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for event cards
document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.standard-card');
    
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add click event for booking buttons
document.querySelectorAll('.ctn').forEach(button => {
    if (button.textContent === 'Book Now') {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Add booking functionality here
            alert('Booking functionality will be implemented soon!');
        });
    }
});
