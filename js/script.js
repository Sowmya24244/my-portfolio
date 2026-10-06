/* ==========================================================================
   SCRIPT.JS - Interactive JavaScript for Maradani Baby Sowmya Sri Portfolio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. AUTOMATIC FOOTER YEAR
       Dynamically updates the copyright year in the footer.
       ---------------------------------------------------------------------- */
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ----------------------------------------------------------------------
       2. RESPONSIVE MOBILE NAVIGATION TOGGLE
       Handles opening/closing the mobile drawer menu with full accessibility.
       ---------------------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        const closeMenu = () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close mobile drawer when clicking any navigation link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close mobile drawer when pressing Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });

        // Close mobile drawer when clicking outside header
        document.addEventListener('click', (event) => {
            const header = document.querySelector('.site-header');
            if (header && !header.contains(event.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. SCROLLSPY & ACTIVE NAVIGATION LINK HIGHLIGHTING
       Dynamically highlights active navigation links as user scrolls sections.
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightActiveNav = () => {
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(currentSection => {
            const sectionHeight = currentSection.offsetHeight;
            const sectionTop = currentSection.offsetTop;
            const sectionId = currentSection.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
    highlightActiveNav();

    /* ----------------------------------------------------------------------
       4. INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
       Adds smooth fade-in and slide-up animations to content as it enters viewport.
       ---------------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll(
            '.about-card, .skills-card, .project-card, .timeline-item, .experience-card, .cert-card, .achievement-card, .contact-info, .contact-form-wrapper, .hobby-btn, .craft-photo-card'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    }

    /* ----------------------------------------------------------------------
       5. CONTACT FORM INTERACTIVENESS & FEEDBACK
       Validates fields and triggers email client safely.
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                if (formFeedback) {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.textContent = 'Please fill out all required fields before submitting.';
                }
                return;
            }

            // Construct mailto URL
            const targetEmail = 'sowmyasri.maradani@gmail.com';
            const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            // Provide accurate feedback message
            if (formFeedback) {
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = `<strong>Opening your email client...</strong><br>If your email client does not open automatically, please send your message directly to <a href="${mailtoUrl}">${targetEmail}</a>.`;
            }

            // Launch mail client
            window.location.href = mailtoUrl;

            // Reset form fields
            contactForm.reset();
        });
    }

    /* ----------------------------------------------------------------------
       7. CRAFTING GALLERY LIGHTBOX MODAL
       Full-size view modal for handmade crafting photography.
       ---------------------------------------------------------------------- */
    const lightboxModal = document.getElementById('craftLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const craftItems = document.querySelectorAll('.craft-photo-card, .craft-gallery-item');

    let activeTriggerElement = null;

    const openLightbox = (item) => {
        if (!lightboxModal || !lightboxImg) return;

        activeTriggerElement = item;

        const src = item.getAttribute('data-src') || '';
        const title = item.getAttribute('data-title') || '';
        const caption = item.getAttribute('data-caption') || '';
        const altText = item.querySelector('img')?.getAttribute('alt') || 'Craft photograph';

        lightboxImg.src = src;
        lightboxImg.alt = altText;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCaption) lightboxCaption.textContent = caption;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        if (lightboxCloseBtn) {
            setTimeout(() => lightboxCloseBtn.focus(), 100);
        }
    };

    const closeLightbox = () => {
        if (!lightboxModal) return;

        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scroll

        if (lightboxImg) {
            lightboxImg.src = '';
            lightboxImg.alt = '';
        }

        if (activeTriggerElement) {
            activeTriggerElement.focus();
            activeTriggerElement = null;
        }
    };

    craftItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(item);
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(item);
            }
        });
    });

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

});

