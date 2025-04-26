"use strict";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // ===== FAQ Accordion =====
  initFaqAccordion();
  
  // ===== Smooth Scrolling =====
  initSmoothScrolling();
  
  // ===== Testimonials Slider =====
  initTestimonials();
  
  // ===== Scroll Animations =====
  initScrollAnimations();
  
  // ===== Back to Top Button =====
  initBackToTop();
  
  // ===== Navigation Highlighting =====
  initNavHighlighting();
  
  // ===== Mobile Menu & Language Selector =====
  initMobileMenu();
});

// FAQ accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;
  
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    
    question.addEventListener("click", () => {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });
      item.classList.toggle("active");
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return; // Skip empty anchors
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Testimonials slider
function initTestimonials() {
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prevButton = document.querySelector(".prev-testimonial");
  const nextButton = document.querySelector(".next-testimonial");
  
  if (!testimonials.length || !dots.length) return;
  
  let currentTestimonial = 0;
  let isAnimating = false;
  let testimonialInterval;
  
  // Show testimonial function with improved handling
  function showTestimonial(index) {
    // Prevent transitions during animation or to current slide
    if (isAnimating || index === currentTestimonial) return;
    isAnimating = true;
    
    // Clear any existing rotation interval
    clearInterval(testimonialInterval);
    
    // Start fade out animation
    testimonials[currentTestimonial].classList.add("fade-out");
    
    setTimeout(() => {
      // Hide all testimonials
      testimonials.forEach((testimonial) => {
        testimonial.style.display = "none";
        testimonial.classList.remove("fade-out", "fade-in");
      });
      
      // Remove active class from all dots
      dots.forEach(dot => dot.classList.remove("active"));
      
      // Show the selected testimonial
      testimonials[index].style.display = "block";
      void testimonials[index].offsetWidth; // Trigger reflow
      testimonials[index].classList.add("fade-in");
      dots[index].classList.add("active");
      
      // Update current testimonial index
      currentTestimonial = index;
      
      // Reset animation state after transition
      setTimeout(() => {
        isAnimating = false;
        startRotation(); // Restart the automatic rotation
      }, 500);
    }, 300);
  }
  
  // Initialize testimonials properly
  testimonials.forEach((testimonial, index) => {
    if (index === 0) {
      testimonial.style.display = "block";
      testimonial.classList.add("fade-in");
      dots[0].classList.add("active");
    } else {
      testimonial.style.display = "none";
    }
  });
  
  // Start testimonial rotation with debounce
  function startRotation() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      if (!isAnimating) {
        const index = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(index);
      }
    }, 8000);
  }
  
  // Testimonial navigation controls
  if (prevButton && nextButton) {
    prevButton.addEventListener("click", () => {
      let index = currentTestimonial - 1;
      if (index < 0) index = testimonials.length - 1;
      showTestimonial(index);
    });
    
    nextButton.addEventListener("click", () => {
      const index = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(index);
    });
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index);
    });
  });
  
  // Pause rotation on hover
  const testimonialControls = document.querySelector(".testimonial-controls");
  if (testimonialControls) {
    testimonialControls.addEventListener("mouseenter", () => clearInterval(testimonialInterval));
    testimonialControls.addEventListener("mouseleave", startRotation);
  }
  
  // Start automatic rotation
  startRotation();
}

// Stats Counter Animation
function animateCounter(el) {
  if (!el || !el.hasAttribute("data-count")) return;
  
  const target = parseInt(el.getAttribute("data-count"));
  if (isNaN(target)) return;
  
  const duration = 2000; // 2 seconds
  const step = target / (duration / 30); // Update every 30ms
  let current = 0;
  
  // Start from a small value rather than 0 for better UX
  if (target > 100) current = Math.floor(target * 0.1);
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current).toLocaleString();
  }, 30);
}

// Scroll animations
function initScrollAnimations() {
  if (!window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        
        // If it's a stats item, animate the counter
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        if (statNumbers.length) {
          statNumbers.forEach(animateCounter);
        }
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });
  
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// Back to top button
function initBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");
  if (!backToTopButton) return;
  
  // Throttled scroll handler
  let lastScrollTop = 0;
  let ticking = false;
  
  window.addEventListener("scroll", () => {
    lastScrollTop = window.pageYOffset;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        backToTopButton.classList.toggle("active", lastScrollTop > 300);
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Navigation highlighting
function initNavHighlighting() {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length) return;
  
  // Throttled scroll handler for performance
  let lastScrollTop = 0;
  let ticking = false;
  
  function updateNavHighlight() {
    const scrollPosition = window.scrollY + 100;
    const navLinks = document.querySelectorAll("nav ul li a");
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute("id");
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }
  
  window.addEventListener("scroll", () => {
    lastScrollTop = window.pageYOffset;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateNavHighlight();
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // Initial call
  updateNavHighlight();
}

// Mobile menu and language selector handling
function initMobileMenu() {
  // Prevent reload on active language click
  document.querySelectorAll(".dropdown-content a").forEach(link => {
    link.addEventListener("click", function(e) {
      if (this.classList.contains("active")) {
        e.preventDefault();
      }
    });
  });
  
  // Mobile menu handling
  const mobileMenuToggle = document.querySelector(".mobile-menu");
  const mainNav = document.getElementById("main-nav");
  const body = document.body;
  const header = document.querySelector("header");
  
  if (!mobileMenuToggle || !mainNav || !header) return;
  
  // Create overlay if needed
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeMenu);
  }
  
  // Detect device type and update menu positioning
  function detectDeviceType() {
    const width = window.innerWidth;
    if (width <= 479) return "mobile-portrait";
    if (width <= 767) return "mobile-landscape";
    if (width <= 991) return "tablet";
    return "desktop";
  }
  
  function updateMenuPositioning() {
    const deviceType = detectDeviceType();
    const headerHeight = header.offsetHeight;
    
    switch (deviceType) {
      case "mobile-portrait":
        mainNav.style.top = `${headerHeight}px`;
        mainNav.style.height = `calc(100vh - ${headerHeight}px)`;
        mainNav.style.width = "80%";
        overlay.style.top = `${headerHeight}px`;
        overlay.style.height = `calc(100% - ${headerHeight}px)`;
        break;
      case "mobile-landscape":
        mainNav.style.top = `${headerHeight}px`;
        mainNav.style.height = `calc(100vh - ${headerHeight}px)`;
        mainNav.style.width = "50%";
        overlay.style.top = `${headerHeight}px`;
        overlay.style.height = `calc(100% - ${headerHeight}px)`;
        break;
      case "tablet":
        mainNav.style.top = "0";
        mainNav.style.height = "100vh";
        mainNav.style.width = "300px";
        overlay.style.top = "0";
        overlay.style.height = "100%";
        break;
      default:
        mainNav.style = "";
    }
    
    // Move language selector for mobile views
    handleMobileLangSelector();
  }
  
  function handleMobileLangSelector() {
    if (window.innerWidth <= 767 && !document.querySelector(".mobile-lang-selector")) {
      const originalLangSelector = document.querySelector(".language-selector");
      if (originalLangSelector) {
        const clonedLangSelector = originalLangSelector.cloneNode(true);
        clonedLangSelector.classList.add("mobile-lang-selector");
        const headerRight = document.querySelector(".header-right");
        if (headerRight) {
          const mobileMenuToggleElement = document.getElementById("mobile-menu-toggle");
          if (mobileMenuToggleElement) {
            headerRight.insertBefore(clonedLangSelector, mobileMenuToggleElement);
            
            clonedLangSelector.querySelectorAll(".dropdown-content a").forEach(link => {
              link.addEventListener("click", function(e) {
                if (this.classList.contains("active")) {
                  e.preventDefault();
                }
              });
            });
          }
        }
      }
    }
  }
  
  function toggleMenu(e) {
    e.preventDefault();
    mobileMenuToggle.classList.toggle("active");
    body.classList.toggle("menu-active");
    header.classList.toggle("menu-open");
    overlay.classList.toggle("active");
    mainNav.classList.toggle("active");
  }
  
  function closeMenu() {
    mobileMenuToggle.classList.remove("active");
    body.classList.remove("menu-active");
    header.classList.remove("menu-open");
    overlay.classList.remove("active");
    mainNav.classList.remove("active");
  }
  
  // Initialize menu and add event listeners
  updateMenuPositioning();
  mobileMenuToggle.addEventListener("click", toggleMenu);
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  
  // Handle resizes and orientation changes with debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateMenuPositioning, 250);
  });
  
  window.addEventListener("orientationchange", () => setTimeout(updateMenuPositioning, 100));
  
  // Handle iOS height issues
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const fixIOSHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      
      if (mainNav.classList.contains("active")) {
        const deviceType = detectDeviceType();
        if (deviceType === "tablet") {
          mainNav.style.height = "calc(var(--vh, 1vh) * 100)";
        } else {
          mainNav.style.height = `calc(var(--vh, 1vh) * 100 - ${header.offsetHeight}px)`;
        }
      }
    };
    
    fixIOSHeight();
    window.addEventListener("resize", fixIOSHeight);
    window.addEventListener("orientationchange", () => setTimeout(fixIOSHeight, 100));
  }
}