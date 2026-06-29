// Mainpaper AI Sales System — Mock Database & Demo Data
// Mock Dim_Productos: Standard Catalogue
const mockDimProductos = [
  { "sku_producto": "SKU-10014", "nombre_producto": "Cuaderno A4 80 Hojas Cuadrícula", "categoria": "CUADERNOS", "subcategoria": "ESCUELA" },
  { "sku_producto": "SKU-10015", "nombre_producto": "Cuaderno A5 100 Hojas Pauta", "categoria": "CUADERNOS", "subcategoria": "ESCUELA" },
  { "sku_producto": "SKU-10016", "nombre_producto": "Cuaderno Espiral Folio", "categoria": "CUADERNOS", "subcategoria": "OFICINA" },
  { "sku_producto": "SKU-10023", "nombre_producto": "Forro de Libros Ajustable 29cm", "categoria": "FORROS Y CARPETAS", "subcategoria": "ESCUELA" },
  { "sku_producto": "SKU-10024", "nombre_producto": "Carpeta de Anillas A4 Rígida", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA" },
  { "sku_producto": "SKU-10025", "nombre_producto": "Funda Porta Documentos Transparente", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA" },
  { "sku_producto": "SKU-10031", "nombre_producto": "Bolígrafo Gel Negro 0.5mm", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS" },
  { "sku_producto": "SKU-10032", "nombre_producto": "Lápiz de Grafito HB Mainpaper", "categoria": "ESCRITURA", "subcategoria": "LÁPICES" },
  { "sku_producto": "SKU-10033", "nombre_producto": "Marcador Fluorescente Amarillo", "categoria": "ESCRITURA", "subcategoria": "SUBRAYADORES" },
  { "sku_producto": "SKU-10041", "nombre_producto": "Goma de Borrar Miga de Pan", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS" },
  { "sku_producto": "SKU-10042", "nombre_producto": "Tijeras de Oficina Confort", "categoria": "PAPELERÍA GENERAL", "subcategoria": "OFICINA" },
  { "sku_producto": "SKU-10043", "nombre_producto": "Regla de Aluminio 30cm", "categoria": "PAPELERÍA GENERAL", "subcategoria": "ESCUELA" }
];

// Mock Stock / Inventory Status for Section D
const mockStockInventory = [
  { "sku_producto": "SKU-10014", "nombre_producto": "Cuaderno A4 80 Hojas Cuadrícula", "categoria": "CUADERNOS", "stock_actual": 8, "stock_seguridad": 50, "estado": "CRÍTICO" },
  { "sku_producto": "SKU-10023", "nombre_producto": "Forro de Libros Ajustable 29cm", "categoria": "FORROS Y CARPETAS", "stock_actual": 12, "stock_seguridad": 40, "estado": "CRÍTICO" },
  { "sku_producto": "SKU-10031", "nombre_producto": "Bolígrafo Gel Negro 0.5mm", "categoria": "ESCRITURA", "stock_actual": 5, "stock_seguridad": 100, "estado": "CRÍTICO" },
  { "sku_producto": "SKU-10015", "nombre_producto": "Cuaderno A5 100 Hojas Pauta", "categoria": "CUADERNOS", "stock_actual": 42, "stock_seguridad": 60, "estado": "BAJO" },
  { "sku_producto": "SKU-10042", "nombre_producto": "Tijeras de Oficina Confort", "categoria": "PAPELERÍA GENERAL", "stock_actual": 25, "stock_seguridad": 30, "estado": "BAJO" },
  { "sku_producto": "SKU-10033", "nombre_producto": "Marcador Fluorescente Amarillo", "categoria": "ESCRITURA", "stock_actual": 150, "stock_seguridad": 80, "estado": "SALUDABLE" },
  { "sku_producto": "SKU-10024", "nombre_producto": "Carpeta de Anillas A4 Rígida", "categoria": "FORROS Y CARPETAS", "stock_actual": 320, "stock_seguridad": 100, "estado": "SALUDABLE" },
  { "sku_producto": "SKU-10041", "nombre_producto": "Goma de Borrar Miga de Pan", "categoria": "PAPELERÍA GENERAL", "stock_actual": 580, "stock_seguridad": 200, "estado": "SALUDABLE" }
];

// Mock Mail_Pedidos_Transacciones: Gmail parsed order details (Micro transactions)
const mockSalesData = [
  { "order_id": "GMAIL_93817_1", "fecha_pedido": "2026-06-28", "cliente_email": "compras@libreriaperez.com", "producto_sku": "SKU-10014", "cantidad": 45, "precio_unitario": 1.20, "total_linea": 54.00, "producto": "Cuaderno A4 80 Hojas Cuadrícula", "categoria": "CUADERNOS" },
  { "order_id": "GMAIL_93817_2", "fecha_pedido": "2026-06-28", "cliente_email": "compras@libreriaperez.com", "producto_sku": "SKU-10023", "cantidad": 20, "precio_unitario": 0.85, "total_linea": 17.00, "producto": "Forro de Libros Ajustable 29cm", "categoria": "FORROS Y CARPETAS" },
  { "order_id": "GMAIL_93819_1", "fecha_pedido": "2026-06-28", "cliente_email": "distribuciones_valencia@gmail.com", "producto_sku": "SKU-10031", "cantidad": 150, "precio_unitario": 0.40, "total_linea": 60.00, "producto": "Bolígrafo Gel Negro 0.5mm", "categoria": "ESCRITURA" },
  { "order_id": "GMAIL_93819_2", "fecha_pedido": "2026-06-28", "cliente_email": "distribuciones_valencia@gmail.com", "producto_sku": "SKU-10032", "cantidad": 100, "precio_unitario": 0.25, "total_linea": 25.00, "producto": "Lápiz de Grafito HB Mainpaper", "categoria": "ESCRITURA" },
  { "order_id": "GMAIL_93821_1", "fecha_pedido": "2026-06-27", "cliente_email": "abastos_bcn@bcn.cat", "producto_sku": "SKU-99999", "cantidad": 12, "precio_unitario": 5.40, "total_linea": 64.80, "producto": "Producto No Mapeado Invalido", "categoria": "DESCONOCIDA" }, // Test SKU mapping failed
  { "order_id": "GMAIL_93822_1", "fecha_pedido": "2026-06-27", "cliente_email": "papeleriagigante@madrid.es", "producto_sku": "SKU-10041", "cantidad": 200, "precio_unitario": 0.15, "total_linea": 30.00, "producto": "Goma de Borrar Miga de Pan", "categoria": "PAPELERÍA GENERAL" },
  { "order_id": "GMAIL_93822_2", "fecha_pedido": "2026-06-27", "cliente_email": "papeleriagigante@madrid.es", "producto_sku": "SKU-10015", "cantidad": 60, "precio_unitario": 0.95, "total_linea": 57.00, "producto": "Cuaderno A5 100 Hojas Pauta", "categoria": "CUADERNOS" },
  { "order_id": "GMAIL_93822_3", "fecha_pedido": "2026-06-27", "cliente_email": "papeleriagigante@madrid.es", "producto_sku": "SKU-10024", "cantidad": 50, "precio_unitario": 2.10, "total_linea": 105.00, "producto": "Carpeta de Anillas A4 Rígida", "categoria": "FORROS Y CARPETAS" },
  { "order_id": "GMAIL_93825_1", "fecha_pedido": "2026-06-26", "cliente_email": "pedidos@hiperoffice.es", "producto_sku": "SKU-10014", "cantidad": 120, "precio_unitario": 1.20, "total_linea": 144.00, "producto": "Cuaderno A4 80 Hojas Cuadrícula", "categoria": "CUADERNOS" },
  { "order_id": "GMAIL_93825_2", "fecha_pedido": "2026-06-26", "cliente_email": "pedidos@hiperoffice.es", "producto_sku": "SKU-10033", "cantidad": 80, "precio_unitario": 0.65, "total_linea": 52.00, "producto": "Marcador Fluorescente Amarillo", "categoria": "ESCRITURA" },
  { "order_id": "GMAIL_93825_3", "fecha_pedido": "2026-06-26", "cliente_email": "pedidos@hiperoffice.es", "producto_sku": "SKU-10042", "cantidad": 40, "precio_unitario": 1.80, "total_linea": 72.00, "producto": "Tijeras de Oficina Confort", "categoria": "PAPELERÍA GENERAL" },
  { "order_id": "GMAIL_93828_1", "fecha_pedido": "2026-06-25", "cliente_email": "contacto@libreriacentral.es", "producto_sku": "SKU-10016", "cantidad": 90, "precio_unitario": 1.50, "total_linea": 135.00, "producto": "Cuaderno Espiral Folio", "categoria": "CUADERNOS" },
  { "order_id": "GMAIL_93828_2", "fecha_pedido": "2026-06-25", "cliente_email": "contacto@libreriacentral.es", "producto_sku": "SKU-10025", "cantidad": 300, "precio_unitario": 0.08, "total_linea": 24.00, "producto": "Funda Porta Documentos Transparente", "categoria": "FORROS Y CARPETAS" },
  { "order_id": "GMAIL_93830_1", "fecha_pedido": "2026-06-25", "cliente_email": "santiago_dist@santiago.cl", "producto_sku": "SKU-10043", "cantidad": 150, "precio_unitario": 0.70, "total_linea": 105.00, "producto": "Regla de Aluminio 30cm", "categoria": "PAPELERÍA GENERAL" }
];

// Mock PowerBI_Estadisticas: Historical Macro Sales Data (monthly aggregate)
const mockPowerBIData = [
  { "fecha_reporte": "2026-01-31", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 12450.00, "ventas_ano_anterior": 11200.00, "n_total_articulos": 10375 },
  { "fecha_reporte": "2026-01-31", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 8340.00, "ventas_ano_anterior": 7900.00, "n_total_articulos": 7400 },
  { "fecha_reporte": "2026-01-31", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 9210.00, "ventas_ano_anterior": 8100.00, "n_total_articulos": 15600 },
  { "fecha_reporte": "2026-01-31", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 5420.00, "ventas_ano_anterior": 5100.00, "n_total_articulos": 6200 },
  
  { "fecha_reporte": "2026-02-28", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 13900.00, "ventas_ano_anterior": 12100.00, "n_total_articulos": 11580 },
  { "fecha_reporte": "2026-02-28", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 8900.00, "ventas_ano_anterior": 8200.00, "n_total_articulos": 7900 },
  { "fecha_reporte": "2026-02-28", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 9800.00, "ventas_ano_anterior": 8500.00, "n_total_articulos": 16900 },
  { "fecha_reporte": "2026-02-28", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 5890.00, "ventas_ano_anterior": 5300.00, "n_total_articulos": 6800 },
  
  { "fecha_reporte": "2026-03-31", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 15200.00, "ventas_ano_anterior": 13200.00, "n_total_articulos": 12660 },
  { "fecha_reporte": "2026-03-31", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 9200.00, "ventas_ano_anterior": 8900.00, "n_total_articulos": 8100 },
  { "fecha_reporte": "2026-03-31", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 11200.00, "ventas_ano_anterior": 9200.00, "n_total_articulos": 19800 },
  { "fecha_reporte": "2026-03-31", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 6120.00, "ventas_ano_anterior": 5700.00, "n_total_articulos": 7100 },
  
  { "fecha_reporte": "2026-04-30", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 16400.00, "ventas_ano_anterior": 14100.00, "n_total_articulos": 13660 },
  { "fecha_reporte": "2026-04-30", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 9800.00, "ventas_ano_anterior": 9200.00, "n_total_articulos": 8700 },
  { "fecha_reporte": "2026-04-30", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 12300.00, "ventas_ano_anterior": 10500.00, "n_total_articulos": 22300 },
  { "fecha_reporte": "2026-04-30", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 6500.00, "ventas_ano_anterior": 5900.00, "n_total_articulos": 7500 },

  { "fecha_reporte": "2026-05-31", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 19800.00, "ventas_ano_anterior": 16800.00, "n_total_articulos": 16500 },
  { "fecha_reporte": "2026-05-31", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 11500.00, "ventas_ano_anterior": 10200.00, "n_total_articulos": 10100 },
  { "fecha_reporte": "2026-05-31", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 14500.00, "ventas_ano_anterior": 12100.00, "n_total_articulos": 26800 },
  { "fecha_reporte": "2026-05-31", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 7800.00, "ventas_ano_anterior": 6800.00, "n_total_articulos": 9100 },

  { "fecha_reporte": "2026-06-30", "categoria": "CUADERNOS", "subcategoria": "ESCUELA", "producto": "Cuadernos Global", "ventas": 24900.00, "ventas_ano_anterior": 20400.00, "n_total_articulos": 20750 },
  { "fecha_reporte": "2026-06-30", "categoria": "FORROS Y CARPETAS", "subcategoria": "OFICINA", "producto": "Carpetas Global", "ventas": 14200.00, "ventas_ano_anterior": 12100.00, "n_total_articulos": 12600 },
  { "fecha_reporte": "2026-06-30", "categoria": "ESCRITURA", "subcategoria": "BOLÍGRAFOS", "producto": "Escritura Global", "ventas": 18900.00, "ventas_ano_anterior": 15400.00, "n_total_articulos": 35200 },
  { "fecha_reporte": "2026-06-30", "categoria": "PAPELERÍA GENERAL", "subcategoria": "COMPLEMENTOS", "producto": "General Global", "ventas": 9600.00, "ventas_ano_anterior": 8100.00, "n_total_articulos": 11200 }
];

// AI insights text templates for different months / statuses
const mockAIInsights = {
  "narrative": "Se observa una fuerte aceleración de la demanda en la categoría <strong class='text-white font-bold'>CUADERNOS</strong> de un <strong class='text-emerald-400 font-semibold'>+22.1% YoY</strong>, impulsada por las compras anticipadas de la campaña escolar (vuelta al cole). La velocidad de salida de correos recientes de Gmail de los SKUs <strong class='text-white font-bold'>SKU-10014</strong> y <strong class='text-white font-bold'>SKU-10023</strong> indica un riesgo de rotura de stock inminente dentro de los próximos 14 días. Se recomienda emitir una orden de compra correctiva inmediata.",
  "skuRecommendations": [
    { "sku": "SKU-10014", "categoria": "CUADERNOS", "stock": 8, "sugerido": 250, "prioridad": "CRÍTICA" },
    { "sku": "SKU-10023", "categoria": "FORROS Y CARPETAS", "stock": 12, "sugerido": 180, "prioridad": "CRÍTICA" },
    { "sku": "SKU-10031", "categoria": "ESCRITURA", "stock": 5, "sugerido": 500, "prioridad": "ALTA" },
    { "sku": "SKU-10015", "categoria": "CUADERNOS", "stock": 42, "sugerido": 100, "prioridad": "MEDIA" }
  ]
};

// Bind to window context
window.mockDimProductos = mockDimProductos;
window.mockStockInventory = mockStockInventory;
window.mockSalesData = mockSalesData;
window.mockPowerBIData = mockPowerBIData;
window.mockAIInsights = mockAIInsights;
console.log("Mainpaper mock data loaded successfully.");
