// Funciones del modal
export function openModal(productInfo) {
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

export function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

export function generateProductImage(productInfo) {
    console.log('ProductInfo:', productInfo); // Debug
    
    // Para ventanas: mostrar imagen según el tipo específico y dimensiones
    if (productInfo.descripcion && productInfo.descripcion.toLowerCase().includes('ventana')) {
        const descripcion = productInfo.descripcion.toLowerCase();
        const ancho = productInfo.ancho || '0';
        const alto = productInfo.alto || '0';
        
        // Calcular proporciones basadas en las dimensiones reales
        let width = 600; // Ancho base
        let height = 400; // Alto base
        
        if (ancho && alto && ancho !== '0' && alto !== '0') {
            // Convertir dimensiones a números
            const anchoNum = parseFloat(ancho);
            const altoNum = parseFloat(alto);
            
            if (!isNaN(anchoNum) && !isNaN(altoNum) && anchoNum > 0 && altoNum > 0) {
                // Calcular proporción
                const ratio = anchoNum / altoNum;
                
                if (ratio > 1) {
                    // Ventana más ancha que alta
                    width = 800;
                    height = Math.round(800 / ratio);
                } else if (ratio < 1) {
                    // Ventana más alta que ancha
                    height = 600;
                    width = Math.round(600 * ratio);
                }
                // Si ratio = 1, mantener dimensiones base
            }
        }
        
        // Determinar imagen base según el tipo de ventana
        let baseImage = '';
        if (descripcion.includes('corredizas simples') && descripcion.includes('vidrio repartido')) {
            baseImage = 'Imagenes/ventanavidriorepartido.webp';
        } else if (descripcion.includes('corredizas simples') && descripcion.includes('vidrio entero')) {
            baseImage = 'Imagenes/vidrioentero.jpg';
        } else if (descripcion.includes('celosías corredizas') && descripcion.includes('aplique')) {
            baseImage = 'Imagenes/celosiacorrediza.jpg';
        } else if (descripcion.includes('vidrio entero') && descripcion.includes('celosía corrediza')) {
            baseImage = 'Imagenes/celosiacorrediza.jpg';
        } else {
            baseImage = 'Imagenes/ventana.jpg';
        }
        
        // Si las dimensiones son válidas, usar placeholder con proporciones específicas
        if (ancho && alto && ancho !== '0' && alto !== '0') {
            const anchoNum = parseFloat(ancho);
            const altoNum = parseFloat(alto);
            
            if (!isNaN(anchoNum) && !isNaN(altoNum) && anchoNum > 0 && altoNum > 0) {
                // Usar placeholder con las dimensiones específicas y color azul
                return `https://via.placeholder.com/${width}x${height}/007bff/ffffff?text=${encodeURIComponent(`${ancho}x${alto} - ${descripcion.split(' ').slice(0, 3).join(' ')}`)}`;
            }
        }
        
        // Fallback a imagen estática si no hay dimensiones válidas
        return baseImage;
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
