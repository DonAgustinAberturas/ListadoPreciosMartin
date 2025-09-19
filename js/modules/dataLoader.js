import { dataFiles } from './config.js';
import { parseData } from './dataParser.js';
import { displayTable, showEmptyState } from './ui.js';

// Variables globales para almacenar datos
let allData = {};

// Función para cargar datos desde archivo TXT
export async function loadData(tabName) {
    const container = document.querySelector(`#${tabName} .table-container`);
    const loading = document.querySelector(`#${tabName} .loading`);
    
    // Mostrar loading
    loading.style.display = 'block';
    container.innerHTML = '';
    
    try {
        let data = [];
        
        if (tabName === 'ventanas') {
            // Cargar todos los archivos de ventanas
            const [response1, response2, response3, response4] = await Promise.all([
                fetch(dataFiles.ventanasCorredizasSimplesVidrioRepartido),
                fetch(dataFiles.ventanasCorredizasSimplesVidrioEntero),
                fetch(dataFiles.ventanasCelosiasCorredizasApliqueBlanco),
                fetch(dataFiles.ventanasVidrioEnteroCelosiaCorredizaBlanco)
            ]);
            
            if (!response1.ok || !response2.ok || !response3.ok || !response4.ok) {
                throw new Error('Error al cargar archivos de ventanas');
            }
            
            const text1 = await response1.text();
            const text2 = await response2.text();
            const text3 = await response3.text();
            const text4 = await response4.text();
            
            const data1 = parseData(text1);
            const data2 = parseData(text2);
            const data3 = parseData(text3);
            const data4 = parseData(text4);
            
            // Agregar descripción a los datos
            data1.forEach(item => item.descripcion = 'Ventanas Corredizas Simples (Alum Blanco) Vidrio Repartido');
            data2.forEach(item => item.descripcion = 'Ventanas Corredizas Simples (Alum Blanco) Vidrio Entero');
            data3.forEach(item => item.descripcion = 'Ventanas con Celosías Corredizas (Aplique Color Blanco)');
            data4.forEach(item => item.descripcion = 'Ventanas Vidrio Entero con Celosía Corrediza (Color Blanco)');
            
            data = [...data1, ...data2, ...data3, ...data4];
        } else if (tabName === 'rejas') {
            // Cargar archivo de rejas
            const response = await fetch(dataFiles.rejasHierroMacizoN10ColorNegro);
            
            if (!response.ok) {
                throw new Error('Error al cargar archivo de rejas');
            }
            
            const text = await response.text();
            const rejasData = parseData(text);
            
            // Agregar descripción a los datos
            rejasData.forEach(item => item.descripcion = 'Rejas de Hierro Macizo Nº 10 (Color Negro)');
            
            data = rejasData;
        } else if (tabName === 'aireadores') {
            // Cargar archivo de aireadores
            const response = await fetch(dataFiles.aireadoresAluminio);
            
            if (!response.ok) {
                throw new Error('Error al cargar archivo de aireadores');
            }
            
            const text = await response.text();
            const aireadoresData = parseData(text);
            
            // Agregar descripción a los datos
            aireadoresData.forEach(item => item.descripcion = 'Aireadores Aluminio');
            
            data = aireadoresData;
        } else if (tabName === 'rajas') {
            // Cargar todos los archivos de rajas
            const [response1, response2] = await Promise.all([
                fetch(dataFiles.rajasVidrioEntero),
                fetch(dataFiles.rajasVidrioRepartido)
            ]);
            
            if (!response1.ok || !response2.ok) {
                throw new Error('Error al cargar archivos de rajas');
            }
            
            const text1 = await response1.text();
            const text2 = await response2.text();
            
            const data1 = parseData(text1);
            const data2 = parseData(text2);
            
            // Agregar descripción a los datos
            data1.forEach(item => item.descripcion = 'Rajas Vidrio Entero');
            data2.forEach(item => item.descripcion = 'Rajas Vidrio Repartido');
            
            data = [...data1, ...data2];
        } else if (tabName === 'mosquiteros') {
            // Cargar archivo de mosquiteros
            const response = await fetch(dataFiles.mosquiteros);
            
            if (!response.ok) {
                throw new Error('Error al cargar archivo de mosquiteros');
            }
            
            const text = await response.text();
            const mosquiterosData = parseData(text);
            
            // Agregar descripción a los datos
            mosquiterosData.forEach(item => item.descripcion = 'Mosquiteros');
            
            data = mosquiterosData;
        } else if (tabName === 'puertas') {
            // Cargar todos los archivos de puertas
            const [response1, response2, response3] = await Promise.all([
                fetch(dataFiles.puertaAluminioTableroAcanalado25mm),
                fetch(dataFiles.puertaAluminioTableroTubular36mm),
                fetch(dataFiles.puertaAluminioMosquitera)
            ]);
            
            if (!response1.ok || !response2.ok || !response3.ok) {
                throw new Error('Error al cargar archivos de puertas');
            }
            
            const text1 = await response1.text();
            const text2 = await response2.text();
            const text3 = await response3.text();
            
            const data1 = parseData(text1);
            const data2 = parseData(text2);
            const data3 = parseData(text3);
            
            // Agregar descripción a los datos
            data1.forEach(item => item.descripcion = 'Puerta Aluminio Tablero Acanalado 25mm');
            data2.forEach(item => item.descripcion = 'Puerta Aluminio Tablero Tubular 36mm');
            data3.forEach(item => item.descripcion = 'Puerta Aluminio Mosquitera');
            
            data = [...data1, ...data2, ...data3];
        } else {
            // Cargar archivo normal
            const response = await fetch(dataFiles[tabName]);
            if (!response.ok) {
                throw new Error(`Error al cargar ${dataFiles[tabName]}`);
            }
            
            const text = await response.text();
            data = parseData(text);
        }
        
        // Guardar todos los datos para filtros
        allData[tabName] = data;
        
        // Verificar si hay un filtro activo y aplicarlo
        const activeFilterButton = document.querySelector(`#${tabName} .filter-button.active`);
        if (activeFilterButton) {
            const filterValue = activeFilterButton.getAttribute('data-filter');
            const filteredData = data.filter(item => item.descripcion === filterValue);
            displayTable(filteredData, container, tabName);
        } else {
            // Si no hay filtro activo, activar el primero disponible
            const firstFilterButton = document.querySelector(`#${tabName} .filter-button`);
            if (firstFilterButton && data.length > 0) {
                firstFilterButton.classList.add('active');
                const filterValue = firstFilterButton.getAttribute('data-filter');
                const filteredData = data.filter(item => item.descripcion === filterValue);
                displayTable(filteredData, container, tabName);
            } else {
                // No mostrar datos si no hay filtro seleccionado
                showEmptyState(container, 'Selecciona un filtro para ver los productos');
            }
        }
        
        // Ocultar loading
        loading.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <h3>Error al cargar datos</h3>
                <p>No se pudo cargar el archivo ${dataFiles[tabName]}</p>
                <p>Verifica que el archivo existe y tiene el formato correcto.</p>
            </div>
        `;
    }
}

// Función para aplicar filtros
export function applyFilter(filterValue) {
    const activeTab = document.querySelector('.tab-pane.active').id;
    const container = document.querySelector(`#${activeTab} .table-container`);
    
    // Verificar si el botón clickeado ya está activo
    const clickedButton = document.querySelector(`[data-filter="${filterValue}"]`);
    const isCurrentlyActive = clickedButton.classList.contains('active');
    
    // Actualizar botones de filtro
    document.querySelectorAll(`#${activeTab} .filter-button`).forEach(button => {
        button.classList.remove('active');
    });
    
    // Si el botón no estaba activo, activarlo
    if (!isCurrentlyActive) {
        clickedButton.classList.add('active');
        
        // Filtrar datos
        let filteredData = allData[activeTab] || [];
        filteredData = filteredData.filter(item => item.descripcion === filterValue);
        
        // Mostrar datos filtrados
        displayTable(filteredData, container, activeTab);
    } else {
        // Si estaba activo, deseleccionar y ocultar tabla
        showEmptyState(container, 'Selecciona un filtro para ver los productos');
    }
}

// Función para actualizar precios (útil para actualizaciones futuras)
export function updatePrices() {
    const activeTab = document.querySelector('.tab-pane.active').id;
    loadData(activeTab);
}
