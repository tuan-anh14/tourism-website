// Blog Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Blog card hover effects
  const blogCards = document.querySelectorAll(".blog-card");

  blogCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Intersection Observer for animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe blog cards for scroll animation
  blogCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Load more functionality (placeholder)
  const loadMoreBtn = document.querySelector(".blog-load-more .ctn");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Add loading state
      this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang tải...';
      this.style.pointerEvents = "none";

      // Simulate loading delay
      setTimeout(() => {
        this.innerHTML = "Xem thêm bài viết";
        this.style.pointerEvents = "auto";

        // Here you would typically load more blog posts via AJAX
        console.log(
          "Load more blog posts functionality would be implemented here"
        );
      }, 2000);
    });
  }

  // Blog search functionality (if needed in future)
  function initializeBlogSearch() {
    // Placeholder for future search functionality
    console.log("Blog search functionality can be added here");
  }

  // Initialize blog search
  initializeBlogSearch();

  // Category filter functionality (if needed in future)
  function initializeCategoryFilter() {
    // Placeholder for future category filter functionality
    console.log("Category filter functionality can be added here");
  }

  // Initialize category filter
  initializeCategoryFilter();

  // Blog post sharing functionality
  function initializeSharing() {
    const shareButtons = document.querySelectorAll(".blog-share");

    shareButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        const url = window.location.href;
        const title = document.title;

        if (navigator.share) {
          navigator.share({
            title: title,
            url: url,
          });
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(url).then(() => {
            alert("Link đã được sao chép vào clipboard!");
          });
        }
      });
    });
  }

  // Initialize sharing
  initializeSharing();

  // Reading progress indicator
  function initializeReadingProgress() {
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #fc036b, #ff6b9d);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressBar.style.width = scrollPercent + "%";
    });
  }

  // Initialize reading progress
  initializeReadingProgress();

  console.log("Blog page JavaScript loaded successfully");
});
