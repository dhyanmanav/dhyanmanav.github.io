// Cyberpunk Portfolio JavaScript
class CyberpunkPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initMatrixRain();
        this.initParticleSystem();
        this.initTypewriter();
        this.initScrollAnimations();
        this.initNavigation();
        this.initSkillBars();
        this.initGlitchEffects();
        this.initTerminalEffects();
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
    }

    onPageLoad() {
        document.body.classList.add('loaded');
        this.animatePageLoad();
    }

    onScroll() {
        this.updateNavbar();
        this.parallaxEffects();
    }

    onResize() {
        this.resizeMatrix();
        this.resizeParticles();
    }

    // Matrix Rain Effect
    initMatrixRain() {
        this.matrixCanvas = document.getElementById('matrixRain');
        if (!this.matrixCanvas) return;

        this.matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.matrixColumns = Math.floor(window.innerWidth / 20);
        this.matrixDrops = [];

        for (let i = 0; i < this.matrixColumns; i++) {
            this.matrixDrops[i] = Math.random() * window.innerHeight;
        }

        this.createMatrixRain();
        this.startMatrixAnimation();
    }

    createMatrixRain() {
        this.matrixCanvas.innerHTML = '';
        
        for (let i = 0; i < 100; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            char.style.left = Math.random() * 100 + '%';
            char.style.animationDuration = (Math.random() * 3 + 2) + 's';
            char.style.animationDelay = Math.random() * 2 + 's';
            char.style.opacity = Math.random() * 0.7 + 0.3;
            this.matrixCanvas.appendChild(char);
        }
    }

    startMatrixAnimation() {
        setInterval(() => {
            const chars = document.querySelectorAll('.matrix-char');
            chars.forEach(char => {
                if (Math.random() < 0.1) {
                    char.textContent = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                }
            });
        }, 100);
    }

    resizeMatrix() {
        this.matrixColumns = Math.floor(window.innerWidth / 20);
        this.createMatrixRain();
    }

    // Particle System
    initParticleSystem() {
        this.particlesContainer = document.getElementById('particles');
        if (!this.particlesContainer) return;

        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        this.particlesContainer.innerHTML = '';
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            this.particlesContainer.appendChild(particle);
        }
    }

    animateParticles() {
        setInterval(() => {
            this.createParticles();
        }, 5000);
    }

    resizeParticles() {
        this.createParticles();
    }

    // Typewriter Effect
    initTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        const outputElement = document.getElementById('heroOutput');
        
        if (!typewriterElement || !outputElement) return;

        const commands = [
            'whoami',
            'cat profile.txt',
            'ls skills/',
            'python main.py'
        ];

        let commandIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeText = () => {
            const currentCommand = commands[commandIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentCommand.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentCommand.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentCommand.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        };

        // Start typewriter after page load
        setTimeout(() => {
            outputElement.style.opacity = '1';
            typeText();
        }, 1000);
    }

    // Scroll Animations
    initScrollAnimations() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Trigger specific animations based on section
                    if (entry.target.classList.contains('skills-section')) {
                        this.animateSkillBars();
                    }
                    
                    if (entry.target.classList.contains('projects-section')) {
                        this.animateProjectCards();
                    }
                }
            });
        }, this.observerOptions);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('loading');
            this.observer.observe(section);
        });

        // Observe individual elements
        document.querySelectorAll('.project-card, .education-card, .cert-card, .timeline-item').forEach(element => {
            element.classList.add('loading');
            this.observer.observe(element);
        });
    }

    // Navigation - Fixed smooth scrolling
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Smooth scrolling for nav links - FIXED
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const headerOffset = 100; // Account for fixed navbar
                        const elementPosition = targetSection.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Add active class immediately
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }

                // Close mobile menu after click
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
            });
        });

        // Active nav link highlighting
        this.updateActiveNavLink();
    }

    updateNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.section[id], .hero[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Skill Bars Animation
    initSkillBars() {
        this.skillBarsAnimated = false;
    }

    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        this.skillBarsAnimated = true;

        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                const skillLevel = item.getAttribute('data-skill');
                const progressBar = item.querySelector('.skill-progress');
                
                if (progressBar && skillLevel) {
                    progressBar.style.width = skillLevel + '%';
                    
                    // Add glow effect
                    setTimeout(() => {
                        progressBar.style.boxShadow = `0 0 20px rgba(0, 255, 255, 0.7)`;
                    }, 500);
                }
            }, index * 200);
        });
    }

    // Project Cards Animation
    animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-in-right');
            }, index * 300);
        });
    }

    // Glitch Effects
    initGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            this.addRandomGlitch(element);
        });

        // Add glitch effect to nav links on hover
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.triggerGlitch(link);
            });
        });

        // Add glitch effect to project links on hover
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.triggerGlitch(link);
            });
        });
    }

    addRandomGlitch(element) {
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.triggerGlitch(element);
            }
        }, 3000);
    }

    triggerGlitch(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch-anim-1 0.3s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = 'none';
        }, 300);
    }

    // Terminal Effects
    initTerminalEffects() {
        this.addTerminalPrompts();
        this.simulateTyping();
        this.initProjectInteractions(); // Added project interactions
    }

    // Project Interactions - FIXED
    initProjectInteractions() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click effect
                this.addClickEffect(link);
                
                // Add glitch effect on click
                this.triggerGlitch(link);
                
                // The link will naturally navigate due to target="_blank"
            });

            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(10px)';
                link.style.textShadow = '0 0 15px var(--cyber-neon-green)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateX(0)';
                link.style.textShadow = '0 0 5px var(--cyber-neon-green)';
            });
        });

        // Add enhanced project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'var(--cyber-neon-cyan)';
                card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.4)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.borderColor = 'var(--cyber-border)';
                card.style.boxShadow = 'none';
            });
        });
    }

    addClickEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            background: rgba(0, 255, 65, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addTerminalPrompts() {
        const terminals = document.querySelectorAll('.terminal-body');
        
        terminals.forEach(terminal => {
            // Add cursor blink effect
            const cursor = terminal.querySelector('.cursor');
            if (cursor) {
                setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
                }, 500);
            }
        });
    }

    simulateTyping() {
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const text = block.innerHTML;
            block.innerHTML = '';
            let index = 0;
            
            const typeChar = () => {
                if (index < text.length) {
                    block.innerHTML = text.substring(0, index + 1);
                    index++;
                    setTimeout(typeChar, 50 + Math.random() * 50);
                }
            };
            
            // Start typing after element is visible
            setTimeout(typeChar, 2000);
        });
    }

    // Parallax Effects
    parallaxEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    // Page Load Animation
    animatePageLoad() {
        const elements = document.querySelectorAll('.hero-content > *');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });

        // Add stagger effect to skill categories
        setTimeout(() => {
            document.querySelectorAll('.skill-category').forEach((category, index) => {
                setTimeout(() => {
                    category.classList.add('slide-in-right');
                }, index * 150);
            });
        }, 1000);
    }

    // Utility Functions
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    debounce(func, wait) {
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
}

// Advanced Effects Manager
class AdvancedEffects {
    constructor() {
        this.initHoverEffects();
        this.initClickEffects();
        this.initDataAnimations();
        this.initSocialLinkEffects(); // Added social link effects
    }

    initHoverEffects() {
        // Project card 3D hover effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });

        // Tech icon glow effect
        document.querySelectorAll('.tech-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
                icon.style.borderColor = 'var(--cyber-neon-cyan)';
                icon.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.boxShadow = 'none';
                icon.style.borderColor = 'var(--cyber-border)';
                icon.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Certificate card rotation effect
        document.querySelectorAll('.cert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0) scale(1)';
            });
        });
    }

    initClickEffects() {
        // Ripple effect for buttons
        document.querySelectorAll('.btn, .social-link').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(0, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    initSocialLinkEffects() {
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-8px) rotate(10deg)';
                link.style.boxShadow = '0 10px 25px rgba(0, 255, 255, 0.4)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) rotate(0deg)';
                link.style.boxShadow = 'none';
            });
        });
    }

    initDataAnimations() {
        // Animated counters for education scores
        const animateCounter = (element, target, duration = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.ceil(start);
                }
            }, 16);
        };

        // Observe education cards for counter animation
        const educationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scoreElement = entry.target.querySelector('.education-score');
                    if (scoreElement && !scoreElement.classList.contains('animated')) {
                        scoreElement.classList.add('animated');
                        const scoreText = scoreElement.textContent;
                        const scoreValue = parseFloat(scoreText.match(/[\d.]+/)[0]);
                        
                        if (scoreText.includes('%')) {
                            scoreElement.textContent = '0%';
                            setTimeout(() => {
                                let current = 0;
                                const timer = setInterval(() => {
                                    current += scoreValue / 100;
                                    if (current >= scoreValue) {
                                        scoreElement.textContent = scoreValue + '%';
                                        clearInterval(timer);
                                    } else {
                                        scoreElement.textContent = Math.ceil(current) + '%';
                                    }
                                }, 20);
                            }, 500);
                        } else if (scoreText.includes('GPA')) {
                            scoreElement.textContent = 'GPA: 0/10';
                            setTimeout(() => {
                                let current = 0;
                                const timer = setInterval(() => {
                                    current += scoreValue / 100;
                                    if (current >= scoreValue) {
                                        scoreElement.textContent = `GPA: ${scoreValue}/10`;
                                        clearInterval(timer);
                                    } else {
                                        scoreElement.textContent = `GPA: ${current.toFixed(1)}/10`;
                                    }
                                }, 20);
                            }, 500);
                        }
                    }
                }
            });
        });

        document.querySelectorAll('.education-card').forEach(card => {
            educationObserver.observe(card);
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.initMonitoring();
    }

    initMonitoring() {
        const monitor = () => {
            const currentTime = performance.now();
            this.frameCount++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // Adjust effects based on performance
                this.adjustEffectsForPerformance();
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    adjustEffectsForPerformance() {
        const isLowPerf = this.fps < 30;
        
        if (isLowPerf) {
            // Reduce particle count
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
            
            // Reduce matrix characters
            const matrixChars = document.querySelectorAll('.matrix-char');
            matrixChars.forEach((char, index) => {
                if (index % 3 === 0) {
                    char.style.display = 'none';
                }
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new CyberpunkPortfolio();
    const effects = new AdvancedEffects();
    const monitor = new PerformanceMonitor();
    
    // Add CSS animation keyframes for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: var(--cyber-neon-cyan);
            text-shadow: 0 0 10px var(--cyber-neon-cyan);
            background: rgba(0, 255, 255, 0.1);
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .slide-in-right {
            animation: slideInRight 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--cyber-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    loadingScreen.innerHTML = `
        <div style="text-align: center;">
            <div style="font-family: 'Orbitron', monospace; font-size: 2rem; color: var(--cyber-neon-cyan); text-shadow: 0 0 20px var(--cyber-neon-cyan); margin-bottom: 1rem;">
                Initializing...
            </div>
            <div style="width: 200px; height: 4px; background: rgba(0, 255, 255, 0.2); border-radius: 2px; overflow: hidden;">
                <div style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--cyber-neon-cyan), var(--cyber-neon-blue)); animation: loading 2s ease-in-out forwards;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Add loading animation
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        @keyframes loading {
            to { width: 100%; }
        }
    `;
    document.head.appendChild(loadingStyle);
    
    // Remove loading screen after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 2000);
    });
});
