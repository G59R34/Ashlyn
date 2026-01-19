// ============================================
// ASHLYN DIET COKE - CORPORATE EXCELLENCE
// Premium Corporate Website JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ANIMATED STATS COUNTER
    // ============================================

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    const target = parseInt(statElement.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            statElement.textContent = target + '+';
                            clearInterval(timer);
                        } else {
                            statElement.textContent = Math.floor(current) + '+';
                        }
                    }, 16);

                    observer.unobserve(statElement);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // ============================================
    // FADE IN ON SCROLL ANIMATIONS
    // ============================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.expertise-card, .service-item, .portfolio-item, .highlight-item');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ============================================
    // HERO TITLE ANIMATION
    // ============================================

    function animateHeroTitle() {
        const titleLines = document.querySelectorAll('.title-line');
        
        titleLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 1s ease, transform 1s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 300 + 500);
        });
    }

    // ============================================
    // FORM HANDLING
    // ============================================

    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple form validation
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderBottomColor = '#ff4444';
                } else {
                    input.style.borderBottomColor = 'var(--accent-gold)';
                }
            });

            if (isValid) {
                // In a real application, you would send this data to a server
                alert('Thank you for your inquiry! We will contact you soon.');
                contactForm.reset();
            }
        });
    }

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================

    function initParallax() {
        const heroImage = document.querySelector('.hero-image-wrapper');
        
        if (heroImage) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                
                if (hero && scrolled < hero.offsetHeight) {
                    const rate = scrolled * 0.5;
                    heroImage.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }

    // ============================================
    // SERVICE ITEMS INTERACTIVE EFFECT
    // ============================================

    function initServiceItems() {
        const serviceItems = document.querySelectorAll('.service-item');
        
        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
        });
    }

    // ============================================
    // PORTFOLIO ITEMS INTERACTIVE EFFECT
    // ============================================

    function initPortfolioItems() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.portfolio-overlay');
                overlay.style.transform = 'translateY(0)';
            });
        });
    }

    // ============================================
    // MOBILE MENU (if needed in future)
    // ============================================

    // Add mobile menu toggle if needed
    // Currently using responsive CSS only

    // ============================================
    // INITIALIZE ALL FUNCTIONS
    // ============================================

    document.addEventListener('DOMContentLoaded', () => {
        animateHeroTitle();
        animateStats();
        initScrollAnimations();
        initParallax();
        initServiceItems();
        initPortfolioItems();
            initHeroVideo();
    });

    // Re-run animations on page load to ensure visibility
    window.addEventListener('load', () => {
        // Force a reflow to ensure animations trigger
        setTimeout(() => {
            animateStats();
            initScrollAnimations();
        }, 100);
    });

    // ============================================
    // HERO IMAGE -> IN-FRAME VIDEO
    // ============================================
    function initHeroVideo(){
        const wrapper = document.querySelector('.hero-image-wrapper');
        if (!wrapper) return;
        const img = wrapper.querySelector('.hero-image');
        if (!img) return;

        let activeVideo = null;

        wrapper.addEventListener('click', (e) => {
            // prevent multiple activations
            if (wrapper.classList.contains('playing')) return;

            // create video element
            const video = document.createElement('video');
            video.className = 'hero-video';
            // try a common path first, then fallback to root
            video.src = 'videos/in.mp4';
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.autoplay = true;
            video.controls = true;
            // user clicked — allow sound
            video.muted = false;

            // append and show
            wrapper.appendChild(video);
            // small delay to allow element insertion before transition
            requestAnimationFrame(() => {
                wrapper.classList.add('playing');
                video.classList.add('show');
                // attempt to play; ignore promise rejection
                video.play().catch(() => {});
            });

            // fall back to root path if load fails
            video.addEventListener('error', () => {
                if (video.src.endsWith('videos/in.mp4')){
                    video.src = 'in.mp4';
                    video.load();
                    video.play().catch(()=>{});
                }
            });

            // click toggles play/pause
            video.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (video.paused) video.play(); else video.pause();
            });

            // cleanup after end
            const cleanup = () => {
                video.classList.remove('show');
                wrapper.classList.remove('playing');
                setTimeout(() => { if (video.parentNode) video.parentNode.removeChild(video); }, 500);
                activeVideo = null;
            };

            video.addEventListener('ended', cleanup);
            activeVideo = video;
        });
    }

})();
