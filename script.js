/* ============================================
   AAKAR KALE — PORTFOLIO JS
   Custom cursor, scroll animations, interactivity
   ============================================ */

(function () {
    'use strict';

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    if (!isMobile && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover states
        document.querySelectorAll('[data-cursor]').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                const type = el.getAttribute('data-cursor');
                if (type === 'project') {
                    cursor.classList.add('project-hover');
                    follower.classList.add('project-hover');
                } else {
                    cursor.classList.add('active');
                    follower.classList.add('active');
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active', 'project-hover');
                follower.classList.remove('active', 'project-hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Load saved preference or respect system preference
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }

    // Apply on load
    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // --- Navigation Scroll Effect ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 1500;
        const stepTime = duration / target;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(target * eased);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(step);
    }

    // --- Smooth Scroll for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Magnetic Effect on Buttons ---
    if (!isMobile) {
        document.querySelectorAll('.btn-primary, .btn-secondary, .contact-link').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // --- Parallax on Hero Background Text ---
    const heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText && !isMobile) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            heroBgText.style.transform = `translateY(calc(-50% + ${scrollY * 0.3}px))`;
        }, { passive: true });
    }

    // --- Project Card Tilt Effect ---
    if (!isMobile) {
        document.querySelectorAll('.project-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-4px) perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.style.color = link.getAttribute('href') === `#${id}`
                            ? 'var(--text-primary)'
                            : '';
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // --- Hero Showcase Slideshow ---
    const showcase = document.getElementById('hero-showcase');

    if (showcase) {
        // SVG avatar generator with initials and gradient background
        function makeAvatar(initials, gradient) {
            return '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
                '<defs><linearGradient id="g' + initials.replace(/\s/g, '') + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" style="stop-color:' + gradient[0] + '"/>' +
                '<stop offset="100%" style="stop-color:' + gradient[1] + '"/>' +
                '</linearGradient></defs>' +
                '<circle cx="32" cy="32" r="32" fill="url(#g' + initials.replace(/\s/g, '') + ')"/>' +
                '<text x="32" y="32" text-anchor="middle" dy="0.35em" fill="white" ' +
                'font-family="Inter,sans-serif" font-size="22" font-weight="600">' + initials + '</text></svg>';
        }

        // City skyline SVG generator
        function makeCitySvg(type) {
            if (type === 'sf') {
                // Golden Gate Bridge + skyline silhouette
                return '<svg class="showcase-city-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><linearGradient id="sfSky" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" style="stop-color:#1a1a3e"/><stop offset="40%" style="stop-color:#2d1b4e"/>' +
                    '<stop offset="70%" style="stop-color:#c9654e"/><stop offset="100%" style="stop-color:#e8a87c"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="sfWater" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" style="stop-color:#1a3a5c"/><stop offset="100%" style="stop-color:#0d1b2a"/>' +
                    '</linearGradient></defs>' +
                    '<rect width="600" height="400" fill="url(#sfSky)"/>' +
                    '<rect y="300" width="600" height="100" fill="url(#sfWater)"/>' +
                    '<circle cx="480" cy="80" r="35" fill="#e8a87c" opacity="0.8"/>' +
                    // Bridge towers
                    '<rect x="160" y="140" width="12" height="160" fill="#8b3a3a" rx="2"/>' +
                    '<rect x="370" y="140" width="12" height="160" fill="#8b3a3a" rx="2"/>' +
                    // Bridge cables
                    '<path d="M166 150 Q268 220 376 150" stroke="#8b3a3a" fill="none" stroke-width="3"/>' +
                    '<path d="M100 280 L166 280" stroke="#8b3a3a" stroke-width="4"/>' +
                    '<path d="M376 280 L500 280" stroke="#8b3a3a" stroke-width="4"/>' +
                    '<path d="M166 280 L376 280" stroke="#8b3a3a" stroke-width="4"/>' +
                    // Vertical cables
                    '<line x1="200" y1="178" x2="200" y2="280" stroke="#8b3a3a" stroke-width="1.5" opacity="0.6"/>' +
                    '<line x1="235" y1="196" x2="235" y2="280" stroke="#8b3a3a" stroke-width="1.5" opacity="0.6"/>' +
                    '<line x1="268" y1="210" x2="268" y2="280" stroke="#8b3a3a" stroke-width="1.5" opacity="0.6"/>' +
                    '<line x1="305" y1="200" x2="305" y2="280" stroke="#8b3a3a" stroke-width="1.5" opacity="0.6"/>' +
                    '<line x1="340" y1="182" x2="340" y2="280" stroke="#8b3a3a" stroke-width="1.5" opacity="0.6"/>' +
                    // Distant skyline
                    '<path d="M0 295 L30 285 L50 290 L80 270 L95 275 L110 260 L120 265 L135 250 L145 260 L155 295 L600 295 L600 300 L0 300Z" fill="#1a2744" opacity="0.5"/>' +
                    // Water reflections
                    '<line x1="100" y1="320" x2="180" y2="320" stroke="#e8a87c" stroke-width="1" opacity="0.15"/>' +
                    '<line x1="250" y1="340" x2="350" y2="340" stroke="#e8a87c" stroke-width="1" opacity="0.1"/>' +
                    '<line x1="400" y1="330" x2="500" y2="330" stroke="#e8a87c" stroke-width="1" opacity="0.12"/>' +
                    '</svg>';
            } else if (type === 'mumbai') {
                // Mumbai skyline with Gateway of India
                return '<svg class="showcase-city-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><linearGradient id="mumSky" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" style="stop-color:#0a1628"/><stop offset="50%" style="stop-color:#1a2744"/>' +
                    '<stop offset="100%" style="stop-color:#2d4a6e"/>' +
                    '</linearGradient></defs>' +
                    '<rect width="600" height="400" fill="url(#mumSky)"/>' +
                    '<rect y="310" width="600" height="90" fill="#0d1b2a"/>' +
                    // Stars
                    '<circle cx="100" cy="40" r="1" fill="white" opacity="0.6"/>' +
                    '<circle cx="250" cy="70" r="1.5" fill="white" opacity="0.4"/>' +
                    '<circle cx="450" cy="30" r="1" fill="white" opacity="0.7"/>' +
                    '<circle cx="520" cy="90" r="1" fill="white" opacity="0.5"/>' +
                    '<circle cx="350" cy="50" r="1.2" fill="white" opacity="0.3"/>' +
                    // Gateway of India (center)
                    '<rect x="255" y="200" width="90" height="110" fill="#c9a96e" opacity="0.7" rx="2"/>' +
                    '<path d="M255 200 Q300 170 345 200" fill="#c9a96e" opacity="0.7"/>' +
                    '<rect x="275" y="240" width="20" height="70" fill="#0d1b2a" rx="8 8 0 0"/>' +
                    '<rect x="305" y="240" width="20" height="70" fill="#0d1b2a" rx="8 8 0 0"/>' +
                    '<rect x="265" y="195" width="8" height="30" fill="#c9a96e" opacity="0.9"/>' +
                    '<rect x="327" y="195" width="8" height="30" fill="#c9a96e" opacity="0.9"/>' +
                    // Skyline buildings
                    '<rect x="30" y="240" width="25" height="70" fill="#1a3050" rx="1"/>' +
                    '<rect x="60" y="220" width="20" height="90" fill="#1a3050" rx="1"/>' +
                    '<rect x="90" y="250" width="30" height="60" fill="#1a3050" rx="1"/>' +
                    '<rect x="130" y="200" width="18" height="110" fill="#1a3050" rx="1"/>' +
                    '<rect x="155" y="230" width="22" height="80" fill="#1a3050" rx="1"/>' +
                    '<rect x="400" y="210" width="20" height="100" fill="#1a3050" rx="1"/>' +
                    '<rect x="430" y="230" width="25" height="80" fill="#1a3050" rx="1"/>' +
                    '<rect x="465" y="190" width="15" height="120" fill="#1a3050" rx="1"/>' +
                    '<rect x="490" y="240" width="28" height="70" fill="#1a3050" rx="1"/>' +
                    '<rect x="530" y="220" width="20" height="90" fill="#1a3050" rx="1"/>' +
                    // Building windows
                    '<rect x="133" y="210" width="3" height="3" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="133" y="220" width="3" height="3" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="133" y="250" width="3" height="3" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="468" y="200" width="3" height="3" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="468" y="220" width="3" height="3" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="63" y="230" width="3" height="3" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="63" y="250" width="3" height="3" fill="#e8c87c" opacity="0.5"/>' +
                    // Water reflections
                    '<line x1="200" y1="330" x2="400" y2="330" stroke="#c9a96e" stroke-width="1" opacity="0.1"/>' +
                    '<line x1="250" y1="350" x2="350" y2="350" stroke="#c9a96e" stroke-width="1" opacity="0.08"/>' +
                    '<line x1="220" y1="370" x2="380" y2="370" stroke="#c9a96e" stroke-width="1" opacity="0.05"/>' +
                    '</svg>';
            } else if (type === 'sf-night') {
                // SF skyline at night
                return '<svg class="showcase-city-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><linearGradient id="sfnSky" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" style="stop-color:#050510"/><stop offset="60%" style="stop-color:#0a1628"/>' +
                    '<stop offset="100%" style="stop-color:#1a2744"/></linearGradient></defs>' +
                    '<rect width="600" height="400" fill="url(#sfnSky)"/>' +
                    '<rect y="300" width="600" height="100" fill="#080818"/>' +
                    // Moon
                    '<circle cx="120" cy="70" r="25" fill="#f0ece6" opacity="0.9"/>' +
                    '<circle cx="130" cy="62" r="22" fill="#050510"/>' +
                    // Stars
                    '<circle cx="250" cy="40" r="1" fill="white" opacity="0.5"/>' +
                    '<circle cx="400" cy="60" r="1.2" fill="white" opacity="0.6"/>' +
                    '<circle cx="500" cy="30" r="1" fill="white" opacity="0.4"/>' +
                    '<circle cx="350" cy="80" r="0.8" fill="white" opacity="0.3"/>' +
                    // Transamerica Pyramid
                    '<path d="M280 300 L295 140 L310 300Z" fill="#1a2744"/>' +
                    '<rect x="293" y="150" width="1" height="3" fill="#e8c87c" opacity="0.7"/>' +
                    '<rect x="290" y="180" width="1.5" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="298" y="180" width="1.5" height="2" fill="#e8c87c" opacity="0.6"/>' +
                    // Other buildings
                    '<rect x="180" y="220" width="35" height="80" fill="#141428" rx="1"/>' +
                    '<rect x="220" y="200" width="28" height="100" fill="#1a1a35" rx="1"/>' +
                    '<rect x="315" y="210" width="30" height="90" fill="#141428" rx="1"/>' +
                    '<rect x="350" y="230" width="40" height="70" fill="#1a1a35" rx="1"/>' +
                    '<rect x="395" y="195" width="22" height="105" fill="#141428" rx="1"/>' +
                    '<rect x="425" y="240" width="35" height="60" fill="#1a1a35" rx="1"/>' +
                    '<rect x="100" y="250" width="30" height="50" fill="#141428" rx="1"/>' +
                    '<rect x="140" y="235" width="25" height="65" fill="#1a1a35" rx="1"/>' +
                    '<rect x="470" y="230" width="28" height="70" fill="#141428" rx="1"/>' +
                    '<rect x="505" y="245" width="35" height="55" fill="#1a1a35" rx="1"/>' +
                    // Windows lit up
                    '<rect x="185" y="230" width="2" height="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<rect x="192" y="240" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="185" y="260" width="2" height="2" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="200" y="250" width="2" height="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="225" y="210" width="2" height="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="232" y="230" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="225" y="250" width="2" height="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<rect x="320" y="220" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="328" y="240" width="2" height="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="355" y="240" width="2" height="2" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="365" y="260" width="2" height="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<rect x="400" y="205" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="407" y="225" width="2" height="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<rect x="400" y="260" width="2" height="2" fill="#e8c87c" opacity="0.4"/>' +
                    // Water reflections
                    '<line x1="100" y1="320" x2="200" y2="320" stroke="#e8c87c" stroke-width="1" opacity="0.08"/>' +
                    '<line x1="250" y1="340" x2="380" y2="340" stroke="#e8c87c" stroke-width="1" opacity="0.06"/>' +
                    '<line x1="400" y1="330" x2="520" y2="330" stroke="#e8c87c" stroke-width="1" opacity="0.07"/>' +
                    '</svg>';
            } else {
                // Mumbai Marine Drive at night
                return '<svg class="showcase-city-svg" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><linearGradient id="mdSky" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" style="stop-color:#0a0a20"/><stop offset="60%" style="stop-color:#15203a"/>' +
                    '<stop offset="100%" style="stop-color:#1e3050"/></linearGradient></defs>' +
                    '<rect width="600" height="400" fill="url(#mdSky)"/>' +
                    '<rect y="280" width="600" height="120" fill="#0a1520"/>' +
                    // Stars
                    '<circle cx="80" cy="50" r="1" fill="white" opacity="0.5"/>' +
                    '<circle cx="300" cy="30" r="1.2" fill="white" opacity="0.4"/>' +
                    '<circle cx="520" cy="60" r="1" fill="white" opacity="0.6"/>' +
                    // Marine Drive curve of lights (the "Queen\'s Necklace")
                    '<path d="M50 275 Q150 260 250 268 Q350 275 450 270 Q520 266 580 275" stroke="#e8c87c" stroke-width="2" fill="none" opacity="0.7"/>' +
                    // Individual lights along the curve
                    '<circle cx="80" cy="273" r="2" fill="#e8c87c" opacity="0.8"/>' +
                    '<circle cx="120" cy="268" r="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<circle cx="160" cy="265" r="2" fill="#e8c87c" opacity="0.9"/>' +
                    '<circle cx="200" cy="265" r="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<circle cx="240" cy="267" r="2" fill="#e8c87c" opacity="0.8"/>' +
                    '<circle cx="280" cy="269" r="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<circle cx="320" cy="271" r="2" fill="#e8c87c" opacity="0.9"/>' +
                    '<circle cx="360" cy="272" r="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<circle cx="400" cy="271" r="2" fill="#e8c87c" opacity="0.8"/>' +
                    '<circle cx="440" cy="270" r="2" fill="#e8c87c" opacity="0.7"/>' +
                    '<circle cx="480" cy="268" r="2" fill="#e8c87c" opacity="0.9"/>' +
                    '<circle cx="520" cy="267" r="2" fill="#e8c87c" opacity="0.6"/>' +
                    '<circle cx="560" cy="270" r="2" fill="#e8c87c" opacity="0.8"/>' +
                    // Buildings behind the drive
                    '<rect x="60" y="230" width="20" height="42" fill="#15203a" rx="1"/>' +
                    '<rect x="90" y="215" width="18" height="55" fill="#15203a" rx="1"/>' +
                    '<rect x="140" y="225" width="25" height="40" fill="#15203a" rx="1"/>' +
                    '<rect x="200" y="210" width="15" height="55" fill="#15203a" rx="1"/>' +
                    '<rect x="350" y="220" width="22" height="50" fill="#15203a" rx="1"/>' +
                    '<rect x="420" y="225" width="18" height="43" fill="#15203a" rx="1"/>' +
                    '<rect x="480" y="215" width="20" height="52" fill="#15203a" rx="1"/>' +
                    '<rect x="520" y="230" width="25" height="38" fill="#15203a" rx="1"/>' +
                    // Building windows
                    '<rect x="93" y="222" width="2" height="2" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="100" y="235" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="203" y="220" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    '<rect x="354" y="230" width="2" height="2" fill="#e8c87c" opacity="0.4"/>' +
                    '<rect x="483" y="225" width="2" height="2" fill="#e8c87c" opacity="0.5"/>' +
                    // Water reflections of the necklace
                    '<path d="M50 290 Q150 300 250 295 Q350 290 450 295 Q520 300 580 290" stroke="#e8c87c" stroke-width="1" fill="none" opacity="0.12"/>' +
                    '<path d="M50 310 Q150 320 250 315 Q350 310 450 315 Q520 320 580 310" stroke="#e8c87c" stroke-width="1" fill="none" opacity="0.06"/>' +
                    '</svg>';
            }
        }

        var showcaseSlides = [
            {
                type: 'city',
                cityType: 'sf',
                name: 'San Francisco',
                subtitle: 'Where I build products'
            },
            {
                type: 'quote',
                text: '\u201CSome people want it to happen, some wish it would happen, others <strong>make it happen.</strong>\u201D',
                author: 'Michael Jordan',
                initials: 'MJ',
                colors: ['#C0392B', '#922B21']
            },
            {
                type: 'city',
                cityType: 'mumbai',
                name: 'Mumbai',
                subtitle: 'Where it all began'
            },
            {
                type: 'quote',
                text: '\u201CYour time is limited, don\u2019t waste it living <strong>someone else\u2019s life.</strong>\u201D',
                author: 'Steve Jobs',
                initials: 'SJ',
                colors: ['#555555', '#333333']
            },
            {
                type: 'city',
                cityType: 'sf-night',
                name: 'San Francisco',
                subtitle: 'City by the Bay'
            },
            {
                type: 'quote',
                text: '\u201CI don\u2019t believe in taking right decisions. I take decisions and then <strong>make them right.</strong>\u201D',
                author: 'Ratan Tata',
                initials: 'RT',
                colors: ['#1A5276', '#2980B9']
            },
            {
                type: 'city',
                cityType: 'mumbai-night',
                name: 'Mumbai',
                subtitle: 'The Queen\u2019s Necklace'
            },
            {
                type: 'quote',
                text: '\u201CDream is not that which you see while sleeping. It is something that <strong>does not let you sleep.</strong>\u201D',
                author: 'APJ Abdul Kalam',
                initials: 'AK',
                colors: ['#196F3D', '#27AE60']
            },
            {
                type: 'quote',
                text: '\u201CWhen something is important enough, you do it even if the odds are <strong>not in your favor.</strong>\u201D',
                author: 'Elon Musk',
                initials: 'EM',
                colors: ['#2C3E50', '#4A6FA5']
            },
            {
                type: 'quote',
                text: '\u201CThe only way to do great work is to <strong>love what you do.</strong>\u201D',
                author: 'Steve Jobs',
                initials: 'SJ',
                colors: ['#555555', '#333333']
            },
            {
                type: 'quote',
                text: '\u201CThe best way to predict the future is to <strong>create it.</strong>\u201D',
                author: 'Peter Drucker',
                initials: 'PD',
                colors: ['#6C3483', '#8E44AD']
            },
            {
                type: 'quote',
                text: '\u201CSuccess is not final, failure is not fatal: it is the courage to continue <strong>that counts.</strong>\u201D',
                author: 'Winston Churchill',
                initials: 'WC',
                colors: ['#1B4F72', '#2E86C1']
            },
            {
                type: 'quote',
                text: '\u201CIn the middle of difficulty lies <strong>opportunity.</strong>\u201D',
                author: 'Albert Einstein',
                initials: 'AE',
                colors: ['#7D6608', '#B7950B']
            },
            {
                type: 'quote',
                text: '\u201CBe the change that you wish to <strong>see in the world.</strong>\u201D',
                author: 'Mahatma Gandhi',
                initials: 'MG',
                colors: ['#784212', '#AF601A']
            }
        ];

        // Build slide elements
        showcaseSlides.forEach(function(slide, i) {
            var el = document.createElement('div');
            el.className = 'showcase-slide ' + (slide.type === 'city' ? 'showcase-city' : 'showcase-quote');
            if (i === 0) el.classList.add('active');

            if (slide.type === 'city') {
                el.innerHTML =
                    makeCitySvg(slide.cityType) +
                    '<div class="showcase-city-overlay">' +
                    '  <span class="showcase-city-name">' + slide.name + '</span>' +
                    '  <span class="showcase-city-sub">' + slide.subtitle + '</span>' +
                    '</div>';
            } else {
                var avatarSvg = makeAvatar(slide.initials, slide.colors);
                el.innerHTML =
                    '<p class="showcase-quote-text">' + slide.text + '</p>' +
                    '<div class="showcase-author">' +
                    '  <div class="showcase-author-avatar">' + avatarSvg + '</div>' +
                    '  <span class="showcase-author-name">' + slide.author + '</span>' +
                    '</div>';
            }

            showcase.appendChild(el);
        });

        // Cycle slides
        var currentSlide = 0;
        var allSlides = showcase.querySelectorAll('.showcase-slide');

        setInterval(function() {
            allSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % allSlides.length;
            allSlides[currentSlide].classList.add('active');
        }, 5000);
    }

    // --- Hero entrance on load ---
    window.addEventListener('load', () => {
        document.querySelectorAll('.hero .reveal-up').forEach((el) => {
            el.classList.add('revealed');
        });
    });
})();
