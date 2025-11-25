/**
 * JavaScript para Formularios Administrativos
 * Concesionaria AutoVentas
 */

// ==========================================================================
// FUNCIONES DEL PANEL DE ADMINISTRACIÓN
// ==========================================================================

// Funcionalidad de búsqueda de usuarios
function initializeUserSearch() {
    const searchInput = document.getElementById('searchUser');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.user-row');
            
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

// Inicializar tooltips de Bootstrap
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Inicializar funciones del panel de admin cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeUserSearch();
    initializeTooltips();
});

// ==========================================================================
// UTILIDADES GENERALES
// ==========================================================================

// Utilidades generales
const AdminUtils = {
    // Mostrar/ocultar elementos
    show: (element) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.style.display = 'block';
            element.classList.remove('d-none');
        }
    },

    hide: (element) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.style.display = 'none';
            element.classList.add('d-none');
        }
    },

    // Alternar visibilidad
    toggle: (element) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            if (element.style.display === 'none' || element.classList.contains('d-none')) {
                AdminUtils.show(element);
            } else {
                AdminUtils.hide(element);
            }
        }
    },

    // Mostrar notificación
    showNotification: (message, type = 'info', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        
        notification.innerHTML = `
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    },

    // Confirmar acción
    confirm: (message, callback) => {
        if (confirm(message)) {
            callback();
        }
    },

    // Formatear números
    formatNumber: (number) => {
        return new Intl.NumberFormat('es-ES').format(number);
    },

    // Formatear precio
    formatPrice: (price) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
};

// Manejo de formularios
const FormHandler = {
    // Validar formulario
    validateForm: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                FormHandler.showFieldError(input, 'Este campo es obligatorio');
                isValid = false;
            } else {
                FormHandler.clearFieldError(input);
            }
        });

        return isValid;
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

    // Limpiar todos los errores
    clearAllErrors: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const invalidInputs = form.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => {
            FormHandler.clearFieldError(input);
        });
    },

    // Enviar formulario con AJAX
    submitForm: (formId, successCallback, errorCallback) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const formData = new FormData(form);
        const submitButton = form.querySelector('[type="submit"]');
        
        // Mostrar loading
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }

        fetch(form.action || window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (successCallback) successCallback(data);
                AdminUtils.showNotification(data.message || 'Operación exitosa', 'success');
            } else {
                if (errorCallback) errorCallback(data);
                AdminUtils.showNotification(data.message || 'Error en la operación', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (errorCallback) errorCallback(error);
            AdminUtils.showNotification('Error de conexión', 'danger');
        })
        .finally(() => {
            // Ocultar loading
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        });
    }
};

// Manejo de imágenes
const ImageHandler = {
    // Preview de imagen
    setupImagePreview: (inputId, previewId) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (input && preview) {
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    preview.style.display = 'none';
                }
            });
        }
    },

    // Validar imagen
    validateImage: (file, maxSize = 5 * 1024 * 1024) => { // 5MB por defecto
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        if (!validTypes.includes(file.type)) {
            return { valid: false, message: 'Formato de imagen no válido. Use JPG, PNG o WEBP.' };
        }
        
        if (file.size > maxSize) {
            return { valid: false, message: `La imagen es muy grande. Tamaño máximo: ${maxSize / 1024 / 1024}MB` };
        }
        
        return { valid: true };
    }
};

// Manejo de tablas
const TableHandler = {
    // Buscar en tabla
    setupTableSearch: (searchInputId, tableId) => {
        const searchInput = document.getElementById(searchInputId);
        const table = document.getElementById(tableId);
        
        if (searchInput && table) {
            searchInput.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
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
    },

    // Ordenar tabla
    setupTableSort: (tableId) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        const headers = table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const sortBy = this.dataset.sort;
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                const sortedRows = rows.sort((a, b) => {
                    const aVal = a.querySelector(`[data-sort="${sortBy}"]`).textContent;
                    const bVal = b.querySelector(`[data-sort="${sortBy}"]`).textContent;
                    return aVal.localeCompare(bVal);
                });
                
                tbody.innerHTML = '';
                sortedRows.forEach(row => tbody.appendChild(row));
            });
        });
    }
};

// Manejo de confirmaciones
const ConfirmationHandler = {
    // Confirmar eliminación
    setupDeleteConfirmation: () => {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                e.preventDefault();
                
                const button = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
                const itemName = button.dataset.itemName || 'este elemento';
                
                AdminUtils.confirm(
                    `¿Está seguro de que desea eliminar ${itemName}? Esta acción no se puede deshacer.`,
                    () => {
                        if (button.tagName === 'A') {
                            window.location.href = button.href;
                        } else if (button.form) {
                            button.form.submit();
                        }
                    }
                );
            }
        });
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar confirmaciones de eliminación
    ConfirmationHandler.setupDeleteConfirmation();
    
    // Configurar preview de imágenes automáticamente
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    imageInputs.forEach((input, index) => {
        const previewId = `preview_${input.id || index}`;
        let preview = document.getElementById(previewId);
        
        if (!preview) {
            preview = document.createElement('img');
            preview.id = previewId;
            preview.className = 'img-thumbnail mt-2';
            preview.style.maxWidth = '200px';
            preview.style.display = 'none';
            input.parentNode.appendChild(preview);
        }
        
        ImageHandler.setupImagePreview(input.id || `input_${index}`, previewId);
    });
    
    // Configurar validación en tiempo real
    const forms = document.querySelectorAll('form[data-validate="true"]');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    FormHandler.showFieldError(this, 'Este campo es obligatorio');
                } else {
                    FormHandler.clearFieldError(this);
                }
            });
        });
    });
    
    // Configurar búsqueda en tablas automáticamente
    const searchInputs = document.querySelectorAll('[data-table-search]');
    searchInputs.forEach(input => {
        const tableId = input.dataset.tableSearch;
        TableHandler.setupTableSearch(input.id, tableId);
    });
    
    // Mostrar notificación si hay mensajes de Django
    const djangoMessages = document.querySelectorAll('.django-message');
    djangoMessages.forEach(message => {
        const type = message.dataset.type || 'info';
        const text = message.textContent;
        AdminUtils.showNotification(text, type);
        message.remove();
    });
});

// Exportar funciones globalmente
window.AdminUtils = AdminUtils;
window.FormHandler = FormHandler;
window.ImageHandler = ImageHandler;
window.TableHandler = TableHandler;
window.ConfirmationHandler = ConfirmationHandler;
