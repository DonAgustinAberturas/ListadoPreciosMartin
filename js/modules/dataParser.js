// Función para parsear los datos del archivo TXT
export function parseData(text) {
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
