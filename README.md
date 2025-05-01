# <p style="text-align:center">🚖 TaxiGo </p>
TaxiGo es una aplicación móvil diseñada para conductores de taxi que buscan optimizar su trabajo diario mediante herramientas inteligentes y automatizadas. La aplicación combina funcionalidades avanzadas como geolocalización, cálculo de tarifas, y recordatorios programables, todo integrado en una interfaz intuitiva y fácil de usar.

## 📌 Funcionalidades Clave
### 1. 📅 Recordatorios Programables
- Configura alertas para viajes recurrentes, como "Recoger a María en el aeropuerto cada jueves a las 9 AM".
- Recibe notificaciones push y sonoras para no olvidar ningún viaje importante.
### 2. 👥 Registro de Viajes con Datos de Pasajero
- Registra información clave de los pasajeros:
    - Nombre.
    - Teléfono (opcional).
    - Dirección de recogida y destino.
- Accede a un historial de pasajeros frecuentes para agilizar futuros registros.
### 3. 💰 Calculadora de Tarifas Inteligente
- Configura tarifas personalizadas:
    - Tarifa base.
    - Precio por kilómetro, ajustable según el horario (día/noche).
- Calcula automáticamente el costo del viaje al ingresar la distancia o seleccionar una ruta en el mapa.
### 4. 🛣️ Contador de Kilómetros Automático
- Modo Trabajo:
    - Utiliza geolocalización en segundo plano con para registrar los kilómetros recorridos durante el turno.
- Genera estadísticas detalladas:
    - Resúmenes diarios, semanales y mensuales.
    - Gráficos comparativos para analizar el rendimiento.
### 5. 🗺️ Mapa de Navegación Integrado
- Busca direcciones y destinos utilizando la Google Places API.
- Flujo de Viaje:
    - Busca un destino y muestra la ruta en el mapa.
    - Inicia el viaje con un botón:
        - Calcula automáticamente la distancia y el tiempo estimado.
        - Activa el contador de kilómetros.
    - Finaliza el viaje con otro botón:
        - Auto-rellena los datos en el formulario de registro.
## ⚙️ Tecnologías Utilizadas
- React Native: Desarrollo de la interfaz móvil.
- Expo: Framework para funcionalidades avanzadas como geolocalización y notificaciones.
- Google Places API: Búsqueda de direcciones y rutas.
- Supabase: Backend para autenticación y almacenamiento de datos.
- React Native Maps: Visualización de mapas y rutas.

## 🚀 Cómo desplegar el proyecto localmente
Instalar dependencias:
```
    npm install
```
Iniciar la aplicación:
```
    npx expo start
```
Abrir en un dispositivo:

- Usa un emulador de Android/iOS.
- Escanea el código QR con la app Expo Go.