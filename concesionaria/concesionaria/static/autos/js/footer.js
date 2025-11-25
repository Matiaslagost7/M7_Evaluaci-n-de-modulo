/**
 * Footer JavaScript - AutoVentas Concesionaria
 * Funcionalidad avanzada y validación para el footer
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================================
    // CONFIGURACIÓN INICIAL
    // =========================================================================
    
    const footerConfig = {
        newsletter: {
            endpoint: '/api/newsletter/subscribe/', // Endpoint para suscripción
            timeout: 5000, // Timeout para la petición
            messages: {
                success: '¡Gracias por suscribirte! Te mantendremos informado.',
                error: 'Hubo un error al procesar tu suscripción. Inténtalo de nuevo.',
                invalidEmail: 'Por favor, introduce un email válido.',
                alreadySubscribed: 'Este email ya está suscrito a nuestro newsletter.'
            }
        },
        backToTop: {
            showAfter: 300, // Mostrar después de 300px de scroll
            scrollDuration: 800 // Duración del scroll suave
        },
        animations: {
            enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
    };

    // =========================================================================
    // NEWSLETTER AVANZADO
    // =========================================================================
    
    class NewsletterManager {
        constructor() {
            this.form = document.querySelector('.newsletter-form');
            this.input = document.querySelector('.newsletter-input');
            this.button = document.querySelector('.newsletter-btn');
            this.originalButtonText = this.button ? this.button.innerHTML : '';
            this.isSubmitting = false;
            
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.input.addEventListener('input', () => this.validateEmail());
            this.input.addEventListener('blur', () => this.validateEmail());
            
            // Agregar indicadores visuales
            this.setupValidationIndicators();
        }

        setupValidationIndicators() {
            // Crear contenedor para mensajes de validación
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'newsletter-feedback';
            feedbackDiv.style.cssText = `
                margin-top: 0.5rem;
                font-size: 0.875rem;
                text-align: center;
                min-height: 1.25rem;
                transition: all 0.3s ease;
            `;
            this.form.appendChild(feedbackDiv);
            this.feedback = feedbackDiv;
        }

        validateEmail() {
            const email = this.input.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                this.showFeedback('', 'neutral');
                this.input.classList.remove('is-valid', 'is-invalid');
                return false;
            }
            
            if (!emailRegex.test(email)) {
                this.showFeedback(footerConfig.newsletter.messages.invalidEmail, 'error');
                this.input.classList.add('is-invalid');
                this.input.classList.remove('is-valid');
                return false;
            }
            
            this.showFeedback('✓ Email válido', 'success');
            this.input.classList.add('is-valid');
            this.input.classList.remove('is-invalid');
            return true;
        }

        showFeedback(message, type) {
            if (!this.feedback) return;
            
            this.feedback.textContent = message;
            this.feedback.className = `newsletter-feedback newsletter-feedback-${type}`;
            
            // Aplicar estilos según el tipo
            const styles = {
                success: { color: '#10b981', opacity: '1' },
                error: { color: '#ef4444', opacity: '1' },
                neutral: { color: 'transparent', opacity: '0' }
            };
            
            Object.assign(this.feedback.style, styles[type] || styles.neutral);
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            if (!this.validateEmail()) {
                this.input.focus();
                return;
            }

            this.isSubmitting = true;
            this.setButtonState('loading');
            
            try {
                const response = await this.submitNewsletter();
                this.handleSuccess(response);
            } catch (error) {
                this.handleError(error);
            } finally {
                this.isSubmitting = false;
            }
        }

        async submitNewsletter() {
            const email = this.input.value.trim();
            
            // Simulación de API call (reemplazar con llamada real)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simular diferentes respuestas basadas en el email
                    if (email.includes('test@')) {
                        reject(new Error('already_subscribed'));
                    } else if (email.includes('error@')) {
                        reject(new Error('server_error'));
                    } else {
                        resolve({ success: true, message: 'Suscripción exitosa' });
                    }
                }, 2000);
            });
            
            /* Código para implementación real:
            const formData = new FormData();
            formData.append('email', email);
            
            const response = await fetch(footerConfig.newsletter.endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': this.getCSRFToken()
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            */
        }

        getCSRFToken() {
            return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
        }

        handleSuccess(response) {
            this.setButtonState('success');
            this.showFeedback(footerConfig.newsletter.messages.success, 'success');
            
            // Limpiar formulario después de un tiempo
            setTimeout(() => {
                this.resetForm();
            }, 3000);

            // Mostrar notificación toast si está disponible
            if (typeof showToast === 'function') {
                showToast(footerConfig.newsletter.messages.success, 'success');
            }
        }

        handleError(error) {
            let message = footerConfig.newsletter.messages.error;
            
            if (error.message === 'already_subscribed') {
                message = footerConfig.newsletter.messages.alreadySubscribed;
            }
            
            this.setButtonState('error');
            this.showFeedback(message, 'error');
            
            setTimeout(() => {
                this.resetButton();
            }, 3000);

            // Mostrar notificación toast si está disponible
            if (typeof showToast === 'function') {
                showToast(message, 'error');
            }
        }

        setButtonState(state) {
            if (!this.button) return;
            
            const states = {
                loading: {
                    html: '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...',
                    disabled: true,
                    class: 'btn-warning'
                },
                success: {
                    html: '<i class="fas fa-check me-2"></i>¡Suscrito!',
                    disabled: true,
                    class: 'btn-success'
                },
                error: {
                    html: '<i class="fas fa-exclamation-triangle me-2"></i>Error',
                    disabled: true,
                    class: 'btn-danger'
                }
            };
            
            const config = states[state];
            if (config) {
                this.button.innerHTML = config.html;
                this.button.disabled = config.disabled;
                this.button.className = this.button.className.replace(/btn-\w+/g, '') + ' ' + config.class;
            }
        }

        resetButton() {
            if (!this.button) return;
            
            this.button.innerHTML = this.originalButtonText;
            this.button.disabled = false;
            this.button.className = this.button.className.replace(/btn-\w+/g, '') + ' btn-primary';
        }

        resetForm() {
            this.form.reset();
            this.input.classList.remove('is-valid', 'is-invalid');
            this.showFeedback('', 'neutral');
            this.resetButton();
        }
    }

    // =========================================================================
    // BOTÓN BACK TO TOP AVANZADO
    // =========================================================================
    
    class BackToTopManager {
        constructor() {
            this.button = document.getElementById('backToTopBtn') || document.querySelector('.back-to-top-btn');
            this.isVisible = false;
            this.scrollProgress = 0;
            
            this.init();
        }

        init() {
            if (!this.button) return;
            
            this.createProgressIndicator();
            this.bindEvents();
            this.handleScroll(); // Verificar estado inicial
        }

        createProgressIndicator() {
            // Crear indicador de progreso circular
            const progressSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            progressSvg.setAttribute('class', 'back-to-top-progress');
            progressSvg.setAttribute('width', '56');
            progressSvg.setAttribute('height', '56');
            progressSvg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                transform: rotate(-90deg);
                pointer-events: none;
            `;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '28');
            circle.setAttribute('cy', '28');
            circle.setAttribute('r', '26');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('stroke-dasharray', '163.36'); // 2 * π * 26
            circle.setAttribute('stroke-dashoffset', '163.36');
            circle.setAttribute('stroke-linecap', 'round');
            circle.style.transition = 'stroke-dashoffset 0.1s ease';
            
            progressSvg.appendChild(circle);
            this.button.appendChild(progressSvg);
            this.progressCircle = circle;
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.handleScroll());
            this.button.addEventListener('click', () => this.scrollToTop());
        }

        handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // Calcular progreso del scroll
            this.scrollProgress = Math.min(scrollTop / documentHeight, 1);
            
            // Mostrar/ocultar botón
            const shouldShow = scrollTop > footerConfig.backToTop.showAfter;
            
            if (shouldShow !== this.isVisible) {
                this.isVisible = shouldShow;
                this.toggleVisibility();
            }
            
            // Actualizar indicador de progreso
            this.updateProgress();
        }

        toggleVisibility() {
            if (footerConfig.animations.enabled) {
                this.button.style.transform = this.isVisible 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(20px) scale(0.8)';
                this.button.style.opacity = this.isVisible ? '1' : '0';
                this.button.style.visibility = this.isVisible ? 'visible' : 'hidden';
            } else {
                this.button.style.display = this.isVisible ? 'flex' : 'none';
            }
        }

        updateProgress() {
            if (!this.progressCircle) return;
            
            const circumference = 163.36;
            const offset = circumference * (1 - this.scrollProgress);
            this.progressCircle.style.strokeDashoffset = offset;
        }

        scrollToTop() {
            const startPosition = window.pageYOffset;
            const startTime = performance.now();
            
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / footerConfig.backToTop.scrollDuration, 1);
                
                // Easing function (ease-out)
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, startPosition * (1 - easeProgress));
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        }
    }

    // =========================================================================
    // ANIMACIONES DEL FOOTER
    // =========================================================================
    
    class FooterAnimations {
        constructor() {
            this.footer = document.querySelector('.modern-footer');
            this.animatedElements = [];
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '50px 0px'
            };
            
            this.init();
        }

        init() {
            if (!this.footer || !footerConfig.animations.enabled) return;
            
            this.setupIntersectionObserver();
            this.setupHoverAnimations();
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                    }
                });
            }, this.observerOptions);

            // Observar elementos que se deben animar
            const elementsToObserve = [
                '.footer-brand',
                '.footer-section',
                '.social-links',
                '.newsletter-section',
                '.footer-bottom'
            ];

            elementsToObserve.forEach(selector => {
                const elements = this.footer.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    this.observer.observe(el);
                });
            });
        }

        animateElement(element) {
            let delay = 0;
            
            // Agregar delay basado en el índice del elemento
            const siblings = [...element.parentNode.children];
            const index = siblings.indexOf(element);
            delay = index * 100;

            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);

            this.observer.unobserve(element);
        }

        setupHoverAnimations() {
            // Animaciones para enlaces sociales
            const socialLinks = this.footer.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                link.addEventListener('mouseenter', () => this.animateSocialLink(link, 'enter'));
                link.addEventListener('mouseleave', () => this.animateSocialLink(link, 'leave'));
            });

            // Animaciones para elementos de servicio
            const serviceItems = this.footer.querySelectorAll('.service-item');
            serviceItems.forEach(item => {
                item.addEventListener('mouseenter', () => this.animateServiceItem(item, 'enter'));
                item.addEventListener('mouseleave', () => this.animateServiceItem(item, 'leave'));
            });
        }

        animateSocialLink(link, action) {
            const icon = link.querySelector('i');
            if (!icon) return;

            if (action === 'enter') {
                icon.style.animation = 'socialBounce 0.6s ease';
            } else {
                icon.style.animation = '';
            }
        }

        animateServiceItem(item, action) {
            const icon = item.querySelector('.service-icon');
            if (!icon) return;

            if (action === 'enter') {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    // =========================================================================
    // UTILIDADES DEL FOOTER
    // =========================================================================
    
    class FooterUtils {
        static addCustomStyles() {
            const styles = `
                @keyframes socialBounce {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1) rotate(-5deg); }
                    50% { transform: scale(1.2); }
                    75% { transform: scale(1.1) rotate(5deg); }
                }
                
                .newsletter-input.is-valid {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
                }
                
                .newsletter-input.is-invalid {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
                }
                
                .back-to-top-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .service-icon {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        static initAccessibility() {
            // Mejorar accesibilidad del footer
            const footerLinks = document.querySelectorAll('.footer-link, .social-link, .legal-link');
            
            footerLinks.forEach(link => {
                // Añadir indicación visual para el foco del teclado
                link.addEventListener('focus', function() {
                    this.style.outline = '2px solid #f97316';
                    this.style.outlineOffset = '2px';
                });
                
                link.addEventListener('blur', function() {
                    this.style.outline = '';
                    this.style.outlineOffset = '';
                });
            });

            // Mejorar navegación por teclado
            const floatingBtns = document.querySelectorAll('.floating-btn');
            floatingBtns.forEach(btn => {
                btn.setAttribute('tabindex', '0');
                
                btn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        }

        static logFooterInteraction(action, element) {
            // Función para logging de interacciones (útil para analytics)
            if (window.gtag) {
                window.gtag('event', 'footer_interaction', {
                    action: action,
                    element: element
                });
            }
            
            console.log(`Footer interaction: ${action} on ${element}`);
        }
    }

    // =========================================================================
    // INICIALIZACIÓN
    // =========================================================================
    
    // Aplicar estilos personalizados
    FooterUtils.addCustomStyles();
    
    // Inicializar funcionalidades
    const newsletterManager = new NewsletterManager();
    const backToTopManager = new BackToTopManager();
    const footerAnimations = new FooterAnimations();
    
    // Inicializar accesibilidad
    FooterUtils.initAccessibility();
    
    // Logging de carga completa del footer
    FooterUtils.logFooterInteraction('footer_loaded', 'footer_complete');
    
    // =========================================================================
    // EVENTOS GLOBALES DEL FOOTER
    // =========================================================================
    
    // Tracking de clicks en enlaces del footer
    document.addEventListener('click', function(e) {
        if (e.target.closest('.footer-link')) {
            FooterUtils.logFooterInteraction('link_click', e.target.textContent.trim());
        }
        
        if (e.target.closest('.social-link')) {
            const platform = e.target.closest('.social-link').className.match(/\b(facebook|instagram|twitter|youtube|whatsapp)\b/)?.[1];
            FooterUtils.logFooterInteraction('social_click', platform || 'unknown');
        }
        
        if (e.target.closest('.legal-link')) {
            FooterUtils.logFooterInteraction('legal_click', e.target.textContent.trim());
        }
    });
    
    // Observar cambios en el tema/modo oscuro
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function() {
        // Ajustar estilos si es necesario para modo oscuro
        FooterUtils.logFooterInteraction('theme_change', mediaQuery.matches ? 'dark' : 'light');
    });

});

// =========================================================================
// API PÚBLICA DEL FOOTER
// =========================================================================

window.FooterAPI = {
    /**
     * Suscribir email al newsletter programáticamente
     * @param {string} email - Email a suscribir
     * @returns {Promise} - Promesa con el resultado
     */
    subscribeNewsletter: function(email) {
        const input = document.querySelector('.newsletter-input');
        const form = document.querySelector('.newsletter-form');
        
        if (input && form) {
            input.value = email;
            form.dispatchEvent(new Event('submit'));
        }
    },
    
    /**
     * Mostrar/ocultar botón de volver arriba
     * @param {boolean} show - Si mostrar o no el botón
     */
    toggleBackToTop: function(show) {
        const btn = document.querySelector('.back-to-top-btn');
        if (btn) {
            btn.style.display = show ? 'flex' : 'none';
        }
    },
    
    /**
     * Scroll suave hacia arriba
     */
    scrollToTop: function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    /**
     * Obtener estadísticas del footer
     */
    getStats: function() {
        return {
            newsletterFormExists: !!document.querySelector('.newsletter-form'),
            backToTopExists: !!document.querySelector('.back-to-top-btn'),
            socialLinksCount: document.querySelectorAll('.social-link').length,
            footerLinksCount: document.querySelectorAll('.footer-link').length
        };
    }
};