// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  item.querySelector(".faq-question").addEventListener("click", () => {
    // Close other open items
    faqItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("active")) {
        otherItem.classList.remove("active");
      }
    });
    item.classList.toggle("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// Testimonials slider with improved transitions
const testimonials = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");
const prevButton = document.querySelector(".prev-testimonial");
const nextButton = document.querySelector(".next-testimonial");
let currentTestimonial = 0;
let isAnimating = false;

// Show the first testimonial
function showTestimonial(index) {
  if (isAnimating) return;
  isAnimating = true;

  // Start fade out animation
  testimonials[currentTestimonial].classList.add("fade-out");

  setTimeout(() => {
    // Hide all testimonials
    testimonials.forEach((testimonial) => {
      testimonial.style.display = "none";
      testimonial.classList.remove("fade-out");
      testimonial.classList.remove("fade-in");
    });

    // Remove active class from all dots
    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show the selected testimonial
    testimonials[index].style.display = "block";

    // Trigger reflow
    void testimonials[index].offsetWidth;

    // Add fade in animation
    testimonials[index].classList.add("fade-in");

    // Add active class to the current dot
    dots[index].classList.add("active");

    // Update current testimonial index
    currentTestimonial = index;
    isAnimating = false;
  }, 300);
}

// Initialize the first testimonial
testimonials[0].classList.add("fade-in");

// Previous testimonial button
prevButton.addEventListener("click", () => {
  let index = currentTestimonial - 1;
  if (index < 0) index = testimonials.length - 1;
  showTestimonial(index);
});

// Next testimonial button
nextButton.addEventListener("click", () => {
  let index = currentTestimonial + 1;
  if (index >= testimonials.length) index = 0;
  showTestimonial(index);
});

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    if (index !== currentTestimonial) {
      showTestimonial(index);
    }
  });
});

// Auto-rotate testimonials every 8 seconds
let testimonialInterval = setInterval(() => {
  let index = currentTestimonial + 1;
  if (index >= testimonials.length) index = 0;
  showTestimonial(index);
}, 8000);

// Stop rotation when interacting with testimonial controls
const testimonialControls = document.querySelector(".testimonial-controls");
testimonialControls.addEventListener("mouseenter", () => {
  clearInterval(testimonialInterval);
});
testimonialControls.addEventListener("mouseleave", () => {
  testimonialInterval = setInterval(() => {
    let index = currentTestimonial + 1;
    if (index >= testimonials.length) index = 0;
    showTestimonial(index);
  }, 8000);
});

// Stats Counter Animation
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"));
  const duration = 2000; // 2 seconds
  const step = target / (duration / 30); // Update every 30ms
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(current);
  }, 30);
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");

      // If it's a stats item, animate the counter
      const statNumbers = entry.target.querySelectorAll(".stat-number");
      if (statNumbers.length) {
        statNumbers.forEach((el) => animateCounter(el));
      }

      // Unobserve after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

// Back to top button
const backToTopButton = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("active");
  } else {
    backToTopButton.classList.remove("active");
  }
});

backToTopButton.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add active class to nav based on scroll position
function updateNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      document.querySelectorAll("nav ul li a").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateNavHighlight);

// Initial call for nav highlight
updateNavHighlight();

// Prevent reload on active language click
document.addEventListener("DOMContentLoaded", function () {
  // Get all language links in the dropdown
  const langLinks = document.querySelectorAll(".dropdown-content a");

  langLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If this is the active language link (with active class)
      if (this.classList.contains("active")) {
        e.preventDefault(); // Prevent the default navigation
      }
    });
  });
});
// Unified mobile menu handling for all devices (mobile portrait, landscape, and tablets)
document.addEventListener("DOMContentLoaded", function () {
  // Get all the necessary elements
  const mobileMenuToggle = document.querySelector(".mobile-menu");
  const mainNav = document.getElementById("main-nav");
  const body = document.body;
  const header = document.querySelector("header");

  // Check if elements exist to prevent errors
  if (!mobileMenuToggle || !mainNav || !header) return;

  // Create overlay if it doesn't exist yet
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);

    // Close menu when clicking on overlay
    overlay.addEventListener("click", closeMenu);
  }

  // Function to detect device type by screen width
  function detectDeviceType() {
    const width = window.innerWidth;
    if (width <= 479) return "mobile-portrait";
    if (width >= 480 && width <= 767) return "mobile-landscape";
    if (width >= 768 && width <= 991) return "tablet";
    return "desktop";
  }

  // Function to position menu and overlay based on device type
  function updateMenuPositioning() {
    const deviceType = detectDeviceType();
    const headerHeight = header.offsetHeight;

    // Position menu correctly for each device type
    switch (deviceType) {
      case "mobile-portrait":
        mainNav.style.top = headerHeight + "px";
        mainNav.style.height = `calc(100vh - ${headerHeight}px)`;
        mainNav.style.width = "80%";

        // Position overlay below header for mobile portrait
        overlay.style.top = headerHeight + "px";
        overlay.style.height = `calc(100% - ${headerHeight}px)`;
        break;

      case "mobile-landscape":
        mainNav.style.top = headerHeight + "px";
        mainNav.style.height = `calc(100vh - ${headerHeight}px)`;
        mainNav.style.width = "50%";

        // Position overlay below header for mobile landscape
        overlay.style.top = headerHeight + "px";
        overlay.style.height = `calc(100% - ${headerHeight}px)`;
        break;

      case "tablet":
        // For tablets, menu covers full height including header
        mainNav.style.top = "0";
        mainNav.style.height = "100vh";
        mainNav.style.width = "300px";

        // Full screen overlay for tablets
        overlay.style.top = "0";
        overlay.style.height = "100%";
        break;

      default:
        // Desktop - reset any mobile styles
        mainNav.style = "";
    }
  }

  // Toggle menu function
  function toggleMenu(e) {
    e.preventDefault();

    // Toggle active class on menu button
    mobileMenuToggle.classList.toggle("active");

    // Toggle menu-active class on body
    body.classList.toggle("menu-active");

    // Toggle menu-open class on header
    header.classList.toggle("menu-open");

    // Show/hide overlay
    overlay.classList.toggle("active");

    // Add active class to nav
    mainNav.classList.toggle("active");
  }

  // Close menu function
  function closeMenu() {
    mobileMenuToggle.classList.remove("active");
    body.classList.remove("menu-active");
    header.classList.remove("menu-open");
    overlay.classList.remove("active");
    mainNav.classList.remove("active");
  }

  // Initialize menu positioning
  updateMenuPositioning();

  // Add event listeners
  mobileMenuToggle.addEventListener("click", toggleMenu);

  // Close menu when clicking on menu items
  const menuLinks = mainNav.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Update positioning on resize and orientation change
  window.addEventListener("resize", updateMenuPositioning);
  window.addEventListener("orientationchange", () => {
    setTimeout(updateMenuPositioning, 100);
  });

  // Special handling for iOS height issues
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const fixIOSHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // Update menu height if it's open
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
    window.addEventListener("orientationchange", () => {
      setTimeout(fixIOSHeight, 100);
    });
  }
});
// Add this at the end of your script.js file
// Move language selector out of nav for both mobile portrait and landscape
document.addEventListener("DOMContentLoaded", function () {
  // Execute for both portrait and landscape mobile views
  if (window.innerWidth <= 767) {
    // Check if mobile selector already exists
    if (!document.querySelector(".mobile-lang-selector")) {
      // Clone the language selector
      const originalLangSelector = document.querySelector(".language-selector");
      if (originalLangSelector) {
        const clonedLangSelector = originalLangSelector.cloneNode(true);
        clonedLangSelector.classList.add("mobile-lang-selector");

        // Find the header-right element
        const headerRight = document.querySelector(".header-right");

        // Insert the cloned language selector before the mobile menu button
        if (headerRight) {
          headerRight.insertBefore(
            clonedLangSelector,
            document.getElementById("mobile-menu-toggle")
          );

          // Add event listeners to the cloned dropdown
          const langLinks = clonedLangSelector.querySelectorAll(
            ".dropdown-content a"
          );
          langLinks.forEach((link) => {
            link.addEventListener("click", function (e) {
              if (this.classList.contains("active")) {
                e.preventDefault();
              }
            });
          });
        }
      }
    }
  }
});
