/* ============================================
   RecruGI Pvt Ltd — Main JavaScript
   All interactive features and animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- INITIALIZE LUCIDE ICONS ---------- */
    lucide.createIcons();

    /* ===========================================
       1. LOADING SCREEN
       =========================================== */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero animations after loader hides
            document.querySelectorAll('.hero .reveal-left, .hero .reveal-right').forEach(el => {
                el.classList.add('revealed');
            });
        }, 1600);
    });

    // Fallback: hide loader after 3s even if load event doesn't fire
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);

    /* ===========================================
       2. STICKY NAVBAR
       =========================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    function handleScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;

        // Navbar background on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress bar
        scrollProgress.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ===========================================
       3. MOBILE MENU
       =========================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });

    /* ===========================================
       4. DARK MODE TOGGLE
       =========================================== */
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved preference
    const savedTheme = localStorage.getItem('recrugi-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('recrugi-theme', body.classList.contains('dark') ? 'dark' : 'light');
        // Re-render icons after class change
        lucide.createIcons();
    });

    /* ===========================================
       5. ACTIVE NAV LINK ON SCROLL
       =========================================== */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ===========================================
       6. SMOOTH SCROLLING (enhanced)
       =========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===========================================
       7. TYPING ANIMATION
       =========================================== */
    const typingEl = document.getElementById('typingText');
    const typingWords = [
        'AI-powered hiring',
        'talent intelligence',
        'career guidance',
        'recruitment consulting',
        'personalized hiring'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentWord = typingWords[wordIndex];

        if (isDeleting) {
            typingEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typingWords.length;
            typingSpeed = 300; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(typeEffect, 2000);

    /* ===========================================
       8. SCROLL REVEAL ANIMATIONS
       =========================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===========================================
       9. ANIMATED COUNTERS
       =========================================== */
    const counters = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easeOut * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // Observe counters section
    const countersSection = document.querySelector('.counters-grid');
    if (countersSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(countersSection);
    }

    /* ===========================================
       10. TIMELINE PROGRESS
       =========================================== */
    const timelineSection = document.querySelector('.timeline');
    const timelineProgress = document.getElementById('timelineProgress');

    if (timelineSection && timelineProgress) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineProgress.style.width = '100%';
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        timelineObserver.observe(timelineSection);
    }

    /* ===========================================
       11. TESTIMONIALS SLIDER
       =========================================== */
    const testimonialTrack = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let slideInterval;
    const totalSlides = testimonialCards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Auto slide
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch/Swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });

    /* ===========================================
       12. FAQ ACCORDION
       =========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ===========================================
       13. FORM VALIDATION
       =========================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        field.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + 'Error');
        field.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[\+]?[0-9\s\-]{10,15}$/.test(phone);
    }

    // Real-time validation
    ['name', 'email', 'phone', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearError(id));
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Name
        const name = document.getElementById('name').value.trim();
        if (!name) {
            showError('name', 'Please enter your name.');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters.');
            isValid = false;
        }

        // Email
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showError('email', 'Please enter your email.');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        }

        // Phone
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            showError('phone', 'Please enter your phone number.');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phone', 'Please enter a valid phone number.');
            isValid = false;
        }

        // Message
        const message = document.getElementById('message').value.trim();
        if (!message) {
            showError('message', 'Please enter a message.');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters.');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';

            setTimeout(() => {
                contactForm.reset();
                formSuccess.style.display = 'flex';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i data-lucide="send"></i>';
                lucide.createIcons();

                // Hide success message after 5s
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }, 1500);
        }
    });

    /* ===========================================
       14. BACK TO TOP BUTTON
       =========================================== */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===========================================
       15. BUTTON RIPPLE EFFECT
       =========================================== */
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ===========================================
       16. PARALLAX HERO BACKGROUND
       =========================================== */
    const heroOrbs = document.querySelectorAll('.hero-orb');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroOrbs.forEach((orb, i) => {
                const speed = (i + 1) * 0.15;
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }, { passive: true });

    /* ===========================================
       17. SMOOTH NAV LINK TRANSITION FIX
       =========================================== */
    // Ensure smooth scroll offset accounts for fixed navbar
    document.documentElement.style.scrollPaddingTop = '80px';

});