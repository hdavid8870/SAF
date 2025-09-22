// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate progress bars
            if (entry.target.classList.contains('attempt-item')) {
                const bar = entry.target.querySelector('.attempt-bar');
                const percentage = bar.dataset.percentage;
                bar.style.setProperty('--percentage', percentage + '%');
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-card, .solution-card, .business-card, .team-card, .research-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Observe progress bars
    document.querySelectorAll('.attempt-item').forEach(item => {
        observer.observe(item);
    });
    
    // Initialize charts
    initCharts();
});

// Initialize Charts
function initCharts() {
    // Hero Chart - Financial Growth Simulation
    const heroCtx = document.getElementById('heroChart');
    if (heroCtx) {
        new Chart(heroCtx, {
            type: 'line',
            data: {
                labels: ['현재', '1년', '3년', '5년', '10년', '15년', '20년'],
                datasets: [{
                    label: '기존 방식',
                    data: [100, 150, 200, 300, 500, 750, 1000],
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 2,
                    fill: true
                }, {
                    label: '맞춤형 재무설계',
                    data: [100, 180, 280, 450, 800, 1300, 2000],
                    borderColor: '#f1c40f',
                    backgroundColor: 'rgba(241, 196, 15, 0.2)',
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                return value + '만원';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    // Difficulty Chart - Problems with Financial Planning
    const difficultyCtx = document.getElementById('difficultyChart');
    if (difficultyCtx) {
        new Chart(difficultyCtx, {
            type: 'doughnut',
            data: {
                labels: [
                    '어디서부터 시작할지 모름',
                    '지속 실행이 어렵다',
                    '목표별 로드맵 부재',
                    '금융상품 선택 어려움',
                    '소득·지출 파악 어려움'
                ],
                datasets: [{
                    data: [46.9, 44.8, 42.7, 36.5, 21.9],
                    backgroundColor: [
                        '#e74c3c',
                        '#f39c12',
                        '#f1c40f',
                        '#3498db',
                        '#9b59b6'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate statistics when they come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.number');
            if (number && !number.classList.contains('animated')) {
                number.classList.add('animated');
                const target = parseInt(number.textContent);
                number.textContent = '0';
                animateCounter(number, target);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .solution-card, .business-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Form validation and interaction (if forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Button click animations
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Loading animation
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }
    
    // Add entrance animations
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Smooth reveal animations for sections
const revealSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('section-revealed');
        observer.unobserve(entry.target);
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});

revealSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section-hidden');
});

// Add CSS for section animations
const sectionStyle = document.createElement('style');
sectionStyle.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .section-revealed {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s ease;
    }
`;
document.head.appendChild(sectionStyle);

// Console welcome message
console.log(`
🚀 개인 재무설계 서비스 웹사이트에 오신 것을 환영합니다!
📊 이 사이트는 현대적인 웹 기술로 구축되었습니다.
💡 문의사항이 있으시면 연락주세요!

개발: AI Assistant
기술: HTML5, CSS3, JavaScript, Chart.js
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`페이지 로드 시간: ${loadTime}ms`);
        }, 0);
    });
}
