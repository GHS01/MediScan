# MediScan AI

Plataforma avanzada que utiliza la API de Google Gemini para analizar imágenes médicas (radiografías, tomografías, ecografías y resonancias magnéticas) y proporcionar diagnósticos detallados con inteligencia artificial.

## Características

- Carga de múltiples tipos de imágenes médicas (radiografías, tomografías, ecografías, resonancias)
- Análisis automático de las imágenes mediante IA avanzada
- Interfaz de conversación para hacer preguntas sobre las imágenes
- Soporte para información adicional del paciente (historial médico, síntomas, resultados de laboratorio)
- Visualización de imágenes con modo de pantalla completa
- Guardado de diagnósticos en historial
- Interfaz moderna, profesional e intuitiva

## Tecnologías utilizadas

- React + Vite
- Google Gemini API
- Bootstrap
- React Markdown
- React Icons

## Requisitos previos

- Node.js (versión 18 o superior)
- Clave API de Google Gemini

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/radiografia-ai.git
   cd radiografia-ai
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura tu clave API de Google Gemini:
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade la siguiente línea: `VITE_GEMINI_API_KEY=tu_clave_api_aqui`

4. Inicia la aplicación:
   ```
   npm run dev
   ```

5. Abre tu navegador en `http://localhost:5173`

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una

2. Instala la CLI de Vercel:
   ```
   npm install -g vercel
   ```

3. Inicia sesión en Vercel desde la terminal:
   ```
   vercel login
   ```

4. Despliega la aplicación:
   ```
   vercel
   ```

5. Para desplegar a producción:
   ```
   vercel --prod
   ```

6. Configura las variables de entorno en el panel de control de Vercel:
   - Ve a tu proyecto en el dashboard de Vercel
   - Navega a "Settings" > "Environment Variables"
   - Añade `VITE_GEMINI_API_KEY` con tu clave API de Google Gemini

## Uso

1. Carga imágenes médicas utilizando el área de arrastrar y soltar o haciendo clic para seleccionar archivos
2. Proporciona información adicional del paciente (opcional):
   - Datos personales (nombre, edad, género)
   - Historial médico
   - Síntomas y observaciones
   - Resultados de laboratorio
3. La IA analizará automáticamente toda la información y proporcionará un diagnóstico inicial
4. Haz preguntas específicas sobre el análisis en el cuadro de chat
5. Utiliza el visualizador de imágenes para ver las imágenes en detalle
6. Guarda el diagnóstico en el historial utilizando el botón "Archivar Diagnóstico"
7. Consulta diagnósticos anteriores en la sección "Historial"

## Limitaciones

- La aplicación requiere una conexión a Internet para funcionar
- El análisis depende de la calidad de las imágenes proporcionadas
- La API de Google Gemini puede tener limitaciones de uso según tu plan
- El diagnóstico proporcionado por la IA es preliminar y no reemplaza la opinión de un profesional médico

## Seguridad y Privacidad

- Toda la información se procesa de forma segura y privada
- Los datos del paciente se almacenan localmente en el navegador
- No se envían datos sensibles a servidores externos excepto a la API de Google Gemini para el análisis

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.
