/**
 * DefiWay Landing Page JavaScript
 * Senior Frontend: Modular, performant, and maintainable code
 */

// DOM utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce utility for performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Mobile menu functionality (toggle 'open' class)
class MobileMenu {
  constructor() {
    this.menuBtn = $('#defiway-landing .menu-btn');
    this.menu = $('#defiway-landing .mobile-menu');
    this.isOpen = false;

    this.init();
  }

  init() {
    if (this.menuBtn && this.menu) {
      this.menuBtn.addEventListener('click', () => this.toggle());

      // Close when clicking any interactive item inside the menu
      const closers = this.menu.querySelectorAll('a, button');
      closers.forEach((el) => el.addEventListener('click', () => this.close()));
    }

    // Close menu if viewport becomes ≤ 1024px
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.close();
      }
    }, 250));
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (!this.menuBtn) return;
    this.menuBtn.classList.add('open');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.menuBtn) return;
    this.menuBtn.classList.remove('open');
    this.isOpen = false;
    document.body.style.overflow = '';
  }
}

// Form validation and submission
class ConsultationForm {
  constructor() {
    this.form = $('#consultationForm');
    this.submitBtn = this.form?.querySelector('.submit-btn');
    this.originalBtnText = this.submitBtn?.textContent;
    
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = this.form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', debounce(() => this.validateField(input), 300));
      });
    }
  }
  
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    field.classList.remove('error');
    this.removeErrorMessage(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Enter a valid email address';
      }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Enter a valid phone number';
      }
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }
    
    return isValid;
  }
  
  showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
  }
  
  removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.showNotification('Please correct the errors in the form', 'error');
      return;
    }
    
    this.setSubmitState(true);
    
    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // TODO: Replace with actual API endpoint
      await this.submitForm(data);
      
      this.showNotification('Thank you! We will contact you soon', 'success');
      this.form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('An error occurred. Please try again', 'error');
    } finally {
      this.setSubmitState(false);
    }
  }
  
  async submitForm(data) {
    // Simulate API call - replace with actual endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Form data submitted:', data);
        resolve({ success: true });
      }, 2000);
    });
  }
  
  setSubmitState(isSubmitting) {
    if (!this.submitBtn) return;
    
    this.submitBtn.disabled = isSubmitting;
    this.submitBtn.textContent = isSubmitting ? 'Sending...' : this.originalBtnText;
  }
  
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// Smooth scroll for anchor links
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    const links = $$('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }
  
  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    const target = $(href);
    
    if (target) {
      e.preventDefault();
      const targetRect = target.getBoundingClientRect();
      const targetPosition = Math.max(0, Math.floor(targetRect.top + window.pageYOffset - window.innerHeight / 2 + targetRect.height / 2));

      const firstInput = target.querySelector('input, textarea');
      if (firstInput) {
        firstInput.focus();
      }
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Intersection Observer for animations
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    if (!('IntersectionObserver' in window)) return;
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    // Observe elements for animation
    const animatedElements = $$('#defiway-landing .feature-card, #defiway-landing .consultation-content');
    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      this.observer.observe(el);
    });
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Log Core Web Vitals
    if ('web-vital' in window) {
      this.measureWebVitals();
    }
    
    // Monitor page load
    window.addEventListener('load', () => {
      this.logPageLoadMetrics();
    });
  }
  
  logPageLoadMetrics() {
    if ('performance' in window) {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.log('Page Load Performance:', {
        pageLoadTime: `${pageLoadTime}ms`,
        domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`,
        timeToFirstByte: `${perfData.responseStart - perfData.navigationStart}ms`
      });
    }
  }
  
  measureWebVitals() {
    // This would integrate with web-vitals library if needed
    // For now, we'll use basic performance API
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('LCP:', entry.startTime);
            }
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }
  }
}

// Initialize everything when DOM is ready
class App {
  constructor() {
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    // Initialize all components
    new MobileMenu();
    new ConsultationForm();
    new SmoothScroll();
    new ScrollAnimations();
    
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      new PerformanceMonitor();
    }
    
    console.log('DefiWay Landing Page initialized successfully');
  }
}

// Start the application
new App();
