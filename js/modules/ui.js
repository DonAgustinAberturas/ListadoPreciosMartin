import { loadData } from './dataLoader.js';

// Función para cambiar entre pestañas
export function switchTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');
    
    // Activar el botón correspondiente
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Cargar datos de la nueva pestaña
    loadData(tabName);
}

// Función para mostrar la tabla
export function displayTable(data, container, tabName) {
    if (data.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No hay datos disponibles</h3>
                <p>No se encontraron elementos en ${tabName}.</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th style="${data[0].ancho ? 'width: 80px;' : ''}">${data[0].ancho ? 'Ancho' : 'Nombre'}</th>
                    <th style="${data[0].alto ? 'width: 80px;' : ''}">${data[0].alto ? 'Alto' : 'Precio'}</th>
                    ${data[0].modelo ? '<th>Modelo</th>' : ''}
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach((item, index) => {
        tableHTML += `
            <tr class="product-row" data-product-index="${index}" data-product-info='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
                <td class="${item.ancho ? 'ancho-column' : ''}"><strong>${item.ancho || item.nombre}</strong></td>
                <td class="${item.alto ? 'alto-column' : ''}"><strong>${item.alto || item.precio}</strong></td>
                ${item.modelo ? `<td>${item.modelo}</td>` : ''}
                <td class="price">${item.precio}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Función para mostrar estado vacío
export function showEmptyState(container, message) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>Sin filtro seleccionado</h3>
            <p>${message}</p>
        </div>
    `;
}
