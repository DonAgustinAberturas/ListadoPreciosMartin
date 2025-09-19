import { switchTab } from './modules/ui.js';
import { loadData, applyFilter, updatePrices } from './modules/dataLoader.js';
import { openModal, closeModal } from './modules/modal.js';

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para los botones de pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Event listeners para los filtros
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    // Cargar datos iniciales de la primera pestaña
    loadData('ventanas');
});

// Event listeners para el modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close');
    
    // Cerrar modal al hacer clic en X
    closeBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Event listeners para productos clickeables
    document.addEventListener('click', function(event) {
        if (event.target.closest('.product-row')) {
            const row = event.target.closest('.product-row');
            const productInfo = JSON.parse(row.getAttribute('data-product-info'));
            openModal(productInfo);
        }
    });
});

// Exponer función para uso externo
window.updatePrices = updatePrices;
