# Chat Bot Sushi IA 🍣

### **Descripción**
ChatBotIASushi es un proyecto diseñado para proporcionar una experiencia interactiva de chatbot a una empresa de sushi. Este chatbot utiliza inteligencia artificial para responder consultas de clientes, como recomendaciones de menú, horarios de atención, y recibir pedidos.

---

### **Cómo utilizar el proyecto**

## **Requisitos previos**
- Node.js v16+ instalado
- MongoDB configurado para el backend
- Clave API de Cohere.ai

#### **Instalación**
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Nachit0C/ChatBotIASushi.git
2. Instala todas las dependencias:
     ```bash
    cd ChatBotIASushi
    npm run install:all
3.Configuración
- Crea un archivo .env en las carpetas frontend y backend con las siguientes variables:
Frontend:
- env
  ```bash
    VITE_API_URL=<URL-del-servidor-Backend>
Backend:
- env
  ```bash
  COHERE_API_KEY=<Tu-clave-de-cohere.ai>
  MONGO_URI=<Tu-URI-de-MongoDB>

4.Ejecución
- Inicia el proyecto completo:
  ```bash
  npm start

# Limitaciones
Cohere.ai Free Plan: Este proyecto utiliza el plan gratuito de Cohere.ai, lo que puede limitar la cantidad de solicitudes y las capacidades del modelo de lenguaje.
Base de datos local: El proyecto no está optimizado para entornos de producción; actualmente utiliza una base de datos local.

# Cosas a mejorar:
- Optimización para entornos de producción.
- Integración con servicios de pago y notificaciones automáticas.
- Mejora en el manejo de solicitudes concurrentes para el chatbot.
- Ampliar el soporte de idiomas.
- UI más atractiva y adaptativa para dispositivos móviles y en general.
- Mejorar el menu, armar alguna especie de PDF para enviar cuando el cliente pida verlo.
- Armar una lista de productos en la base de datos para ir manejando el stock.
- Agregar una columna de estado a los pedidos para saber si están en proceso, confrimados, cancelados, enviados, etc.
- Mejorar el manejo de errores y agregar testing.
- Ordenar el código del frontend.

# Contacto
Cualquier duda, consulta o sugerencia de mejora contactarme en nachociccone@gmail.com
