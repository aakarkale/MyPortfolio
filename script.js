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
        const showcaseSlides = [
            {
                type: 'city',
                image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&q=80',
                name: 'San Francisco',
                subtitle: 'Where I build products'
            },
            {
                type: 'quote',
                text: '\u201CSome people want it to happen, some wish it would happen, others <strong>make it happen.</strong>\u201D',
                author: 'Michael Jordan',
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg'
            },
            {
                type: 'city',
                image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop&q=80',
                name: 'Mumbai',
                subtitle: 'Where it all began'
            },
            {
                type: 'quote',
                text: '\u201CYour time is limited, don\u2019t waste it living <strong>someone else\u2019s life.</strong>\u201D',
                author: 'Steve Jobs',
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/220px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg'
            },
            {
                type: 'city',
                image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=600&fit=crop&q=80',
                name: 'San Francisco',
                subtitle: 'City by the Bay'
            },
            {
                type: 'quote',
                text: '\u201CI don\u2019t believe in taking right decisions. I take decisions and then <strong>make them right.</strong>\u201D',
                author: 'Ratan Tata',
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ratan_Tata_photo.jpg/220px-Ratan_Tata_photo.jpg'
            },
            {
                type: 'city',
                image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&h=600&fit=crop&q=80',
                name: 'Mumbai',
                subtitle: 'The city of dreams'
            },
            {
                type: 'quote',
                text: '\u201CDream is not that which you see while sleeping. It is something that <strong>does not let you sleep.</strong>\u201D',
                author: 'APJ Abdul Kalam',
                avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/220px-A._P._J._Abdul_Kalam.jpg'
            }
        ];

        // Build slide elements
        showcaseSlides.forEach((slide, i) => {
            const el = document.createElement('div');
            el.className = 'showcase-slide ' + (slide.type === 'city' ? 'showcase-city' : 'showcase-quote');
            if (i === 0) el.classList.add('active');

            if (slide.type === 'city') {
                el.innerHTML =
                    '<img class="showcase-city-img" src="' + slide.image + '" alt="' + slide.name + '" loading="eager">' +
                    '<div class="showcase-city-overlay">' +
                    '  <span class="showcase-city-name">' + slide.name + '</span>' +
                    '  <span class="showcase-city-sub">' + slide.subtitle + '</span>' +
                    '</div>';
            } else {
                el.innerHTML =
                    '<p class="showcase-quote-text">' + slide.text + '</p>' +
                    '<div class="showcase-author">' +
                    '  <div class="showcase-author-avatar">' +
                    '    <img src="' + slide.avatar + '" alt="' + slide.author + '">' +
                    '  </div>' +
                    '  <span class="showcase-author-name">' + slide.author + '</span>' +
                    '</div>';
            }

            showcase.appendChild(el);
        });

        // Cycle slides
        let currentSlide = 0;
        const allSlides = showcase.querySelectorAll('.showcase-slide');

        setInterval(() => {
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
