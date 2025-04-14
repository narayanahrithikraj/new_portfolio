// Create floating particles for background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = opacity;
        
        // Add twinkle animation
        if (Math.random() > 0.7) {
            particle.classList.add('twinkle');
            particle.style.animationDuration = `${Math.random() * 5 + 2}s`;
        }
        
        particlesContainer.appendChild(particle);
    }
}

// Seamless infinite scrolling for skills section
function setupSkillsAnimation() {
    const skillsScroller = document.querySelector('.skills-scroller');
    if (!skillsScroller) return;

    // Clone all skills for seamless looping
    const skills = Array.from(skillsScroller.children);
    const clones = skills.map(skill => {
        const clone = skill.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        return clone;
    });
    clones.forEach(clone => skillsScroller.appendChild(clone));

    // Create animation track container
    const skillsTrack = document.createElement('div');
    skillsTrack.classList.add('skills-track');
    skillsScroller.parentNode.insertBefore(skillsTrack, skillsScroller);
    skillsTrack.appendChild(skillsScroller);

    // Calculate animation parameters
    const calculateAnimation = () => {
        const firstSkill = skills[0];
        const style = window.getComputedStyle(firstSkill);
        const skillWidth = firstSkill.offsetWidth + 
                          parseInt(style.marginLeft) + 
                          parseInt(style.marginRight);
        const totalWidth = skillWidth * skills.length;
        const duration = (totalWidth / 180) * 1000; // pixels per second
        
        return { totalWidth, duration };
    };

    const { totalWidth, duration } = calculateAnimation();

    // Create animation
    const animation = skillsScroller.animate(
        [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${totalWidth}px)` }
        ],
        {
            duration,
            iterations: Infinity
        }
    );

    // Pause animation on hover
    const pauseAnimation = () => {
        animation.pause();
        skillsTrack.style.cursor = 'grab';
    };

    const resumeAnimation = () => {
        animation.play();
        skillsTrack.style.cursor = '';
    };

    skillsTrack.addEventListener('mouseenter', pauseAnimation);
    skillsTrack.addEventListener('mouseleave', resumeAnimation);

    // Touch events for mobile
    skillsTrack.addEventListener('touchstart', pauseAnimation, { passive: true });
    skillsTrack.addEventListener('touchend', resumeAnimation, { passive: true });

    // Handle window resize
    const handleResize = () => {
        const { totalWidth: newTotalWidth, duration: newDuration } = calculateAnimation();
        animation.effect.updateTiming({ duration: newDuration });
        animation.effect.setKeyframes([
            { transform: 'translateX(0)' },
            { transform: `translateX(-${newTotalWidth}px)` }
        ]);
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
    });

    // Cleanup function for later use
    return () => {
        skillsTrack.removeEventListener('mouseenter', pauseAnimation);
        skillsTrack.removeEventListener('mouseleave', resumeAnimation);
        skillsTrack.removeEventListener('touchstart', pauseAnimation);
        skillsTrack.removeEventListener('touchend', resumeAnimation);
        window.removeEventListener('resize', handleResize);
        animation.cancel();
    };
}

// Navbar scroll effect with faster animations
function handleScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Animate sections on scroll with faster trigger
    const sections = document.querySelectorAll('.section');
    const scrollTrigger = window.innerHeight / 1.5; // Changed from 1.3 to 1.5 for earlier trigger
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition > sectionTop - scrollTrigger && scrollPosition < sectionTop + sectionHeight) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Mobile menu toggle with enhanced animations
function setupMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!burger || !navLinks) return;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);
    
    // Toggle menu function
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    };
    
    // Close menu function
    const closeMenu = () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    };
    
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                closeMenu();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                setTimeout(() => {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }, 200); // Reduced from 300ms to 200ms for faster response
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            e.target !== burger) {
            closeMenu();
        }
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.closest('.nav-links')) return;
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                window.location.hash = targetId;
            }
        });
    });
}

// Current year in footer
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Add parallax effect to hero section
function setupParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupMobileMenu();
    setupSmoothScrolling();
    updateYear();
    const cleanupSkillsAnimation = setupSkillsAnimation();
    setupParallax();
    
    // Add scroll event listener with debounce
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            handleScroll();
        }, 50); // Reduced from 66ms to 50ms for faster response
    }, false);
    
    // Trigger initial scroll check
    handleScroll();
    
    // Add faster animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
            }
            50% {
                transform: translateY(-100px) translateX(20px);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
        }
        
        @keyframes twinkle {
            0% { opacity: 0.1; }
            50% { opacity: 1; }
            100% { opacity: 0.1; }
        }
        
        .particle {
            position: absolute;
            background-color: var(--space-star);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle linear infinite;
        }
        
        .twinkle {
            animation: twinkle ease-in-out infinite, floatParticle linear infinite;
        }
        
        .section {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.3s ease, transform 0.3s ease; /* Changed from 0.6s to 0.3s */
        }
        
        .no-scroll {
            overflow: hidden;
        }
        
        .skills-track {
            overflow: hidden;
            width: 100%;
        }
        
        .skills-scroller {
            display: flex;
            will-change: transform;
        }
        
        /* Mobile menu transitions */
        .nav-links {
            transition: transform 0.4s cubic-bezier(0.77, 0.2, 0.05, 1); /* Slightly faster */
        }
        
        .menu-overlay {
            transition: opacity 0.2s ease; /* Faster overlay fade */
        }
        
        .nav-links li {
            transition: opacity 0.3s ease, transform 0.3s ease; /* Faster menu items */
        }
    `;
    document.head.appendChild(style);
});

// Handle page load with hash in URL
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }, 50); // Reduced from 100ms to 50ms
        }
    }
});
