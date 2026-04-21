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
            '.extracurriculars',
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
        return function () {
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


    // ===== CHAT UI MANAGEMENT =====
    const renderer = new marked.Renderer();
    renderer.link = function (linkData, title, text) {
        let finalHref, finalTitle, finalText;
        if (typeof linkData === 'object' && linkData !== null) {
            finalHref = linkData.href;
            finalTitle = linkData.title;
            finalText = linkData.text;
        } else {
            finalHref = linkData;
            finalTitle = title;
            finalText = text;
        }
        return `<a href="${finalHref}" title="${finalTitle || ''}" target="_blank" rel="noopener noreferrer">${finalText}</a>`;
    };

    marked.setOptions({
        renderer: renderer,
        breaks: true,
        gfm: true
    });

    const loadingPhrases = [
        "Thinking",
        "Analyzing",
        "Processing",
        "Computing",
        "Reasoning",
        "Synthesizing",
        "Generating",
        "Inferring",
        "Parsing",
        "Indexing",
        "Querying",
        "Optimizing"
    ];

    const STORAGE_KEY = 'sasidhar_portfolio_chat';
    let isChatBusy = false;

    // --- State Management ---
    function getHistory() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveMessage(role, text, origin) {
        const history = getHistory();
        history.push({ role, text, origin });
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    function getSessionID() {
        const SESSION_KEY = 'chat_session_id';
        let sessionID = sessionStorage.getItem(SESSION_KEY);
        if (!sessionID) {
            // Generate a simple alphanumeric ID
            sessionID = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem(SESSION_KEY, sessionID);
        }
        return sessionID;
    }

    // Initialize session ID on load
    getSessionID();

    // --- Elements - Mini Widget ---
    const chatWidget = document.getElementById("chat-widget");
    const chatToggle = document.getElementById("chat-toggle");
    const chatClose = document.getElementById("chat-close");
    const chatExpand = document.getElementById("chat-expand");
    const chatInput = document.getElementById("chat-input");
    const chatSend = document.getElementById("chat-send");
    const chatMessages = document.getElementById("chat-messages");

    // Elements - Full Modal
    const fullChatModal = document.getElementById("full-chat-modal");
    const fullChatClose = document.getElementById("full-chat-close");
    const fullChatMinimize = document.getElementById("full-chat-minimize");
    const fullChatInput = document.getElementById("full-chat-input");
    const fullChatSend = document.getElementById("full-chat-send");
    const fullChatMessages = document.getElementById("full-chat-messages");

    // initially hidden
    chatWidget?.classList.add("hidden");

    // Global: Open all external links in new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Toggle Chat Controls (Lock UI while busy)
    function toggleChatControls(enabled) {
        const elements = [
            chatInput, chatSend, chatExpand, chatClose,
            fullChatInput, fullChatSend, fullChatMinimize, fullChatClose
        ];
        elements.forEach(el => {
            if (el) {
                el.disabled = !enabled;
                el.style.opacity = enabled ? "1" : "0.5";
                el.style.pointerEvents = enabled ? "all" : "none";
            }
        });
    }

    // Functions
    function formatText(text) {
        if (!text) return "";
        let formatted = text.replace(/\\n/g, "\n").replace(/\\t/g, "    ");
        return formatted.replace(/\d+\.\s\*\*(.*?)\*\*/g, "- **$1**");
    }

    // Pure UI: Add a message bubble to a specific container
    function addMessage(text, type, container, isNew = true) {
        const div = document.createElement("div");
        div.className = `chat-msg ${type}`;

        if (!isNew) {
            // Restore historical content instantly
            const contentDiv = document.createElement("div");
            contentDiv.className = "chat-msg-content";
            contentDiv.innerHTML = marked.parse(formatText(text));
            div.appendChild(contentDiv);
        } else {
            div.textContent = text;
        }

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
    }

    // Master Display Logic: Appends to correct containers based on origin
    async function displayMessage(role, text, origin, isNew = true) {
        const containers = [];
        // Full Modal always gets everything
        if (fullChatMessages) containers.push(fullChatMessages);
        // Mini Widget only gets its own
        if (origin === 'mini' && chatMessages) containers.push(chatMessages);

        if (!isNew) {
            // Bulk render history
            containers.forEach(c => addMessage(text, role, c, false));
        } else {
            // Handle new messages (with safe typewriter)
            const bubbles = containers.map(c => addMessage("", role, c, true));
            if (role === 'bot') {
                const htmlResponse = marked.parse(formatText(text));
                // Run typewriter in parallel across all relevant containers
                await Promise.all(bubbles.map(b => safeTypewriter(htmlResponse, b)));
            } else {
                // User messages are instant
                bubbles.forEach(b => b.textContent = text);
            }
        }
    }

    function renderHistory() {
        if (chatMessages) chatMessages.innerHTML = "";
        if (fullChatMessages) fullChatMessages.innerHTML = "";

        const history = getHistory();
        history.forEach(msg => {
            // displayMessage handles the filtering logic
            displayMessage(msg.role, msg.text, msg.origin, false);
        });
    }



    // Advanced Typewriter that handles HTML tags correctly
    async function safeTypewriter(html, container) {
        // Clear initial text (e.g., placeholder in container)
        container.textContent = "";

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const botMsgContent = document.createElement("div");
        botMsgContent.className = "chat-msg-content";
        container.appendChild(botMsgContent);

        // Dynamic timing: ~12ms per char, capped between 1.5s and 6s for optimal UX
        const textContent = tempDiv.textContent || "";
        const totalChars = textContent.length || 1;
        const targetDuration = Math.min(10000, Math.max(1500, totalChars * 12));
        const tickDelay = 15; // Fast 15ms interval for letters
        const totalTicks = targetDuration / tickDelay;
        const charsPerTick = Math.ceil(totalChars / totalTicks);

        async function processNode(node, target) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                let i = 0;
                while (i < text.length) {
                    // Smart chunking: ensure we don't break a word mid-tick
                    let end = i + charsPerTick;
                    
                    // If we're ending in the middle of a word, extend to the next space
                    if (end < text.length && !/\s/.test(text[end])) {
                        const nextSpace = text.indexOf(' ', end);
                        if (nextSpace !== -1) {
                            end = nextSpace;
                        } else {
                            end = text.length; // No more spaces, take the rest
                        }
                    }

                    const chunk = text.slice(i, end);
                    const span = document.createElement("span");
                    span.className = "word-reveal";
                    span.textContent = chunk;
                    target.appendChild(span);
                    i = end;

                    const scrollContainer = container.closest('#chat-messages') || container.closest('#full-chat-messages');
                    if (scrollContainer) {
                        const threshold = 50; // Increased for smooth scroll tolerance
                        const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + threshold;
                        if (isAtBottom) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight;
                        }
                    }

                    await new Promise(resolve => setTimeout(resolve, tickDelay));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = document.createElement(node.tagName);
                Array.from(node.attributes).forEach(attr => element.setAttribute(attr.name, attr.value));

                // Append element to current target
                target.appendChild(element);

                // Recursively process children into the NEW element
                for (const child of Array.from(node.childNodes)) {
                    await processNode(child, element);
                }
            }
        }

        const nodes = Array.from(tempDiv.childNodes);
        for (const node of nodes) {
            await processNode(node, botMsgContent);
        }
    }

    function startLoading(container) {
        const phrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
        const botMsg = addMessage(phrase, "bot", container);
        const dotSpan = document.createElement("span");
        dotSpan.className = "loading-dots";
        botMsg.appendChild(dotSpan);

        let dotCount = 0;
        const interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dotSpan.textContent = ".".repeat(dotCount);
        }, 400);

        return {
            stop: () => {
                clearInterval(interval);
                botMsg.remove();
            }
        };
    }

    async function sendMessage(isMini) {
        if (isChatBusy) return;

        const input = isMini ? chatInput : fullChatInput;
        const origin = isMini ? 'mini' : 'full';
        const query = input.value.trim();

        if (!query) return;

        isChatBusy = true;
        toggleChatControls(false);

        // 1. Save and Display User Message
        saveMessage('user', query, origin);
        await displayMessage('user', query, origin, true);

        input.value = "";
        input.blur();

        // Start premium loading animation (in primary container)
        const activeContainer = isMini ? chatMessages : fullChatMessages;
        const loader = startLoading(activeContainer);

        try {
            const response = await fetch("https://sasidhar-portfolio-ai-vercel.vercel.app/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query, 
                    is_mini_widget: isMini,
                    session_id: getSessionID()
                })
            });

            if (!response.ok) throw new Error("API Connection Failed");

            const data = await response.json();

            // Stop loader
            loader.stop();

            // 2. Save and Display AI Response
            saveMessage('bot', data.response, origin);
            await displayMessage('bot', data.response, origin, true);

        } catch (error) {
            console.error("Chat Error:", error);
            if (typeof loader !== 'undefined') loader.stop();
            const errorMsg = error.message === "API Connection Failed"
                ? "I'm currently unable to connect to my AI server. Please try again later."
                : `UI Error: ${error.message}. Please refresh.`;
            addMessage(errorMsg, "bot", activeContainer);
        } finally {
            isChatBusy = false;
            toggleChatControls(true);
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
            if (fullChatMessages) fullChatMessages.scrollTop = fullChatMessages.scrollHeight;
        }
    }

    // Initialization
    renderHistory();

    // Event Listeners - Mini Widget
    chatSend?.addEventListener("click", () => sendMessage(true));
    chatInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage(true);
    });

    chatToggle?.addEventListener("click", () => {
        chatWidget.classList.remove("hidden");
        chatToggle.classList.add("hidden");
    });

    chatClose?.addEventListener("click", () => {
        chatWidget.classList.add("hidden");
        chatToggle.classList.remove("hidden");
    });

    chatExpand?.addEventListener("click", () => {
        if (isChatBusy) return;
        chatWidget.classList.add("hidden");
        fullChatModal.classList.remove("modal-hidden");
        document.body.classList.add("modal-open");
        // Ensure scroll positions are correct after switching
        if (fullChatMessages) fullChatMessages.scrollTop = fullChatMessages.scrollHeight;
    });

    // Event Listeners - Full Modal
    fullChatSend?.addEventListener("click", () => sendMessage(false));
    fullChatInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage(false);
    });

    fullChatMinimize?.addEventListener("click", () => {
        if (isChatBusy) return;
        fullChatModal.classList.add("modal-hidden");
        chatWidget.classList.remove("hidden");
        document.body.classList.remove("modal-open");
        // Ensure scroll positions are correct after switching
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    fullChatClose?.addEventListener("click", () => {
        fullChatModal.classList.add("modal-hidden");
        chatToggle.classList.remove("hidden");
        document.body.classList.remove("modal-open");
    });

});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Log: JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Log: Unhandled Promise Rejection:', event.reason);
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


