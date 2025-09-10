// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateToggleIcon() {
        const icon = this.themeToggle.querySelector('i');
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupNavbarScrollEffect();
    }

    setupMobileNavigation() {
        this.mobileMenu.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.mobileMenu.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollSpy() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupNavbarScrollEffect() {
        // Navbar should always be visible, even when scrolling.
        this.navbar.style.transform = 'translateY(0)';
    }
}

// ===== ANIMATION MANAGER =====
class AnimationManager {
    constructor() {
        this.animatedElements = document.querySelectorAll('.animate-on-scroll');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupTypeWriter();
    }

    setupScrollAnimations() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Add animation classes to elements
        const elementsToAnimate = [
            '.hero-text',
            '.hero-image',
            '.about-content',
            '.stat',
            '.project-card',
            '.experience-item',
            '.skill-category',
            '.cert-card',
            '.contact-info',
            '.contact-form'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                el.classList.add('animate-on-scroll');
                el.style.animationDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        });
    }

    setupSkillBars() {
        const skillsSection = document.querySelector('#skills');
        let skillsAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    this.animateSkillBars();
                    skillsAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkillBars() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                bar.classList.add('animate');
            }, index * 200);
        });
    }

    setupTypeWriter() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const text = heroSubtitle.textContent;
            heroSubtitle.textContent = '';
            heroSubtitle.style.borderRight = '2px solid var(--primary-color)';
            
            let index = 0;
            const typeWriter = () => {
                if (index < text.length) {
                    heroSubtitle.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        heroSubtitle.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
}

// ===== CONTACT FORM MANAGER =====
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Send email using EmailJS
            await this.sendEmailViaEmailJS(formData);
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async sendEmailViaEmailJS(formData) {
        // EmailJS configuration
        const serviceId = 'service_0ykpmrv'; // Replace with your EmailJS service ID
        const templateId = 'template_4ykbkq9'; // Replace with your EmailJS template ID
        const publicKey = 'Hz-Scp_80pn7LvqaK'; // Replace with your EmailJS public key
        
        // Convert FormData to regular object
        const formObject = Object.fromEntries(formData);
        
        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                serviceId,
                templateId,
                {
                    from_name: formObject.name,
                    from_email: formObject.email,
                    subject: formObject.subject,
                    message: formObject.message,
                    to_email: '22kt1a0595@gmail.com' // Your email
                },
                publicKey
            );
            
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('EmailJS Error:', error);
            throw new Error('Failed to send email');
        }
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
        });
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    setupImageOptimization() {
        // Add loading attribute to images for better performance
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
        // this.setupSkipLinks();
    }

    setupKeyboardNavigation() {
        // Enable keyboard navigation for custom elements
        const customButtons = document.querySelectorAll('.btn, .nav-link, .social-link');
        
        customButtons.forEach(button => {
            if (!button.hasAttribute('tabindex')) {
                button.setAttribute('tabindex', '0');
            }
            
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Improve focus visibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupAriaLabels() {
        // Add aria-labels to elements that need them
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        }

        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.setAttribute('aria-label', 'Toggle mobile menu');
            mobileMenu.setAttribute('aria-expanded', 'false');
        }

        // Update mobile menu aria-expanded state
        mobileMenu?.addEventListener('click', () => {
            const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
            mobileMenu.setAttribute('aria-expanded', !isExpanded);
        });
    }

    setupSkipLinks() {
        // Add skip to main content link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '4px',
            zIndex: '1000'
        });
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new ContactFormManager();
    new PerformanceManager();
    new AccessibilityManager();
    
    // Add loading complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
        
        .loaded * {
            transition-duration: 0.3s;
        }
        
        .skip-link:focus {
            top: 6px !important;
        }
        
        /* Notification styles */
        .notification {
            animation: slideInRight 0.3s ease-out;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            margin-left: auto;
            padding: 0.25rem;
        }
        
        /* Custom scrollbar for better UX */
        * {
            scrollbar-width: thin;
            scrollbar-color: var(--border-color) var(--surface-color);
        }
        
        /* Loading state styles */
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        /* Enhanced hover effects */
        .project-card,
        .cert-card,
        .contact-method {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth navbar transition */
        .navbar {
            transition: transform 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// ===== EXPORT FOR POTENTIAL MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        AnimationManager,
        ContactFormManager,
        Utils,
        PerformanceManager,
        AccessibilityManager
    };
}
