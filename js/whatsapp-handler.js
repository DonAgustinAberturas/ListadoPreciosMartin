// WhatsApp Handler - Solución robusta que funciona en todos los casos
class WhatsAppHandler {
    constructor() {
        this.phoneNumber = '5493435042712';
        this.defaultMessage = 'Hola! Estuve viendo su lista de precios de Don Agustin y me gustaria hacer una consulta sobre sus productos. Podrian ayudarme?';
        this.init();
    }

    init() {
        const whatsappButton = document.querySelector('.whatsapp-float');
        if (whatsappButton) {
            whatsappButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openWhatsApp();
            });
        }
    }

    openWhatsApp() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            this.openMobileWhatsApp();
        } else {
            this.openDesktopWhatsApp();
        }
    }

    openMobileWhatsApp() {
        // Método 1: Protocolo nativo de WhatsApp
        const message = encodeURIComponent(this.defaultMessage);
        const whatsappUrl = `whatsapp://send?phone=${this.phoneNumber}&text=${message}`;
        
        // Intentar abrir WhatsApp
        window.location.href = whatsappUrl;
        
        // Método 2: Fallback con timeout
        setTimeout(() => {
            if (!document.hidden) {
                this.tryAlternativeMobileMethod();
            }
        }, 1500);
    }

    tryAlternativeMobileMethod() {
        // Método alternativo para móvil
        const message = encodeURIComponent(this.defaultMessage);
        const alternativeUrl = `https://api.whatsapp.com/send?phone=${this.phoneNumber}&text=${message}`;
        
        // Abrir en nueva pestaña
        window.open(alternativeUrl, '_blank');
    }

    openDesktopWhatsApp() {
        // Método 1: API oficial de WhatsApp
        const message = encodeURIComponent(this.defaultMessage);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.phoneNumber}&text=${message}`;
        
        // Intentar abrir en nueva ventana
        const newWindow = window.open(whatsappUrl, '_blank', 'width=600,height=700');
        
        // Método 2: Si no se puede abrir ventana, usar redirección
        if (!newWindow) {
            window.location.href = whatsappUrl;
        }
        
        // Método 3: Fallback con wa.me
        setTimeout(() => {
            if (!newWindow || newWindow.closed) {
                this.tryWaMeFallback();
            }
        }, 1000);
    }

    tryWaMeFallback() {
        // Método alternativo usando wa.me
        const message = encodeURIComponent(this.defaultMessage);
        const waMeUrl = `https://wa.me/${this.phoneNumber}?text=${message}`;
        
        // Abrir en nueva ventana
        const fallbackWindow = window.open(waMeUrl, '_blank', 'width=600,height=700');
        
        if (!fallbackWindow) {
            window.location.href = waMeUrl;
        }
    }

    // Método de emergencia si nada funciona
    showEmergencyMessage() {
        const emergencyDiv = document.createElement('div');
        emergencyDiv.className = 'whatsapp-emergency';
        emergencyDiv.innerHTML = `
            <div class="emergency-content">
                <h3>📱 Contacto WhatsApp</h3>
                <p><strong>Número:</strong> +54 9 343 504-2712</p>
                <p><strong>Mensaje sugerido:</strong></p>
                <textarea readonly style="width: 100%; height: 80px; margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${this.defaultMessage}</textarea>
                <p><small>Copia este mensaje y pégalo en WhatsApp</small></p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #25D366; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cerrar</button>
            </div>
        `;
        
        emergencyDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        emergencyDiv.querySelector('.emergency-content').style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            max-width: 450px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(emergencyDiv);
    }

    // Métodos para personalización
    setMessage(message) {
        this.defaultMessage = message;
    }

    setPhoneNumber(phone) {
        this.phoneNumber = phone.replace(/\D/g, '');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappHandler = new WhatsAppHandler();
    
    // Método de emergencia: si después de 3 segundos no se abrió WhatsApp, mostrar mensaje
    setTimeout(() => {
        if (document.visibilityState === 'visible') {
            // Verificar si se abrió WhatsApp
            const whatsappOpened = sessionStorage.getItem('whatsapp_opened');
            if (!whatsappOpened) {
                window.whatsappHandler.showEmergencyMessage();
            }
        }
    }, 3000);
});

// Marcar cuando se abre WhatsApp
window.addEventListener('blur', () => {
    sessionStorage.setItem('whatsapp_opened', 'true');
});

export default WhatsAppHandler;
