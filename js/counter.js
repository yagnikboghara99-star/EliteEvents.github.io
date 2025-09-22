// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    handleLoadingScreen();
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeLightbox();
    initializeTestimonialCarousel();
    initializeFAQ();
    initializeEventFilters();
    initializeStatCounters();
    initializeSmoothScrolling();
    handleScrollEffects();
}

// Loading Screen
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Hide loading screen after page loads
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000); // Show loading for at least 1 second
        });
    }
}

// Navigation Functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navHamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navHamburger) {
        navHamburger.addEventListener('click', function() {
            navHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navHamburger.classList.contains('active')) {
                navHamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Set active nav link based on current page
    setActiveNavLink();
}

// Set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations (AOS-like functionality)
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });

    // Animate event cards on scroll
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 300);
    });

    // Animate service items
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, observerOptions);

    serviceItems.forEach(item => serviceObserver.observe(item));
}

// Form Validation and Submission
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const successMessage = document.getElementById('successMessage');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });

        function validateForm() {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        function validateField(field) {
            const fieldName = field.name;
            const fieldValue = field.value.trim();
            const errorElement = document.getElementById(fieldName + 'Error');
            
            // Clear previous errors
            clearFieldError(field);
            
            // Required field validation
            if (field.hasAttribute('required') && !fieldValue) {
                showFieldError(field, 'This field is required.');
                return false;
            }
            
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    if (fieldValue && !isValidEmail(fieldValue)) {
                        showFieldError(field, 'Please enter a valid email address.');
                        return false;
                    }
                    break;
                    
                case 'phone':
                    if (fieldValue && !isValidPhone(fieldValue)) {
                        showFieldError(field, 'Please enter a valid phone number.');
                        return false;
                    }
                    break;
                    
                case 'eventDate':
                    if (fieldValue && new Date(fieldValue) < new Date()) {
                        showFieldError(field, 'Event date must be in the future.');
                        return false;
                    }
                    break;
                    
                case 'guestCount':
                    if (fieldValue && (fieldValue < 1 || fieldValue > 10000)) {
                        showFieldError(field, 'Guest count must be between 1 and 10,000.');
                        return false;
                    }
                    break;
            }
            
            return true;
        }

        function showFieldError(field, message) {
            field.style.borderColor = '#e53e3e';
            const errorElement = document.getElementById(field.name + 'Error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        }

        function clearFieldError(field) {
            field.style.borderColor = '#e2e8f0';
            const errorElement = document.getElementById(field.name + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        }

        function submitForm() {
            // Show loading state
            const btnText = document.querySelector('.btn-text');
            const btnLoading = document.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form after success
                setTimeout(() => {
                    contactForm.reset();
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        }
    }
}

// Lightbox Functionality
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    if (lightbox) {
        // Sample event data for lightbox
        const eventData = {
            'corporate-gala': {
                title: 'Annual Corporate Gala',
                description: 'A sophisticated evening celebration for 500+ executives featuring elegant dining, live entertainment, and networking opportunities.',
                eventType: 'Corporate Event',
                guests: '500+',
                location: 'Grand Ballroom, NYC',
                images: [
                    'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
                    'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
                    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                ]
            },
            'garden-wedding': {
                title: 'Luxury Garden Wedding',
                description: 'An intimate outdoor ceremony with bespoke floral arrangements, gourmet catering, and breathtaking garden views.',
                eventType: 'Wedding',
                guests: '150',
                location: 'Botanical Gardens, NY',
                images: [
                    'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
                    'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                ]
            },
            'product-launch': {
                title: 'Tech Product Launch',
                description: 'A cutting-edge product reveal with interactive demonstrations, media coverage, and influencer engagement.',
                eventType: 'Product Launch',
                guests: '300',
                location: 'Innovation Center, NYC',
                images: [
                    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                ]
            }
        };

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventKey = this.getAttribute('data-lightbox');
                const event = eventData[eventKey];
                
                if (event) {
                    populateLightbox(event);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        function populateLightbox(event) {
            document.getElementById('lightboxTitle').textContent = event.title;
            document.getElementById('lightboxDescription').textContent = event.description;
            document.getElementById('lightboxEventType').textContent = event.eventType;
            document.getElementById('lightboxGuests').textContent = event.guests;
            document.getElementById('lightboxLocation').textContent = event.location;
            
            const mainImage = document.getElementById('lightboxMainImage');
            mainImage.src = event.images[0];
            mainImage.alt = event.title;
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Testimonial Carousel
function initializeTestimonialCarousel() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    if (testimonialSlides.length > 0) {
        // Auto-rotate testimonials
        setInterval(() => {
            showSlide((currentSlide + 1) % testimonialSlides.length);
        }, 5000);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        function showSlide(index) {
            // Hide all slides
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Show current slide
            testimonialSlides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        // Animate FAQ items on scroll
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Event Filtering
function initializeEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach((item, index) => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        setTimeout(() => {
                            item.classList.remove('hide');
                            item.classList.add('show');
                        }, index * 100);
                    } else {
                        item.classList.remove('show');
                        item.classList.add('hide');
                    }
                });
            });
        });
        
        // Initialize with all items visible
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Statistics Counter Animation
function initializeStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 16);
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function handleScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate);
}

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Service Worker Registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for PWA functionality
        console.log('Service Worker support detected');
    });
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals/menus
            const activeModal = document.querySelector('.lightbox.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            const activeMenu = document.querySelector('.nav-menu.active');
            if (activeMenu) {
                activeMenu.classList.remove('active');
                document.querySelector('.nav-hamburger').classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Improve focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.querySelectorAll('.modal, .lightbox').forEach(modal => {
        const focusableContent = modal.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Image Lazy Loading (for better performance)
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);