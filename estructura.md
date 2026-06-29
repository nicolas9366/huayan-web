Para implementar la interfaz de usuario de **Mainpaper AI Sales System**, basándome en los requerimientos de integración de datos macro (Power BI) y micro (Gmail), aquí tienes la estructura lógica y visual más eficiente.

### 1. Estructura HTML (Layout Semántico)

La interfaz se divide en un **Dashboard de Control de 3 niveles**:

*   **`<nav>` (Sidebar):** Navegación lateral fija. Enlaces a "Vista General", "Análisis de Stock", "Historial de Pedidos" y "Configuración de IA".
*   **`<header>` (Top Bar):** Buscador global de SKU, selector de rango de fechas y estado de conexión de los agentes Antigravity (Gmail/Drive).
*   **`<main>` (Dashboard Grid):**
    *   **Sección A (KPI Cards):** Resumen de ventas actuales vs. año anterior (Data Power BI).
    *   **Sección B (AI Insights Panel):** Un contenedor destacado para las predicciones de Gemini 1.5 Pro.
    *   **Sección C (Data Tables/Charts):** Comparativa de flujo de pedidos recientes (Data Gmail) vs. histórico.
    *   **Sección D (Alerts Drawer):** Panel lateral derecho o inferior de "Stock Crítico".

---

### 2. Componentes Tailwind CSS Sugeridos

Para mantener la estética profesional y funcional:

1.  **Stats Cards:** Con `ring-1 ring-slate-200` y `shadow-sm`. Colores: Verde (Ventas subiendo), Rojo (Baja respecto al año anterior).
2.  **AI Insight Box:** Fondo `bg-indigo-50` con borde `border-indigo-200`. Icono de "destello" (Sparkles) para indicar que el contenido es generado por Gemini.
3.  **Badge Status:** `rounded-full px-2 py-1` para niveles de stock:
    *   `bg-red-100 text-red-700` (Falta de stock inminente).
    *   `bg-yellow-100 text-yellow-700` (Reabastecimiento recomendado).
    *   `bg-green-100 text-green-700` (Saludable).
4.  **Data Table:** Filas con `hover:bg-slate-50` para facilitar la lectura de SKUs y transacciones.
5.  **Empty States / Loading:** Esqueletos (`animate-pulse`) mientras Gemini procesa las predicciones de los archivos de Excel.

---

### 3. Lógica Técnica (Technical Logic Outline)

Este es el cerebro del frontend y su comunicación con el backend:

#### A. Lógica de Sincronización (Antigravity Status)
*   **Polling/Webhooks:** El frontend debe escuchar un evento del backend que indique cuando el Skill de Antigravity termine de procesar el Excel de Gmail o Power BI.
*   **Indicador de Frescura:** Mostrar un "Label" con la última actualización de datos (ej. "Datos de pedidos actualizados hace 5 min").

#### B. Lógica de Reconciliación de Datos (Frontend Side)
*   **Mapeo de SKU:** Dado que Power BI y los correos pueden tener nombres ligeramente distintos, la UI debe resaltar si hay un SKU en un correo que no existe en `Dim_Productos` para que el usuario lo corrija.
*   **Agregación Temporal:** Capacidad de cambiar la vista de "Diario" (datos de Gmail) a "Mensual" (datos de Power BI) de forma fluida.

#### C. Lógica del Motor de Predicción (Gemini Integration)
*   **Context Windowing:** El backend envía a la UI el JSON generado por Gemini. La lógica de la UI debe desglosar este JSON en tres partes:
    1.  **Narrativa:** "Se observa un aumento del 15% en la categoría Cuadernos..."
    2.  **Acciones:** Botones rápidos de "Crear orden de compra" basados en la sugerencia de la IA.
    3.  **Visualización:** Generar una línea de tendencia proyectada (puntos punteados) que continúe la línea de ventas reales.

#### D. Lógica de Filtros Cruzados
*   Al seleccionar una "Categoría" del reporte macro (Power BI), la tabla de "Pedidos Recientes" (Gmail) debe filtrarse automáticamente para mostrar solo los SKUs que pertenecen a esa categoría.

### Resumen Visual (Concepto)
Utilizarás **Google Stitch** para asegurar que los componentes de diseño (botones, inputs, tipografía) sigan la línea de marca de Mainpaper, manteniendo una densidad de información alta (estilo panel administrativo) pero limpia, priorizando siempre la **Alerta de Stock** como el elemento visual de mayor jerarquía.