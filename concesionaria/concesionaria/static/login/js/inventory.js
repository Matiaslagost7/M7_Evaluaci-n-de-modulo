/**
 * JavaScript para Gestión de Inventario
 * Concesionaria AutoVentas - Panel de Administración
 */

// ==========================================================================
// FUNCIONES DEL INVENTARIO
// ==========================================================================

// Funcionalidad de búsqueda de vehículos
function initializeVehicleSearch() {
    const searchInput = document.getElementById('searchVehicle');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.vehicle-row');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Inicializar tooltips de Bootstrap para inventario
function initializeInventoryTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Inicializar funciones del inventario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeVehicleSearch();
    initializeInventoryTooltips();
});

// ==========================================================================
// FUNCIONES DE AUTENTICACIÓN (LEGACY)
// ==========================================================================

// Manejo de formularios de autenticación
const AuthHandler = {
    // Validar formulario de login
    validateLoginForm: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const username = form.querySelector('[name="username"]');
        const password = form.querySelector('[name="password"]');

        // Validar usuario
        if (!username.value.trim()) {
            AuthHandler.showFieldError(username, 'El nombre de usuario es obligatorio');
            isValid = false;
        } else if (username.value.length < 3) {
            AuthHandler.showFieldError(username, 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            AuthHandler.clearFieldError(username);
        }

        // Validar contraseña
        if (!password.value) {
            AuthHandler.showFieldError(password, 'La contraseña es obligatoria');
            isValid = false;
        } else if (password.value.length < 6) {
            AuthHandler.showFieldError(password, 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else {
            AuthHandler.clearFieldError(password);
        }

        return isValid;
    },

    // Validar formulario de registro
    validateRegisterForm: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const username = form.querySelector('[name="username"]');
        const email = form.querySelector('[name="email"]');
        const password1 = form.querySelector('[name="password1"]');
        const password2 = form.querySelector('[name="password2"]');
        const firstName = form.querySelector('[name="first_name"]');
        const lastName = form.querySelector('[name="last_name"]');

        // Validar nombre
        if (firstName && !firstName.value.trim()) {
            AuthHandler.showFieldError(firstName, 'El nombre es obligatorio');
            isValid = false;
        } else if (firstName) {
            AuthHandler.clearFieldError(firstName);
        }

        // Validar apellido
        if (lastName && !lastName.value.trim()) {
            AuthHandler.showFieldError(lastName, 'El apellido es obligatorio');
            isValid = false;
        } else if (lastName) {
            AuthHandler.clearFieldError(lastName);
        }

        // Validar usuario
        if (!username.value.trim()) {
            AuthHandler.showFieldError(username, 'El nombre de usuario es obligatorio');
            isValid = false;
        } else if (username.value.length < 3) {
            AuthHandler.showFieldError(username, 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
            AuthHandler.showFieldError(username, 'El usuario solo puede contener letras, números y guiones bajos');
            isValid = false;
        } else {
            AuthHandler.clearFieldError(username);
        }

        // Validar email
        if (email && !email.value.trim()) {
            AuthHandler.showFieldError(email, 'El email es obligatorio');
            isValid = false;
        } else if (email && !AuthHandler.isValidEmail(email.value)) {
            AuthHandler.showFieldError(email, 'Ingrese un email válido');
            isValid = false;
        } else if (email) {
            AuthHandler.clearFieldError(email);
        }

        // Validar contraseña
        if (!password1.value) {
            AuthHandler.showFieldError(password1, 'La contraseña es obligatoria');
            isValid = false;
        } else if (password1.value.length < 8) {
            AuthHandler.showFieldError(password1, 'La contraseña debe tener al menos 8 caracteres');
            isValid = false;
        } else if (!AuthHandler.isStrongPassword(password1.value)) {
            AuthHandler.showFieldError(password1, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');
            isValid = false;
        } else {
            AuthHandler.clearFieldError(password1);
        }

        // Validar confirmación de contraseña
        if (!password2.value) {
            AuthHandler.showFieldError(password2, 'Confirme su contraseña');
            isValid = false;
        } else if (password1.value !== password2.value) {
            AuthHandler.showFieldError(password2, 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            AuthHandler.clearFieldError(password2);
        }

        return isValid;
    },

    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar fortaleza de contraseña
    isStrongPassword: (password) => {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return hasUpper && hasLower && hasNumber;
    },

    // Mostrar error en campo
    showFieldError: (field, message) => {
        field.classList.add('is-invalid');
        
        // Remover error anterior
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Agregar nuevo error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    },

    // Limpiar error de campo
    clearFieldError: (field) => {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    // Mostrar/ocultar contraseña
    togglePassword: (inputId, toggleId) => {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (input && toggle) {
            toggle.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    this.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        }
    },

    // Verificar fuerza de contraseña en tiempo real
    setupPasswordStrength: (passwordId, strengthId) => {
        const passwordInput = document.getElementById(passwordId);
        const strengthMeter = document.getElementById(strengthId);
        
        if (passwordInput && strengthMeter) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strength = AuthHandler.calculatePasswordStrength(password);
                
                strengthMeter.className = `password-strength strength-${strength.level}`;
                strengthMeter.textContent = strength.text;
                
                // Mostrar indicadores
                const indicators = strengthMeter.parentNode.querySelector('.strength-indicators');
                if (indicators) {
                    AuthHandler.updateStrengthIndicators(indicators, password);
                }
            });
        }
    },

    // Calcular fuerza de contraseña
    calculatePasswordStrength: (password) => {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;
        
        if (score < 3) return { level: 'weak', text: 'Débil' };
        if (score < 5) return { level: 'medium', text: 'Media' };
        return { level: 'strong', text: 'Fuerte' };
    },

    // Actualizar indicadores de fuerza
    updateStrengthIndicators: (container, password) => {
        const requirements = [
            { test: password.length >= 8, text: 'Mínimo 8 caracteres' },
            { test: /[a-z]/.test(password), text: 'Una minúscula' },
            { test: /[A-Z]/.test(password), text: 'Una mayúscula' },
            { test: /\d/.test(password), text: 'Un número' },
            { test: /[^a-zA-Z\d]/.test(password), text: 'Un carácter especial' }
        ];
        
        container.innerHTML = '';
        requirements.forEach(req => {
            const indicator = document.createElement('div');
            indicator.className = `strength-requirement ${req.test ? 'met' : 'unmet'}`;
            indicator.innerHTML = `
                <i class="fas ${req.test ? 'fa-check' : 'fa-times'}"></i>
                ${req.text}
            `;
            container.appendChild(indicator);
        });
    }
};

// Manejo de sesión
const SessionHandler = {
    // Configurar timeout de sesión
    setupSessionTimeout: (timeoutMinutes = 30) => {
        let timeoutId;
        let warningId;
        
        const resetTimer = () => {
            clearTimeout(timeoutId);
            clearTimeout(warningId);
            
            // Advertencia 5 minutos antes
            warningId = setTimeout(() => {
                SessionHandler.showSessionWarning();
            }, (timeoutMinutes - 5) * 60 * 1000);
            
            // Logout automático
            timeoutId = setTimeout(() => {
                SessionHandler.autoLogout();
            }, timeoutMinutes * 60 * 1000);
        };
        
        // Resetear timer en actividad
        document.addEventListener('click', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('scroll', resetTimer);
        
        resetTimer(); // Inicializar
    },
    
    // Mostrar advertencia de sesión
    showSessionWarning: () => {
        const warning = document.createElement('div');
        warning.className = 'session-warning alert alert-warning position-fixed';
        warning.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        warning.innerHTML = `
            <h6><i class="fas fa-clock"></i> Sesión por expirar</h6>
            <p>Su sesión expirará en 5 minutos por inactividad.</p>
            <button class="btn btn-sm btn-warning" onclick="SessionHandler.extendSession()">
                Extender sesión
            </button>
        `;
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 10000);
    },
    
    // Extender sesión
    extendSession: () => {
        // Hacer petición AJAX para mantener sesión
        fetch('/panel/extend-session/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => {
            if (response.ok) {
                SessionHandler.setupSessionTimeout(); // Reiniciar timer
                
                // Mostrar confirmación
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed';
                notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
                notification.textContent = 'Sesión extendida exitosamente';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error extendiendo sesión:', error);
        });
    },
    
    // Logout automático
    autoLogout: () => {
        alert('Su sesión ha expirado por inactividad. Será redirigido al login.');
        window.location.href = '/panel/login/';
    }
};

// Utilidades de UI
const UIUtils = {
    // Mostrar loading en botón
    showButtonLoading: (button, text = 'Procesando...') => {
        if (typeof button === 'string') {
            button = document.getElementById(button);
        }
        if (button) {
            button.dataset.originalText = button.textContent;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            button.disabled = true;
        }
    },
    
    // Ocultar loading en botón
    hideButtonLoading: (button) => {
        if (typeof button === 'string') {
            button = document.getElementById(button);
        }
        if (button && button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
            button.disabled = false;
        }
    },
    
    // Animación de aparición
    fadeIn: (element, duration = 300) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                element.style.opacity = Math.min(progress / duration, 1);
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar validación de formularios
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (!AuthHandler.validateLoginForm('loginForm')) {
                e.preventDefault();
            } else {
                UIUtils.showButtonLoading(this.querySelector('[type="submit"]'), 'Iniciando sesión...');
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            if (!AuthHandler.validateRegisterForm('registerForm')) {
                e.preventDefault();
            } else {
                UIUtils.showButtonLoading(this.querySelector('[type="submit"]'), 'Registrando...');
            }
        });
    }
    
    // Configurar mostrar/ocultar contraseña
    const toggleButtons = document.querySelectorAll('[data-toggle-password]');
    toggleButtons.forEach(button => {
        const targetId = button.dataset.togglePassword;
        button.addEventListener('click', function() {
            AuthHandler.togglePassword(targetId, this.id);
        });
    });
    
    // Configurar medidor de fuerza de contraseña
    const strengthMeters = document.querySelectorAll('[data-password-strength]');
    strengthMeters.forEach(meter => {
        const passwordId = meter.dataset.passwordStrength;
        AuthHandler.setupPasswordStrength(passwordId, meter.id);
    });
    
    // Configurar timeout de sesión si el usuario está logueado
    if (document.body.classList.contains('logged-in')) {
        SessionHandler.setupSessionTimeout();
    }
    
    // Animaciones de entrada
    const cards = document.querySelectorAll('.auth-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            UIUtils.fadeIn(card);
        }, index * 100);
    });
});

// Exportar funciones globalmente
window.AuthHandler = AuthHandler;
window.SessionHandler = SessionHandler;
window.UIUtils = UIUtils;
