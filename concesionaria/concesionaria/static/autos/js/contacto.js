/**
 * Contacto JavaScript - AutoVentas Concesionaria
 * Funcionalidad avanzada para el formulario de contacto
 */

// ==========================================================================
// FUNCIONALIDAD PARA PÁGINA DE CONTACTO EXITOSO
// ==========================================================================

// Función para manejar la redirección automática en contacto_exito.html
function initializeContactSuccessRedirect(catalogUrl) {
    // Solo ejecutar en la página de contacto exitoso
    if (window.location.pathname.includes('contacto_exito')) {
        setTimeout(function() {
            const redirect = confirm('¿Te gustaría ver nuestro catálogo de vehículos?');
            if (redirect) {
                window.location.href = catalogUrl;
            }
        }, 10000);
    }
}

// Función para inicialización automática desde template con URL específica
function initializeSuccessPageWithUrl(catalogUrl) {
    document.addEventListener('DOMContentLoaded', function() {
        if (window.AutoVentasContact) {
            window.AutoVentasContact.initSuccessRedirect(catalogUrl);
        }
    });
}

// Función global para ser llamada desde templates
window.AutoVentasContact = {
    initSuccessRedirect: initializeContactSuccessRedirect,
    initSuccessPageWithUrl: initializeSuccessPageWithUrl
};

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================================
    // CONFIGURACIÓN INICIAL
    // =========================================================================
    
    const contactConfig = {
        validation: {
            minNameLength: 2,
            maxNameLength: 100,
            minMessageLength: 10,
            maxMessageLength: 1000,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            nameRegex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
        },
        messages: {
            required: 'Este campo es obligatorio',
            emailInvalid: 'Ingresa un email válido',
            nameInvalid: 'El nombre solo puede contener letras y espacios',
            nameTooShort: 'El nombre debe tener al menos {min} caracteres',
            nameTooLong: 'El nombre no puede exceder {max} caracteres',
            messageTooShort: 'El mensaje debe tener al menos {min} caracteres',
            messageTooLong: 'El mensaje no puede exceder {max} caracteres',
            success: 'Mensaje enviado correctamente',
            error: 'Error al enviar el mensaje. Inténtalo de nuevo.',
            loading: 'Enviando mensaje...'
        },
        animation: {
            enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            duration: 300
        }
    };

    // =========================================================================
    // CLASE PRINCIPAL DEL FORMULARIO DE CONTACTO
    // =========================================================================
    
    class ContactFormManager {
        constructor() {
            this.form = document.querySelector('.contact-form');
            this.submitButton = document.querySelector('.contact-submit-btn');
            this.fields = {};
            this.isSubmitting = false;
            
            this.init();
        }

        init() {
            if (!this.form) return;
            
            this.initializeFields();
            this.setupEventListeners();
            this.setupFormValidation();
            this.addCustomStyles();
        }

        initializeFields() {
            // Inicializar campos del formulario
            this.fields = {
                nombre: {
                    element: this.form.querySelector('#id_nombre'),
                    group: this.form.querySelector('#id_nombre').closest('.contact-input-group'),
                    validators: ['required', 'nameFormat', 'nameLength']
                },
                correo: {
                    element: this.form.querySelector('#id_correo'),
                    group: this.form.querySelector('#id_correo').closest('.contact-input-group'),
                    validators: ['required', 'email']
                },
                mensaje: {
                    element: this.form.querySelector('#id_mensaje'),
                    group: this.form.querySelector('#id_mensaje').closest('.contact-input-group'),
                    validators: ['required', 'messageLength']
                }
            };

            // Agregar clases CSS necesarias
            Object.values(this.fields).forEach(field => {
                if (field.element) {
                    field.element.classList.add('form-control');
                    
                    // Agregar placeholders mejorados
                    this.addPlaceholder(field.element);
                    
                    // Agregar contador de caracteres para textarea
                    if (field.element.tagName === 'TEXTAREA') {
                        this.addCharacterCounter(field);
                    }
                }
            });
        }

        addPlaceholder(element) {
            const placeholders = {
                nombre: 'Escribe tu nombre completo',
                correo: 'ejemplo@correo.com',
                mensaje: 'Cuéntanos cómo podemos ayudarte...'
            };
            
            const fieldName = element.getAttribute('name');
            if (placeholders[fieldName]) {
                element.setAttribute('placeholder', placeholders[fieldName]);
            }
        }

        addCharacterCounter(field) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.innerHTML = '<small class="text-muted">0 / ' + contactConfig.validation.maxMessageLength + ' caracteres</small>';
            
            field.group.appendChild(counter);
            
            field.element.addEventListener('input', () => {
                const length = field.element.value.length;
                const counterText = counter.querySelector('small');
                counterText.textContent = `${length} / ${contactConfig.validation.maxMessageLength} caracteres`;
                
                if (length > contactConfig.validation.maxMessageLength * 0.9) {
                    counterText.classList.add('text-warning');
                } else {
                    counterText.classList.remove('text-warning');
                }
                
                if (length > contactConfig.validation.maxMessageLength) {
                    counterText.classList.add('text-danger');
                    counterText.classList.remove('text-warning');
                } else {
                    counterText.classList.remove('text-danger');
                }
            });
        }

        setupEventListeners() {
            // Validación en tiempo real
            Object.values(this.fields).forEach(field => {
                if (field.element) {
                    field.element.addEventListener('input', () => {
                        this.validateField(field);
                    });
                    
                    field.element.addEventListener('blur', () => {
                        this.validateField(field);
                    });
                    
                    field.element.addEventListener('focus', () => {
                        this.clearFieldErrors(field);
                    });
                }
            });

            // Envío del formulario
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Prevenir doble clic en el botón
            this.submitButton.addEventListener('click', (e) => {
                if (this.isSubmitting) {
                    e.preventDefault();
                }
            });
        }

        setupFormValidation() {
            // Configurar validación nativa del navegador
            this.form.setAttribute('novalidate', 'true');
            
            // Agregar clase para Bootstrap validation
            this.form.classList.add('needs-validation');
        }

        validateField(field) {
            const value = field.element.value.trim();
            const errors = [];

            // Ejecutar validadores
            field.validators.forEach(validator => {
                const error = this.runValidator(validator, value, field);
                if (error) {
                    errors.push(error);
                }
            });

            // Mostrar resultado de validación
            if (errors.length > 0) {
                this.showFieldError(field, errors[0]);
                return false;
            } else {
                this.showFieldSuccess(field);
                return true;
            }
        }

        runValidator(validator, value, field) {
            const validators = {
                required: () => {
                    if (!value) {
                        return contactConfig.messages.required;
                    }
                },
                
                email: () => {
                    if (value && !contactConfig.validation.emailRegex.test(value)) {
                        return contactConfig.messages.emailInvalid;
                    }
                },
                
                nameFormat: () => {
                    if (value && !contactConfig.validation.nameRegex.test(value)) {
                        return contactConfig.messages.nameInvalid;
                    }
                },
                
                nameLength: () => {
                    if (value.length < contactConfig.validation.minNameLength) {
                        return contactConfig.messages.nameTooShort.replace('{min}', contactConfig.validation.minNameLength);
                    }
                    if (value.length > contactConfig.validation.maxNameLength) {
                        return contactConfig.messages.nameTooLong.replace('{max}', contactConfig.validation.maxNameLength);
                    }
                },
                
                messageLength: () => {
                    if (value.length < contactConfig.validation.minMessageLength) {
                        return contactConfig.messages.messageTooShort.replace('{min}', contactConfig.validation.minMessageLength);
                    }
                    if (value.length > contactConfig.validation.maxMessageLength) {
                        return contactConfig.messages.messageTooLong.replace('{max}', contactConfig.validation.maxMessageLength);
                    }
                }
            };

            return validators[validator] ? validators[validator]() : null;
        }

        showFieldError(field, message) {
            field.element.classList.remove('is-valid');
            field.element.classList.add('is-invalid');
            field.group.classList.remove('valid');
            field.group.classList.add('invalid');
            
            // Remover mensaje anterior
            this.removeFieldMessage(field);
            
            // Agregar nuevo mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'contact-error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            
            field.group.appendChild(errorDiv);
            
            // Animación si está habilitada
            if (contactConfig.animation.enabled) {
                errorDiv.style.opacity = '0';
                errorDiv.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    errorDiv.style.transition = 'all 0.3s ease';
                    errorDiv.style.opacity = '1';
                    errorDiv.style.transform = 'translateY(0)';
                }, 10);
            }
        }

        showFieldSuccess(field) {
            field.element.classList.remove('is-invalid');
            field.element.classList.add('is-valid');
            field.group.classList.remove('invalid');
            field.group.classList.add('valid');
            
            // Remover mensajes de error
            this.removeFieldMessage(field);
        }

        clearFieldErrors(field) {
            field.element.classList.remove('is-invalid');
            field.group.classList.remove('invalid');
            this.removeFieldMessage(field);
        }

        removeFieldMessage(field) {
            const existingMessage = field.group.querySelector('.contact-error-message, .contact-success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        }

        validateForm() {
            let isValid = true;
            
            Object.values(this.fields).forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        async handleSubmit() {
            if (this.isSubmitting) return;
            
            // Validar formulario
            if (!this.validateForm()) {
                this.showFormError('Por favor, corrige los errores antes de continuar.');
                this.focusFirstError();
                return;
            }

            this.isSubmitting = true;
            this.setLoadingState(true);

            try {
                // Simular envío del formulario (reemplazar con llamada real)
                await this.submitForm();
                this.handleSubmitSuccess();
            } catch (error) {
                this.handleSubmitError(error);
            } finally {
                this.isSubmitting = false;
                this.setLoadingState(false);
            }
        }

        async submitForm() {
            // Preparar datos del formulario
            const formData = new FormData(this.form);
            
            // Simulación de envío (reemplazar con código real)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simular diferentes respuestas
                    const email = formData.get('correo');
                    if (email.includes('error@')) {
                        reject(new Error('Error de servidor'));
                    } else {
                        resolve({ success: true });
                    }
                }, 2000);
            });

            /* Código para implementación real:
            try {
                const response = await fetch(this.form.action || window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                throw error;
            }
            */
        }

        handleSubmitSuccess() {
            this.showFormSuccess(contactConfig.messages.success);
            
            // Limpiar formulario después de un breve delay
            setTimeout(() => {
                this.resetForm();
            }, 2000);

            // Mostrar notificación si está disponible
            if (typeof showToast === 'function') {
                showToast(contactConfig.messages.success, 'success');
            }

            // Tracking de éxito
            this.trackEvent('contact_form_success');
        }

        handleSubmitError(error) {
            console.error('Error al enviar formulario:', error);
            
            const errorMessage = error.message.includes('servidor') 
                ? 'Error en el servidor. Inténtalo más tarde.'
                : contactConfig.messages.error;
                
            this.showFormError(errorMessage);

            // Mostrar notificación si está disponible
            if (typeof showToast === 'function') {
                showToast(errorMessage, 'error');
            }

            // Tracking de error
            this.trackEvent('contact_form_error', { error: error.message });
        }

        setLoadingState(loading) {
            if (loading) {
                this.submitButton.classList.add('loading');
                this.submitButton.disabled = true;
                
                // Agregar spinner si no existe
                if (!this.submitButton.querySelector('.spinner')) {
                    const spinner = document.createElement('div');
                    spinner.className = 'spinner';
                    this.submitButton.appendChild(spinner);
                }
                
                // Cambiar texto del botón
                const btnText = this.submitButton.querySelector('.btn-text') || this.submitButton;
                if (!this.submitButton.querySelector('.btn-text')) {
                    btnText.innerHTML = `<span class="btn-text">${btnText.innerHTML}</span>`;
                }
                
            } else {
                this.submitButton.classList.remove('loading');
                this.submitButton.disabled = false;
                
                // Remover spinner
                const spinner = this.submitButton.querySelector('.spinner');
                if (spinner) {
                    spinner.remove();
                }
            }
        }

        showFormSuccess(message) {
            this.removeFormMessages();
            
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success contact-form-message';
            successDiv.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                ${message}
            `;
            
            this.form.parentNode.insertBefore(successDiv, this.form);
            
            // Auto-remove después de 5 segundos
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
        }

        showFormError(message) {
            this.removeFormMessages();
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger contact-form-message';
            errorDiv.innerHTML = `
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            `;
            
            this.form.parentNode.insertBefore(errorDiv, this.form);
            
            // Auto-remove después de 7 segundos
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 7000);
        }

        removeFormMessages() {
            const messages = document.querySelectorAll('.contact-form-message');
            messages.forEach(message => message.remove());
        }

        focusFirstError() {
            const firstError = this.form.querySelector('.is-invalid');
            if (firstError) {
                firstError.focus();
                
                // Scroll suave al campo con error
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        resetForm() {
            this.form.reset();
            
            // Limpiar estados de validación
            Object.values(this.fields).forEach(field => {
                field.element.classList.remove('is-valid', 'is-invalid');
                field.group.classList.remove('valid', 'invalid');
                this.removeFieldMessage(field);
            });
            
            // Resetear contador de caracteres
            const counter = this.form.querySelector('.character-counter small');
            if (counter) {
                counter.textContent = `0 / ${contactConfig.validation.maxMessageLength} caracteres`;
                counter.className = 'text-muted';
            }
            
            this.removeFormMessages();
        }

        trackEvent(eventName, data = {}) {
            // Google Analytics o tracking personalizado
            if (typeof gtag === 'function') {
                gtag('event', eventName, data);
            }
            
            console.log(`Contact Form Event: ${eventName}`, data);
        }

        addCustomStyles() {
            const styles = `
                .contact-form-message {
                    border-radius: 12px;
                    border: none;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1.5rem;
                    animation: slideInDown 0.3s ease-out;
                }
                
                .character-counter {
                    text-align: right;
                    margin-top: 0.25rem;
                }
                
                .character-counter small {
                    transition: color 0.3s ease;
                }
                
                .contact-input-group .form-control:focus + .character-counter small {
                    color: var(--contact-primary) !important;
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    // =========================================================================
    // ANIMACIONES DE LA PÁGINA
    // =========================================================================
    
    class ContactAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.contact-info-card, .contact-main-card');
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.init();
        }

        init() {
            if (!contactConfig.animation.enabled) return;
            
            this.setupIntersectionObserver();
            this.setupHoverEffects();
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                this.observer.observe(el);
            });
        }

        animateElement(element) {
            const delay = Array.from(this.elements).indexOf(element) * 100;
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }

        setupHoverEffects() {
            const infoCards = document.querySelectorAll('.contact-info-card');
            
            infoCards.forEach(card => {
                const icon = card.querySelector('.contact-info-icon');
                
                card.addEventListener('mouseenter', () => {
                    if (icon) {
                        icon.style.transform = 'scale(1.1) rotate(5deg)';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                });
            });
        }
    }

    // =========================================================================
    // UTILIDADES
    // =========================================================================
    
    class ContactUtils {
        static addAccessibilityFeatures() {
            // Mejorar accesibilidad
            const form = document.querySelector('.contact-form');
            if (form) {
                form.setAttribute('aria-label', 'Formulario de contacto');
                
                // Agregar descripciones ARIA
                const fields = form.querySelectorAll('.form-control');
                fields.forEach(field => {
                    const label = form.querySelector(`label[for="${field.id}"]`);
                    if (label) {
                        field.setAttribute('aria-describedby', field.id + '-desc');
                    }
                });
            }

            // Mejorar navegación por teclado
            const submitBtn = document.querySelector('.contact-submit-btn');
            if (submitBtn) {
                submitBtn.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        }

        static initializeTooltips() {
            // Inicializar tooltips si Bootstrap está disponible
            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                tooltips.forEach(tooltip => {
                    new bootstrap.Tooltip(tooltip);
                });
            }
        }

        static setupKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Ctrl/Cmd + Enter para enviar formulario
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    const form = document.querySelector('.contact-form');
                    if (form && document.activeElement.closest('.contact-form')) {
                        e.preventDefault();
                        form.dispatchEvent(new Event('submit'));
                    }
                }
                
                // Escape para limpiar formulario
                if (e.key === 'Escape') {
                    const activeField = document.activeElement;
                    if (activeField && activeField.closest('.contact-form')) {
                        activeField.blur();
                    }
                }
            });
        }
    }

    // =========================================================================
    // INICIALIZACIÓN
    // =========================================================================
    
    // Inicializar componentes
    const contactForm = new ContactFormManager();
    const contactAnimations = new ContactAnimations();
    
    // Configurar utilidades
    ContactUtils.addAccessibilityFeatures();
    ContactUtils.initializeTooltips();
    ContactUtils.setupKeyboardShortcuts();
    
    // Logging de inicialización
    console.log('Contact form initialized successfully');

    // =========================================================================
    // API PÚBLICA
    // =========================================================================
    
    window.ContactAPI = {
        /**
         * Validar formulario programáticamente
         */
        validateForm: function() {
            return contactForm ? contactForm.validateForm() : false;
        },
        
        /**
         * Resetear formulario
         */
        resetForm: function() {
            if (contactForm) {
                contactForm.resetForm();
            }
        },
        
        /**
         * Llenar campos del formulario
         */
        fillForm: function(data) {
            if (contactForm && data) {
                Object.keys(data).forEach(key => {
                    const field = contactForm.fields[key];
                    if (field && field.element) {
                        field.element.value = data[key];
                        contactForm.validateField(field);
                    }
                });
            }
        },
        
        /**
         * Obtener datos del formulario
         */
        getFormData: function() {
            const form = document.querySelector('.contact-form');
            if (form) {
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                return data;
            }
            return null;
        }
    };

});

// =========================================================================
// FUNCIONES GLOBALES
// =========================================================================

/**
 * Función para pre-llenar el formulario desde enlaces externos
 */
function preloadContactForm(data) {
    if (window.ContactAPI) {
        window.ContactAPI.fillForm(data);
    } else {
        // Si el API no está listo, esperar y reintentar
        setTimeout(() => preloadContactForm(data), 500);
    }
}

/**
 * Función para integración con otros componentes
 */
function openContactForm(prefillData = {}) {
    // Scroll al formulario
    const form = document.querySelector('.contact-main-card');
    if (form) {
        form.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Pre-llenar datos si se proporcionan
        if (Object.keys(prefillData).length > 0) {
            setTimeout(() => {
                preloadContactForm(prefillData);
            }, 500);
        }
    }
}