# Mainpaper - AI Sales Analysis & Prediction System
*Documento de Arquitectura y Diseño / 架构与设计文档*

## 1. Resumen del Proyecto / 项目概述

**Objetivo (ES):** Construir un sistema automatizado que integre datos de ventas dispersos (correos y Power BI) utilizando Google Antigravity y Gemini 1.5 Pro para generar predicciones precisas de stock y análisis de tendencias a largo plazo, visualizándolo en el panel web actual.

**目标 (ZH):** 构建一个自动化系统，利用 Google Antigravity 和 Gemini 1.5 Pro 整合零散的销售数据（邮件和 Power BI），生成精准的长周期库存预判和趋势分析，并在当前的网站后台中进行可视化呈现。

---

## 2. Flujo de Datos y Automatización / 数据流向与自动化方案

### A. Datos Transaccionales (Pedidos de Gmail) / 交易数据（Gmail 订单）
* **Origen:** Archivos Excel adjuntos en correos electrónicos.
* **Proceso Antigravity:** Un "Skill" o agente monitorea la bandeja de entrada (filtros por remitente/asunto). Extrae el archivo adjunto, analiza las filas de cada pedido individual y lo envía a la base de datos a través de la API del backend.
* **Frecuencia:** Tiempo real o por horas. / 实时或按小时触发。

### B. Datos Agregados (Reportes de Power BI) / 汇总数据（Power BI 报表）
* **Origen:** Archivos Excel generados manualmente de Power BI.
* **Proceso Antigravity:** Se crea una carpeta de "Buzón" (Drop folder) en Google Drive. El agente de Antigravity escucha los cambios en esta carpeta. Al subir un nuevo Excel, lo analiza y actualiza el registro histórico en la base de datos.
* **Frecuencia:** Basado en eventos (al subir archivo). / 事件触发（上传文件时）。

---

## 3. Arquitectura de Base de Datos / 数据库表结构设计

Para alinear la visión macro y micro, se utilizarán tres tablas principales:
为了对齐宏观与微观数据，将采用三张核心表：

### Tabla 1: `PowerBI_Estadisticas` (Histórico Macroeconómico / 宏观历史数据)
* `id` (PK, UUID)
* `fecha_reporte` (Date) - Fecha del informe / 报表周期
* `categoria` (String) - Categoría (ej. CUADERNOS Y FORRO ESPANAL) / 类别
* `subcategoria` (String) - Subcategoría / 子类别
* `producto` (String) - Nombre del producto / 产品名称
* `ventas` (Decimal) - Ventas del periodo / 当期销售额
* `ventas_ano_anterior` (Decimal) - Ventas del año anterior / 去年同期销售额
* `n_total_articulos` (Integer) - Cantidad total de artículos / 总件数

### Tabla 2: `Mail_Pedidos_Transacciones` (Movimientos Diarios / 每日流水明细)
* `order_id` (PK, String) - ID del pedido / 订单号
* `fecha_pedido` (DateTime) - Fecha exacta / 下单精准时间
* `cliente_email` (String) - Identificador de cliente / 客户标识
* `producto_sku` (String) - Referencia al catálogo / 产品 SKU
* `cantidad` (Integer) - Cantidad comprada / 购买数量
* `precio_unitario` (Decimal) - Precio por unidad / 单价
* `total_linea` (Decimal) - Total de la línea / 总价

### Tabla 3: `Dim_Productos` (Catálogo Unificado / 产品维度主数据)
* `sku_producto` (PK, String) - SKU único / 唯一 SKU
* `nombre_producto` (String) - Nombre estándar / 标准名称
* `categoria` (String) - Categoría / 类别
* `subcategoria` (String) - Subcategoría / 子类别

---

## 4. Diseño del Motor Antigravity e IA / Antigravity 核心引擎设计

### Skill 1: Integrador de Datos (Data Ingestion) / 数据抓取代理
* Conecta con las APIs de Gmail y Google Drive.
* Limpia el formato y reconcilia nombres de productos (mapeo hacia `Dim_Productos`).

### Skill 2: Motor de Predicción (Gemini 1.5 Pro) / 深度分析引擎
* **Pre-procesamiento:** El backend agrupa los datos transaccionales por semanas/meses para reducir el consumo de tokens.
* **Prompt Principal:** Envía el histórico agregado de meses anteriores cruzado con los movimientos recientes. 
* **Objetivo de Salida (Output):** 1.  Índice de estacionalidad (ej. preparación para la vuelta al cole). / 季节性备货指数。
    2.  Alertas de falta de stock basadas en el ritmo de ventas de correos recientes. / 缺货预警。
    3.  Lista de SKU recomendados para el próximo pedido de compra. / 采购清单建议。

---

## 5. Próximos Pasos de Implementación / 后续开发步骤

1.  **Backend Web:** Crear las migraciones de las 3 tablas en el sistema actual y exponer los endpoints POST seguros. / 在现有网站后端创建 3 张表的迁移，并开放安全的 POST 接口。
2.  **Antigravity Config:** Crear el Workspace, vincular credenciales de Google Workspace (Drive/Gmail) y crear los flujos de automatización visuales. / 配置 Antigravity 工作区，绑定 Google 账号权限，并搭建数据流。
3.  **Prueba de Concepto (PoC):** Subir el archivo `10014150.xlsx` a Drive y enviar un correo de prueba para verificar la inserción cruzada en la base de datos. / 上传测试表格并发送测试邮件，验证双通道数据写入。