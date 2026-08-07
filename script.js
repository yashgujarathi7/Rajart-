document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize AOS Animations
    AOS.init({
        duration: 850,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
    });

    // 2. Unified Header Scroll Logic & Active States
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section, header, main');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 3. Hamburger Menu Logic for phone.css
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinksContainer.classList.toggle('nav-active');
        
        if (navLinksContainer.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinksContainer.classList.remove('nav-active');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 4. About Section: Expandable Journey Logic
    const toggleBtn = document.getElementById('toggleJourneyBtn');
    const journeyContent = document.getElementById('journeyContent');

    if (toggleBtn && journeyContent) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = journeyContent.classList.contains('expanded');
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                journeyContent.classList.remove('expanded');
                toggleBtn.classList.remove('expanded');
                toggleBtn.innerHTML = 'Discover More <i class="fa-solid fa-chevron-down"></i>';
            } else {
                journeyContent.classList.add('expanded');
                toggleBtn.classList.add('expanded');
                toggleBtn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-up"></i>';
                
                setTimeout(() => {
                    const yOffset = -120;
                    const y = journeyContent.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }, 300);
            }
        });
    }

    // 5. Stats Rolling Counters Logic
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16); 
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // 6. Independent FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            question.setAttribute('aria-expanded', !isActive);

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // 7. Responsive Customer Reviews Slider
    const track = document.getElementById('testimonialTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slideInterval;
        let cardsPerView = 3;

        const updateCardsPerView = () => {
            if (window.innerWidth <= 768) cardsPerView = 1;
            else if (window.innerWidth <= 992) cardsPerView = 2;
            else cardsPerView = 3;
            createDots();
            updateSlider();
        };

        const createDots = () => {
            dotsContainer.innerHTML = '';
            const maxIndex = Math.max(0, slides.length - cardsPerView);
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            const maxIndex = Math.max(0, slides.length - cardsPerView);
            if (currentIndex > maxIndex) currentIndex = 0; 
            
            const movePercentage = (100 / cardsPerView) * currentIndex;
            track.style.transform = `translateX(-${movePercentage}%)`;
            
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const nextSlide = () => {
            const maxIndex = Math.max(0, slides.length - cardsPerView);
            currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
            updateSlider();
        };

        // Autoplay Logic
        const startInterval = () => { slideInterval = setInterval(nextSlide, 4000); };
        const resetInterval = () => { clearInterval(slideInterval); startInterval(); };

        // Pause on Hover
        const wrapper = document.querySelector('.testimonial-grid-wrapper');
        if(wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
            wrapper.addEventListener('mouseleave', startInterval);
        }

        // Init
        window.addEventListener('resize', updateCardsPerView);
        updateCardsPerView();
        startInterval();
    }

    // 8. Contact Form - Quote Engine Validation & Interactivity
    const custYes = document.getElementById('cust-yes');
    const custNo = document.getElementById('cust-no');
    const custDetails = document.getElementById('customization-details-group');
    const custTextArea = document.getElementById('cust-details');

    if (custYes && custNo && custDetails) {
        custYes.addEventListener('change', () => { 
            custDetails.style.display = 'block'; 
            custTextArea.setAttribute('required', 'true');
        });
        custNo.addEventListener('change', () => { 
            custDetails.style.display = 'none'; 
            custTextArea.removeAttribute('required');
        });
    }

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if(contactForm) {
        const validateField = (field) => {
            if (!field.checkValidity()) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                return false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
                return true;
            }
        };

        const formInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) validateField(input);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });

            if (isValid && submitBtn) {
                // Loading state Trigger
                const btnText = submitBtn.querySelector('.btn-text');
                const btnIcon = submitBtn.querySelector('i');
                const originalText = btnText.innerText;
                const originalIcon = btnIcon.className;

                btnText.innerText = 'Processing Quote...';
                btnIcon.className = 'fa-solid fa-circle-notch fa-spin';
                submitBtn.disabled = true;

                // Simulate processing API request
                setTimeout(() => {
                    btnText.innerText = 'Quote Requested!';
                    btnIcon.className = 'fa-solid fa-check';
                    submitBtn.classList.add('success-state');

                    // Reset form post-success
                    setTimeout(() => {
                        contactForm.reset();
                        formInputs.forEach(input => input.classList.remove('is-valid'));
                        if(custDetails) custDetails.style.display = 'none';
                        btnText.innerText = originalText;
                        btnIcon.className = originalIcon;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('success-state');
                    }, 3000);
                }, 1500);
            }
        });
    }
});