// ===== NEBULA ARENA - MAIN JAVASCRIPT ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== APP INITIALIZATION ===== //
function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeLiveUpdates();
    initializeInteractiveElements();
    initializeAccessibility();
    
    console.log('🚀 Nebula Arena initialized successfully!');
}

// ===== NAVIGATION FUNCTIONALITY ===== //
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = mobileMenuToggle.classList.contains('active') 
                    ? getHamburgerTransform(index) 
                    : 'none';
            });
        });
    }
    
    // Navigation link active state management
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section (if exists)
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
}

function getHamburgerTransform(index) {
    const transforms = [
        'rotate(45deg) translate(5px, 5px)',
        'opacity: 0',
        'rotate(-45deg) translate(7px, -6px)'
    ];
    return transforms[index];
}

// ===== ANIMATIONS & VISUAL EFFECTS ===== //
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        observer.observe(card);
    });
    
    // Arena grid cell animation
    initializeArenaGridAnimation();
    
    // Button hover effects
    initializeButtonEffects();
}

function initializeArenaGridAnimation() {
    const gridCells = document.querySelectorAll('.grid-cell');
    
    if (gridCells.length > 0) {
        setInterval(() => {
            // Randomly activate/deactivate grid cells
            gridCells.forEach(cell => {
                if (Math.random() > 0.7) {
                    cell.classList.toggle('active');
                }
            });
        }, 2000);
    }
}

function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== LIVE UPDATES SIMULATION ===== //
function initializeLiveUpdates() {
    // Simulate live match updates
    updateLiveMatches();
    setInterval(updateLiveMatches, 10000); // Update every 10 seconds
    
    // Simulate leaderboard updates
    updateLeaderboard();
    setInterval(updateLeaderboard, 30000); // Update every 30 seconds
    
    // Update tournament countdown
    updateTournamentCountdown();
    setInterval(updateTournamentCountdown, 60000); // Update every minute
}

function updateLiveMatches() {
    const matchItems = document.querySelectorAll('.match-item');
    const players = [
        'CyberNinja', 'QuantumRider', 'StarForge', 'VoidWalker', 
        'NeonStrike', 'CosmicFlare', 'NebulaKing', 'StarDestroyer',
        'GalaxyHunter', 'VoidMaster', 'CosmicRage', 'StellarPhoenix'
    ];
    
    matchItems.forEach(item => {
        const playerElements = item.querySelectorAll('.player');
        const statusElement = item.querySelector('.match-status');
        
        // Randomly update player names
        if (Math.random() > 0.8) {
            playerElements.forEach(playerEl => {
                const randomPlayer = players[Math.floor(Math.random() * players.length)];
                playerEl.textContent = randomPlayer;
            });
        }
        
        // Randomly update match status
        if (Math.random() > 0.9) {
            const statuses = [
                { text: 'LIVE', class: 'live' },
                { text: 'Starting Soon', class: 'starting' },
                { text: 'LIVE', class: 'live' }
            ];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusElement.textContent = randomStatus.text;
            statusElement.className = `match-status ${randomStatus.class}`;
        }
    });
}

function updateLeaderboard() {
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    leaderboardItems.forEach(item => {
        const scoreElement = item.querySelector('.score');
        if (scoreElement && Math.random() > 0.7) {
            const currentScore = parseInt(scoreElement.textContent.replace(',', ''));
            const change = Math.floor(Math.random() * 20) - 10; // -10 to +10
            const newScore = Math.max(0, currentScore + change);
            scoreElement.textContent = newScore.toLocaleString();
            
            // Add visual feedback for score change
            if (change > 0) {
                scoreElement.style.color = '#10b981';
                setTimeout(() => {
                    scoreElement.style.color = '#06b6d4';
                }, 1000);
            } else if (change < 0) {
                scoreElement.style.color = '#ef4444';
                setTimeout(() => {
                    scoreElement.style.color = '#06b6d4';
                }, 1000);
            }
        }
    });
}

function updateTournamentCountdown() {
    const tournamentDates = document.querySelectorAll('.tournament-date');
    
    tournamentDates.forEach(dateElement => {
        const currentText = dateElement.textContent;
        
        if (currentText.includes('hours')) {
            const hours = parseInt(currentText.match(/\d+/)[0]);
            if (hours > 1) {
                dateElement.textContent = `Starts in ${hours - 1} hours`;
            } else {
                dateElement.textContent = 'Starting Soon!';
                dateElement.style.color = '#f59e0b';
            }
        } else if (currentText.includes('days')) {
            const days = parseInt(currentText.match(/\d+/)[0]);
            const hours = Math.floor(Math.random() * 24);
            dateElement.textContent = `Starts in ${days} days, ${hours} hours`;
        }
    });
}

// ===== INTERACTIVE ELEMENTS ===== //
function initializeInteractiveElements() {
    // Dashboard card interactions
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(99, 102, 241, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Match item click handlers
    const matchItems = document.querySelectorAll('.match-item');
    matchItems.forEach(item => {
        item.addEventListener('click', function() {
            showMatchDetails(this);
        });
    });
    
    // Leaderboard item click handlers
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    leaderboardItems.forEach(item => {
        item.addEventListener('click', function() {
            showPlayerProfile(this);
        });
    });
    
    // Tournament item click handlers
    const tournamentItems = document.querySelectorAll('.tournament-item');
    tournamentItems.forEach(item => {
        item.addEventListener('click', function() {
            showTournamentDetails(this);
        });
    });
}

function showMatchDetails(matchElement) {
    const players = matchElement.querySelectorAll('.player');
    const status = matchElement.querySelector('.match-status').textContent;
    
    // Create a simple modal or notification
    showNotification(`Match Details: ${players[0].textContent} vs ${players[1].textContent} - Status: ${status}`, 'info');
}

function showPlayerProfile(playerElement) {
    const playerName = playerElement.querySelector('.player-name').textContent;
    const score = playerElement.querySelector('.score').textContent;
    const rank = playerElement.querySelector('.rank').textContent;
    
    showNotification(`Player Profile: ${playerName} - Rank: ${rank} - Score: ${score}`, 'info');
}

function showTournamentDetails(tournamentElement) {
    const name = tournamentElement.querySelector('.tournament-name').textContent;
    const date = tournamentElement.querySelector('.tournament-date').textContent;
    const prize = tournamentElement.querySelector('.tournament-prize').textContent;
    
    showNotification(`Tournament: ${name} - ${date} - Prize: ${prize}`, 'info');
}

// ===== NOTIFICATION SYSTEM ===== //
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        border: 1px solid rgba(99, 102, 241, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== ACCESSIBILITY FEATURES ===== //
function initializeAccessibility() {
    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .match-item, .leaderboard-item, .tournament-item');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Focus management for mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Announce dynamic content changes to screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Update live region when content changes
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
    };
}

// ===== UTILITY FUNCTIONS ===== //
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
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS ===== //
// Lazy load images when they come into view
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
}

// ===== ERROR HANDLING ===== //
window.addEventListener('error', function(e) {
    console.error('Nebula Arena Error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});

// ===== CUSTOM CSS ANIMATIONS ===== //
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
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s ease;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: var(--radius-lg);
            padding: var(--spacing-lg);
            margin: var(--spacing-sm);
            box-shadow: var(--shadow-xl);
            backdrop-filter: blur(10px);
            z-index: 1000;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// ===== EXPORT FOR TESTING ===== //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        debounce,
        throttle
    };
}
