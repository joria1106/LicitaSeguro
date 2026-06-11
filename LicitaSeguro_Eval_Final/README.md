# LicitaSeguro - Evaluación Desarrollo Frontend

## Datos generales

**Proyecto:** LicitaSeguro
**Evaluación:** Examen Final Desarrollo Frontend
**Estudiante:** Johnny Alexander Villarreal Riascos
**Institución:** Instituto Profesional San Sebastián
**Tecnologías utilizadas:** HTML5, CSS3, JavaScript puro y Bootstrap 5
**Github:** https://github.com/joria1106/LicitaSeguro.git

---

## Descripción del proyecto

LicitaSeguro es un sitio web frontend orientado a facilitar la consulta de licitaciones públicas en Chile. La plataforma permite navegar licitaciones, filtrar resultados por fecha y estado, revisar información detallada de cada proceso y buscar proveedores mediante RUT.

El proyecto fue desarrollado utilizando HTML, CSS, JavaScript puro y Bootstrap, priorizando una interfaz clara, responsiva, accesible y fácil de usar.

---

## Objetivo del sistema

Desarrollar una interfaz web pública para LicitaSeguro que permita:

1. Presentar un homepage corporativo.
2. Consultar y navegar licitaciones disponibles.
3. Filtrar licitaciones por fecha y estado.
4. Revisar el detalle de una licitación.
5. Buscar proveedores por RUT.
6. Validar formularios y mostrar mensajes de error claros.
7. Consumir endpoints externos.
8. Incorporar loader, paginación y manejo de errores.
9. Aplicar criterios de accesibilidad, usabilidad y diseño responsivo.

---

## Módulos incluidos

### 1. Homepage corporativo

Página inicial con presentación de LicitaSeguro, navegación principal y acceso directo a los módulos de licitaciones y proveedores.

### 2. Listado de licitaciones

Permite consultar licitaciones mediante filtros de fecha y estado. Los resultados se muestran en tarjetas responsivas con información resumida.

### 3. Detalle de licitación

Permite revisar información específica de una licitación seleccionada, utilizando el código obtenido desde el listado.

### 4. Búsqueda de proveedor

Formulario para consultar proveedores mediante RUT chileno, incorporando validación de formato y mensajes de error.

### 5. Accesibilidad y usabilidad

El sitio considera etiquetas `label`, atributos ARIA, textos alternativos, navegación por teclado, contraste visual y estructura semántica.

---

## Funcionalidades principales

* Consumo de API mediante `fetch`.
* Filtro por fecha.
* Filtro por estado.
* Validación de campos obligatorios.
* Validación de formato de RUT chileno.
* Loader durante el consumo de datos.
* Paginación cuando existen más de 10 registros.
* Manejo de respuestas vacías.
* Manejo de errores de conexión o servidor.
* Diseño responsivo para computador, tablet y celular.
* Interfaz desarrollada con componentes Bootstrap.
* Código organizado en archivos separados de HTML, CSS y JavaScript.

---

## Estructura del proyecto

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

---

## Descripción de archivos

* `index.html`: contiene la estructura principal del sitio, las secciones, formularios, navegación, contenedores de resultados y elementos accesibles.
* `assets/css/styles.css`: contiene estilos personalizados, diseño visual, ajustes responsivos y mejoras de presentación.
* `assets/js/app.js`: contiene la lógica del sistema, consumo de endpoints, validaciones, eventos, loader, paginación, renderizado de datos y manejo de errores.
* `docs/informe.md`: contiene la documentación del proyecto, criterios UI/UX, accesibilidad, decisiones técnicas y explicación de la solución.

---

## Cómo ejecutar el proyecto

### Opción 1: abrir directamente

1. Descomprimir el archivo ZIP.
2. Abrir la carpeta del proyecto.
3. Hacer doble clic en el archivo `index.html`.

### Opción 2: ejecutar con servidor local

Esta opción es recomendada para probar correctamente el consumo de API.

1. Abrir una terminal dentro de la carpeta del proyecto.
2. Ejecutar el siguiente comando:

```bash
python3 -m http.server 8080
```

3. Abrir en el navegador:

```text
http://localhost:8080
```

En algunos sistemas el comando puede ser:

```bash
python -m http.server 8080
```

---

## Endpoints utilizados

### Listado de licitaciones

```text
https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?fecha=ddmmaaaa&estado=estado&ticket=ticket
```

### Detalle de licitación

```text
https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=codigoLicitacion&ticket=ticket
```

### Búsqueda de proveedor

```text
https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=rut&ticket=ticket
```

---

## Validaciones implementadas

### Formulario de licitaciones

* La fecha es obligatoria.
* El estado de la licitación es obligatorio.
* Se muestran mensajes de error si faltan datos.
* Se evita realizar la búsqueda si el formulario no es válido.

### Formulario de proveedor

* El RUT es obligatorio.
* Se valida el formato del RUT chileno.
* Se muestran mensajes de error específicos.
* Se controla la respuesta vacía o error del servidor.

---

## Accesibilidad aplicada

El proyecto incorpora buenas prácticas de accesibilidad, tales como:

* Uso de etiquetas `label` asociadas a los campos de formulario.
* Uso de atributos `aria-label`, `aria-live` y `role` cuando corresponde.
* Mensajes de error visibles y comprensibles.
* Contraste adecuado entre texto y fondo.
* Botones accesibles mediante teclado.
* Estructura semántica con `header`, `main`, `section` y `footer`.
* Elementos interactivos con foco visible.
* Textos claros para favorecer la usabilidad.

---

## Diseño responsivo

La interfaz se adapta a distintos tamaños de pantalla mediante Bootstrap y reglas CSS personalizadas. El sitio puede visualizarse correctamente en:

* Computadores de escritorio.
* Tablets.
* Teléfonos móviles.

Los elementos se reorganizan automáticamente para mantener una navegación clara y evitar desbordes horizontales.

---

## Manejo de errores

El sistema considera distintos escenarios:

* API sin respuesta.
* Error de conexión.
* Respuesta vacía.
* Campos nulos o incompletos.
* RUT inválido.
* Filtros incompletos.

En cada caso se muestra un mensaje claro al usuario para mantener una experiencia comprensible.

---

## Observaciones técnicas

El ticket de la API fue incorporado según el instructivo entregado para la evaluación. Si el ticket cambia, vence o la API bloquea la solicitud, se debe actualizar la constante correspondiente en el archivo:

```text
assets/js/app.js
```

También es posible que algunas peticiones dependan de la disponibilidad del servidor externo de Mercado Público.

---

## Conclusión

El proyecto LicitaSeguro cumple con los requerimientos de la evaluación, integrando diseño responsivo, consumo de endpoints, validaciones, interactividad con JavaScript, accesibilidad, manejo de errores y documentación técnica en formato Markdown.
