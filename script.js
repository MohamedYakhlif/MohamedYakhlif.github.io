// Mobile menu toggle
document
  .getElementById("mobile-menu-toggle")
  .addEventListener("click", function () {
    const navMenu = document.getElementById("nav-menu");

    // Add close button if it doesn't exist
    if (!document.querySelector(".mobile-menu-close")) {
      const closeBtn = document.createElement("button");
      closeBtn.className = "mobile-menu-close";
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.setAttribute("aria-label", "Close menu");
      navMenu.appendChild(closeBtn);

      // Add event listener to close button
      closeBtn.addEventListener("click", function () {
        navMenu.classList.remove("show");
        document.body.style.overflow = ""; // Re-enable scrolling
      });
    }

    // Add mobile CTA button if it doesn't exist
    if (!document.querySelector(".mobile-cta")) {
      const mobileCta = document.createElement("a");
      mobileCta.href = "#contact";
      mobileCta.className = "mobile-cta";
      mobileCta.textContent = "Book Appointment";
      navMenu.appendChild(mobileCta);

      // Add event listener to close menu when CTA is clicked
      mobileCta.addEventListener("click", function () {
        navMenu.classList.remove("show");
        document.body.style.overflow = ""; // Re-enable scrolling
      });
    }

    // Toggle menu
    navMenu.classList.toggle("show");

    // Toggle body scroll
    if (navMenu.classList.contains("show")) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    // Change icon based on menu state
    const icon = this.querySelector("i");
    if (navMenu.classList.contains("show")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

// Ensure all nav links close the mobile menu
document.querySelectorAll("nav ul li a").forEach((link) => {
  link.addEventListener("click", function () {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("show");
    document.body.style.overflow = ""; // Re-enable scrolling

    // Reset menu icon
    const menuIcon = document.querySelector(".mobile-menu i");
    if (menuIcon) {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  });
});

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const navMenu = document.getElementById("nav-menu");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

  if (
    navMenu.classList.contains("show") &&
    !navMenu.contains(event.target) &&
    !mobileMenuToggle.contains(event.target)
  ) {
    navMenu.classList.remove("show");
    document.body.style.overflow = "";

    // Reset menu icon
    const menuIcon = document.querySelector(".mobile-menu i");
    if (menuIcon) {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
    }
  }
});

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
    // Close mobile menu if open
    document.getElementById("nav-menu").classList.remove("show");
    const menuIcon = document.querySelector(".mobile-menu i");
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
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

// Add schema.org structured data for better SEO
const schemaScript = document.createElement("script");
schemaScript.type = "application/ld+json";
schemaScript.innerHTML = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "AL AMAL Medical Analysis Laboratory",
  image: "images/logo.png",
  url: "https://www.alamallab.ma",
  telephone: "+212628836501",
  address: {
    "@type": "PostalAddress",
    streetAddress: "175 Avenue des Forces Armées Royales",
    addressLocality: "Meknes",
    addressRegion: "Fes-Meknes",
    postalCode: "50000",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.8972135,
    longitude: -5.5387406,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "18:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/alamallab",
    "https://www.instagram.com/alamallab",
  ],
});
document.head.appendChild(schemaScript);

// Remove all previous mobile footer implementations
if (window.innerWidth <= 768) {
  // No accordion needed - ultra minimal footer
  // Keep only the first column visible which has the lab name and social icons
  const footerColumns = document.querySelectorAll(
    ".footer-column:not(:first-child)"
  );
  footerColumns.forEach((column) => {
    column.style.display = "none";
  });
}

// Also reset icon when mobile-menu-close is clicked
document.addEventListener("click", function (event) {
  if (event.target.closest(".mobile-menu-close")) {
    const menuIcon = document.querySelector(".mobile-menu i");
    menuIcon.className = "fas fa-bars";
  }
});

// Update working hours with minimalist display
document.addEventListener("DOMContentLoaded", function () {
  // Update Contact section hours
  const contactHoursElement = document.querySelector(
    ".contact-info li:nth-child(3) div"
  );
  if (contactHoursElement) {
    contactHoursElement.innerHTML = `
            <strong>Working Hours:</strong><br>
            Monday to Friday: 7:30 AM – 6:30 PM<br>
            Saturday & Sunday: 8:00 AM – 6:00 PM<br>
            <span class="highlight">Available 7 days a week</span>
        `;
  }

  // Update footer hours
  const footerHoursElement = document.querySelector(
    ".footer-column:nth-child(4) ul"
  );
  if (footerHoursElement) {
    footerHoursElement.innerHTML = `
            <li>Monday to Friday: 7:30 AM – 6:30 PM</li>
            <li>Saturday & Sunday: 8:00 AM – 6:00 PM</li>
            <li><strong>Available 7 days a week</strong></li>
        `;
  }

  // Update schema.org data
  const schemaScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  if (schemaScript) {
    const schemaData = JSON.parse(schemaScript.innerHTML);
    schemaData.openingHoursSpecification = [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:30",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "18:00",
      },
    ];
    schemaScript.innerHTML = JSON.stringify(schemaData);
  }
});
