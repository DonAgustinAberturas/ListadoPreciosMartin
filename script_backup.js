// Configuración de archivos de datos
const dataFiles = {
    especiales: 'especiales.txt',
    ventanasCorredizasSimplesVidrioRepartido: 'Productos/Ventanas/ventanas_corredizas_simples_VidrioRepartido.txt',
    ventanasCorredizasSimplesVidrioEntero: 'Productos/Ventanas/ventanas_corredizas_simples_VidrioEntero.txt',
    ventanasCelosiasCorredizasApliqueBlanco: 'Productos/Ventanas/ventanas_celosias_corredizas_aplique_blanco.txt',
    ventanasVidrioEnteroCelosiaCorredizaBlanco: 'Productos/Ventanas/ventanas_vidrio_entero_celosia_corrediza_blanco.txt',
    rejasHierroMacizoN10ColorNegro: 'Productos/Rejas/rejas_hierro_macizo_n10_color_negro.txt',
    mosquiteros: 'Productos/Mosquiteros/mosquiteros.txt',
    rajasVidrioEntero: 'Productos/Rajas/rajas_vidrio_entero.txt',
    rajasVidrioRepartido: 'Productos/Rajas/rajas_vidrio_repartido.txt',
    aireadoresAluminio: 'Productos/aireadores/aireadores_aluminio.txt',
    puertaAluminioTableroAcanalado25mm: 'Productos/Puertas/puerta_aluminio_tablero_acanalado_25mm.txt',
    puertaAluminioTableroTubular36mm: 'Productos/Puertas/puerta_aluminio_tablero_tubular_36mm.txt',
    puertaAluminioMosquitera: 'Productos/Puertas/puerta_aluminio_mosquitera.txt'
};

// Función para cambiar entre pestañas
function switchTab(tabName) {
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
    
    // Cargar datos si no se han cargado antes
    loadData(tabName);
}



// Función para parsear los datos del archivo TXT
function parseData(text) {
    const lines = text.trim().split('\n');
    const data = [];
    
    // Saltar la primera línea si es un encabezado
    const startIndex = lines[0].includes('|') ? 0 : 1;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            // Separar por | o por comas
            const parts = line.includes('|') ? 
                line.split('|').map(part => part.trim()) : 
                line.split(',').map(part => part.trim());
            
            if (parts.length >= 2) {
                // Si el primer campo contiene 'x', es el formato antiguo (nombre con dimensiones)
                if (parts[0].includes('x')) {
                    data.push({
                        nombre: parts[0],
                        precio: parts[1],
                        descripcion: parts[2] || '',
                        categoria: parts[3] || ''
                    });
                } else {
                    // Nuevo formato con columnas separadas
                    if (parts.length >= 4) {
                        // Formato con modelo (4 columnas)
                        data.push({
                            ancho: parts[0],
                            alto: parts[1],
                            modelo: parts[2],
                            precio: parts[3] || '',
                            descripcion: parts[4] || '',
                            categoria: parts[5] || ''
                        });
                    } else {
                        // Formato sin modelo (3 columnas)
                        data.push({
                            ancho: parts[0],
                            alto: parts[1],
                            precio: parts[2] || '',
                            descripcion: parts[3] || '',
                            categoria: parts[4] || ''
                        });
                    }
                }
            }
        }
    }
    
    return data;
}

// Función para mostrar la tabla
function displayTable(data, container, tabName) {
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
function showEmptyState(container, message) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>Sin filtro seleccionado</h3>
            <p>${message}</p>
        </div>
    `;
}

// Variables globales para almacenar datos
let allData = {};

// Función para aplicar filtros
function applyFilter(filterValue) {
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



// Función para cargar datos desde archivo TXT
async function loadData(tabName) {
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
            // No mostrar datos si no hay filtro seleccionado
            showEmptyState(container, 'Selecciona un filtro para ver los productos');
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

// Función para actualizar precios (útil para actualizaciones futuras)
function updatePrices() {
    const activeTab = document.querySelector('.tab-pane.active').id;
    loadData(activeTab);
}

// Funciones del modal
function openModal(productInfo) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    
    // Generar imagen de placeholder basada en el tipo de producto
    const imageUrl = generateProductImage(productInfo);
    
    // Configurar contenido del modal
    modalImage.src = imageUrl;
    modalImage.alt = `Imagen de ${productInfo.descripcion || 'producto'}`;
    
    // Título del producto
    const title = productInfo.nombre || `${productInfo.ancho || ''} x ${productInfo.alto || ''}`;
    modalTitle.textContent = title;
    
    // Descripción
    modalDescription.textContent = productInfo.descripcion || 'Producto de calidad';
    
    // Precio
    modalPrice.textContent = `Precio: ${productInfo.precio || 'Consultar'}`;
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

function generateProductImage(productInfo) {
    console.log('ProductInfo:', productInfo); // Debug
    
    // Para ventanas: mostrar imagen según el tipo específico
    if (productInfo.descripcion && productInfo.descripcion.toLowerCase().includes('ventana')) {
        const descripcion = productInfo.descripcion.toLowerCase();
        
        if (descripcion.includes('corredizas simples') && descripcion.includes('vidrio repartido')) {
            return 'Imagenes/ventanavidriorepartido.webp';
        } else if (descripcion.includes('corredizas simples') && descripcion.includes('vidrio entero')) {
            return 'Imagenes/vidrioentero.jpg';
        } else if (descripcion.includes('celosías corredizas') && descripcion.includes('aplique')) {
            return 'Imagenes/celosiacorrediza.jpg';
        } else if (descripcion.includes('vidrio entero') && descripcion.includes('celosía corrediza')) {
            return 'Imagenes/celosiacorrediza.jpg';
        } else {
            // Fallback para ventanas genéricas
            return 'Imagenes/ventana.jpg';
        }
    }
    
    // Para puertas: mostrar imagen según el tipo específico de puerta
    if (productInfo.descripcion && productInfo.descripcion.toLowerCase().includes('puerta')) {
        const descripcion = productInfo.descripcion.toLowerCase();
        const modelo = productInfo.modelo || '';
        const ancho = productInfo.ancho || '';
        const alto = productInfo.alto || '';
        
        // Determinar imagen según el tipo específico de puerta
        let baseImage = '';
        let tipoPuerta = '';
        
        // Detectar tipo de puerta según el modelo
        const modeloLower = modelo.toLowerCase();
        
        if (descripcion.includes('tablero acanalado')) {
            // Puertas de Tablero Acanalado 25mm
            if (modeloLower.includes('1/4 vidrio') || modeloLower.includes('pl1')) {
                baseImage = 'Imagenes/puerta_1_4_vidrio.jpg';
                tipoPuerta = '1/4 Vidrio Stipol';
            } else if (modeloLower.includes('ciega') || modeloLower.includes('pl2')) {
                baseImage = 'Imagenes/puerta_ciega.jpg';
                tipoPuerta = 'Puerta Ciega';
            } else if (modeloLower.includes('3/4 vidrio') || modeloLower.includes('pl3')) {
                baseImage = 'Imagenes/puerta_3_4_vidrio.jpg';
                tipoPuerta = '3/4 Vidrio Stipol';
            } else if (modeloLower.includes('vidrio lateral') || modeloLower.includes('pl4')) {
                baseImage = 'Imagenes/puerta_vidrio_lateral.jpg';
                tipoPuerta = 'Vidrio Lateral Stipol';
            } else if (modeloLower.includes('vidrio repartido') || modeloLower.includes('pl5')) {
                baseImage = 'Imagenes/puerta_vidrio_repartido.jpg';
                tipoPuerta = 'Vidrio Repartido';
            } else {
                baseImage = 'Imagenes/puerta_tablero_acanalado_25mm.jpg';
                tipoPuerta = 'Tablero Acanalado 25mm';
            }
        } else if (descripcion.includes('tablero tubular')) {
            // Puertas de Tablero Tubular 36mm
            if (modeloLower.includes('1/4 vidrio')) {
                baseImage = 'Imagenes/puerta_1_4_vidrio_tubular.jpg';
                tipoPuerta = '1/4 Vidrio Stipol';
            } else if (modeloLower.includes('1/2 vidrio')) {
                baseImage = 'Imagenes/puerta_1_2_vidrio_tubular.jpg';
                tipoPuerta = '1/2 Vidrio Stipol';
            } else if (modeloLower.includes('3/4 vidrio')) {
                baseImage = 'Imagenes/puerta_3_4_vidrio_tubular.jpg';
                tipoPuerta = '3/4 Vidrio Stipol';
            } else if (modeloLower.includes('ciega')) {
                baseImage = 'Imagenes/puerta_ciega_tubular.jpg';
                tipoPuerta = 'Puerta Ciega';
            } else {
                baseImage = 'Imagenes/puerta_tablero_tubular_36mm.jpg';
                tipoPuerta = 'Tablero Tubular 36mm';
            }
        } else if (descripcion.includes('mosquitera')) {
            // Puertas Mosquitera
            if (modeloLower.includes('economica')) {
                baseImage = 'Imagenes/puerta_mosquitera_economica.jpg';
                tipoPuerta = 'Puerta Mosquitera Económica';
            } else if (modeloLower.includes('c/marco')) {
                baseImage = 'Imagenes/puerta_mosquitera_con_marco.jpg';
                tipoPuerta = 'Puerta Mosquitera con Marco';
            } else {
                baseImage = 'Imagenes/puerta_mosquitera.jpg';
                tipoPuerta = 'Puerta Mosquitera';
            }
        } else {
            baseImage = 'Imagenes/puerta_generica.jpg';
            tipoPuerta = 'Puerta Genérica';
        }
        
        // Si hay dimensiones válidas, usar placeholder con proporciones específicas
        if (ancho && alto && ancho !== '0' && alto !== '0') {
            const anchoNum = parseFloat(ancho);
            const altoNum = parseFloat(alto);
            
            if (!isNaN(anchoNum) && !isNaN(altoNum) && anchoNum > 0 && altoNum > 0) {
                // Calcular proporciones para puertas (generalmente más altas que anchas)
                let width = 600;
                let height = 800; // Puertas típicamente más altas
                
                const ratio = anchoNum / altoNum;
                
                if (ratio > 0.5) {
                    // Puerta más ancha que el estándar
                    width = 700;
                    height = Math.round(700 / ratio);
                } else if (ratio < 0.3) {
                    // Puerta muy estrecha
                    width = 400;
                    height = Math.round(400 / ratio);
                }
                
                // Usar placeholder con las dimensiones específicas y tipo de puerta
                return `https://via.placeholder.com/${width}x${height}/28a745/ffffff?text=${encodeURIComponent(`${ancho}x${alto} - ${tipoPuerta}`)}`;
            }
        }
        
        // Fallback a imagen estática si no hay dimensiones válidas
        return baseImage;
    }
    
    // Para aireadores
    if (productInfo.descripcion && productInfo.descripcion.toLowerCase().includes('aireadores')) {
        return 'Imagenes/aireador.jpg';
    }
    
    // Para otros productos, generar imagen de placeholder basada en el tipo de producto
    const category = productInfo.descripcion || 'producto';
    const size = `${productInfo.ancho || '0'}x${productInfo.alto || '0'}`;
    
    // Usar un servicio de placeholder con colores personalizados
    const colors = ['#DC3545', '#007bff', '#28a745', '#ffc107', '#17a2b8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `https://via.placeholder.com/600x400/${randomColor.replace('#', '')}/ffffff?text=${encodeURIComponent(category + ' - ' + size)}`;
}

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