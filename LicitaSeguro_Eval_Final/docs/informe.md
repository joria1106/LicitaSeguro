# Informe de documentación - LicitaSeguro

## Datos generales

**Proyecto:** LicitaSeguro
**Evaluación:** Examen Final Desarrollo Frontend
**Estudiante:** Jhonny [Agregar apellido]
**Tecnologías utilizadas:** HTML5, CSS3, JavaScript puro y Bootstrap 5
**Formato de documentación:** Markdown

## Objetivo general

Desarrollar un sitio web público para LicitaSeguro que permita consultar licitaciones de Mercado Público, filtrar procesos por fecha y estado, revisar detalles de licitación y buscar proveedores por RUT, incorporando criterios de diseño responsivo, accesibilidad, validación de formularios, consumo de endpoints y manejo de errores.


## 1. Descripción del proyecto

LicitaSeguro es una propuesta de portal público para consultar licitaciones y proveedores de Mercado Público Chile. La solución se desarrolló con HTML, CSS, JavaScript puro y Bootstrap, cumpliendo con vistas responsivas, consumo de endpoints, validación de formularios, accesibilidad y manejo de errores.

## 2. Vistas desarrolladas

### Vista 1: Homepage corporativo
- Presenta la identidad del sitio.
- Dirige a los módulos principales mediante botones claros.
- Usa jerarquía visual: título, descripción y llamados a la acción.

### Vista 2: Listado de licitaciones
- Permite filtrar por fecha y estado.
- Convierte la fecha del input HTML `date` al formato requerido por la API: `ddmmaaaa`.
- Renderiza tarjetas con código, nombre, estado y fecha de cierre.
- Activa paginación cuando hay más de 10 elementos.

### Vista 3: Detalle de licitación
- Se abre mediante modal Bootstrap.
- Consume el endpoint de detalle usando el código obtenido desde el listado.
- Muestra organismo comprador, descripción, monto, fechas e ítems.

### Vista 4: Búsqueda de proveedor
- Valida RUT chileno con formato y dígito verificador.
- Consume el endpoint de proveedor.
- Muestra razón social y código de empresa si existe información.

## 2.1. Descripción de mockups y diseño de vistas

Los mockups del sistema se representaron directamente en las vistas desarrolladas del sitio web, considerando una estructura visual clara y adaptable a distintos dispositivos.

### Homepage corporativo

La vista inicial utiliza una sección principal con título destacado, descripción del servicio y botones de acceso directo a los módulos principales. Se aplicó jerarquía visual mediante tamaño de texto, contraste y distribución en dos columnas para escritorio, adaptándose a una sola columna en dispositivos móviles.

### Listado de licitaciones

La vista de licitaciones se diseñó con un formulario superior para los filtros de fecha y estado. Los resultados se organizan en tarjetas responsivas, permitiendo una lectura clara de código, nombre, estado y fecha de cierre. La paginación se ubica junto al contador de resultados para facilitar la navegación.

### Detalle de licitación

El detalle se presenta mediante un modal Bootstrap, evitando redireccionar al usuario fuera de la página principal. Esto permite mantener el contexto de navegación y revisar información específica del proceso seleccionado.

### Búsqueda de proveedores

La vista de proveedores está organizada en dos columnas: formulario de búsqueda a la izquierda y resultado a la derecha. En dispositivos pequeños, ambas secciones se ordenan verticalmente para mejorar la experiencia móvil.


## 3. Principios UI/UX aplicados

- **Jerarquía visual:** títulos grandes, subtítulos y módulos diferenciados.
- **Consistencia:** botones, tarjetas, formularios y alertas mantienen estilos comunes.
- **Retroalimentación:** loader durante consultas, mensajes de error y estados vacíos.
- **Prevención de errores:** validaciones antes de consumir la API.
- **Diseño responsivo:** uso de grilla Bootstrap con columnas adaptables.
- **Legibilidad:** tipografía Inter, contraste alto y espaciado amplio.

## 4. Accesibilidad

- Labels asociados a todos los campos.
- Uso de `aria-live` para resultados dinámicos.
- Uso de `role="alert"` en mensajes de error.
- Link de salto al contenido principal.
- Foco visible con `:focus-visible`.
- Navegación por teclado en botones, enlaces, cards y modal.
- Estructura semántica con `header/nav/main/section/footer`.

## 5. Validaciones

### Licitaciones
- Fecha obligatoria.
- Estado obligatorio.
- Mensajes específicos bajo cada campo.

### Proveedor
- RUT obligatorio.
- Verificación de longitud y caracteres.
- Validación de dígito verificador mediante módulo 11.
- Mensaje específico si el dígito verificador no coincide.

## 6. Consumo de endpoints

- Listado de licitaciones:
  `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha=ddmmaaaa&estado=estado&ticket=ticket`

- Detalle de licitación:
  `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=codigo&ticket=ticket`

- Proveedor:
  `https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=rut&ticket=ticket`

## 7. Manejo de errores

El archivo `app.js` controla:

- Respuesta vacía.
- Error HTTP 403: sin permisos.
- Error HTTP 500 o superior: servidor no disponible.
- JSON inválido.
- Campos nulos o vacíos, mostrando `--`.

## 8. Estructura del proyecto

```text
LicitaSeguro_Eval_U3A/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── docs/
    └── informe.md
```
## 9. Conclusión

El proyecto LicitaSeguro cumple con los requerimientos solicitados para la evaluación, ya que integra una interfaz responsiva, formularios validados, consumo de endpoints, renderizado dinámico de información, loader, paginación, manejo de errores y criterios de accesibilidad. Además, la estructura del código se encuentra organizada en archivos separados para HTML, CSS y JavaScript, favoreciendo el mantenimiento y la claridad del desarrollo.

