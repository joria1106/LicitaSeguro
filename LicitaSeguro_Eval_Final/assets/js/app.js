/*
  LicitaSeguro - JavaScript modular.
  Cumple: consumo de endpoints, validaciones, loader, paginación, detalle y manejo de errores.
*/
const CONFIG = {
  ticket: "AC3A098B-4CD0-41AF-81A5-41284248419B",
  endpointListado: "https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json",
  endpointProveedor: "https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor",
  pageSize: 10
};

const state = {
  licitaciones: [],
  paginaActual: 1
};

const $ = (selector) => document.querySelector(selector);

const dom = {
  formLicitaciones: $("#formLicitaciones"),
  fecha: $("#fechaLicitacion"),
  estado: $("#estadoLicitacion"),
  fechaError: $("#fechaError"),
  estadoError: $("#estadoError"),
  loaderLicitaciones: $("#loaderLicitaciones"),
  alertaLicitaciones: $("#alertaLicitaciones"),
  grid: $("#gridLicitaciones"),
  contador: $("#contadorResultados"),
  paginacion: $("#paginacionLicitaciones"),
  btnAnterior: $("#btnAnterior"),
  btnSiguiente: $("#btnSiguiente"),
  btnLimpiarLicitaciones: $("#btnLimpiarLicitaciones"),
  formProveedor: $("#formProveedor"),
  rut: $("#rutProveedor"),
  rutError: $("#rutError"),
  btnEjemploRut: $("#btnEjemploRut"),
  loaderProveedor: $("#loaderProveedor"),
  alertaProveedor: $("#alertaProveedor"),
  resultadoProveedor: $("#resultadoProveedor"),
  modalDetalle: $("#modalDetalle"),
  modalContenido: $("#modalDetalleContenido")
};

function limpiarTexto(valor, fallback = "--") {
  if (valor === null || valor === undefined || String(valor).trim() === "") return fallback;
  const temporal = document.createElement("textarea");
  temporal.innerHTML = String(valor).trim();
  return temporal.value;
}

function escaparHTML(valor) {
  return limpiarTexto(valor).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  }[char]));
}

function formatearFechaAPI(fechaISO) {
  const [yyyy, mm, dd] = fechaISO.split("-");
  return `${dd}${mm}${yyyy}`;
}

function formatearCLP(monto) {
  const numero = Number(monto);
  if (!Number.isFinite(numero) || numero <= 0) return "--";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(numero);
}

function setLoader(loader, activo) {
  loader.classList.toggle("d-none", !activo);
}

function mostrarAlerta(elemento, tipo, mensaje) {
  elemento.className = `alert alert-${tipo}`;
  elemento.textContent = mensaje;
  elemento.classList.remove("d-none");
}

function ocultarAlerta(elemento) {
  elemento.classList.add("d-none");
  elemento.textContent = "";
}

function setCampoInvalido(campo, contenedorError, mensaje) {
  campo.classList.add("is-invalid");
  campo.setAttribute("aria-invalid", "true");
  contenedorError.textContent = mensaje;
}

function setCampoValido(campo, contenedorError) {
  campo.classList.remove("is-invalid");
  campo.removeAttribute("aria-invalid");
  contenedorError.textContent = "";
}

function validarFiltrosLicitaciones() {
  let esValido = true;
  const fechaValor = dom.fecha.value;
  const estadoValor = dom.estado.value;

  if (!fechaValor) {
    setCampoInvalido(dom.fecha, dom.fechaError, "Debe seleccionar una fecha de consulta.");
    esValido = false;
  } else {
    setCampoValido(dom.fecha, dom.fechaError);
  }

  if (!estadoValor) {
    setCampoInvalido(dom.estado, dom.estadoError, "Debe seleccionar un estado de licitación.");
    esValido = false;
  } else {
    setCampoValido(dom.estado, dom.estadoError);
  }

  return esValido;
}

async function fetchJSON(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    if (respuesta.status === 403) throw new Error("Sin permisos para consultar el servicio.");
    if (respuesta.status >= 500) throw new Error("Servidor no disponible. Intente más tarde.");
    throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`);
  }
  try {
    return await respuesta.json();
  } catch (error) {
    throw new Error("La respuesta del servidor no tiene un formato JSON válido.");
  }
}

async function obtenerLicitaciones(event) {
  event?.preventDefault();
  ocultarAlerta(dom.alertaLicitaciones);
  dom.grid.innerHTML = "";
  dom.contador.textContent = "Sin resultados cargados.";

  if (!validarFiltrosLicitaciones()) return;

  const fecha = formatearFechaAPI(dom.fecha.value);
  const estado = dom.estado.value;
  const url = `${CONFIG.endpointListado}?fecha=${fecha}&estado=${encodeURIComponent(estado)}&ticket=${CONFIG.ticket}`;

  setLoader(dom.loaderLicitaciones, true);
  bloquearFormularioLicitaciones(true);

  try {
    const datos = await fetchJSON(url);
    const listado = Array.isArray(datos?.Listado) ? datos.Listado : [];

    if (listado.length === 0) {
      state.licitaciones = [];
      state.paginaActual = 1;
      renderizarLicitaciones();
      mostrarAlerta(dom.alertaLicitaciones, "warning", "No se encontraron licitaciones para la fecha y estado seleccionados.");
      return;
    }

    state.licitaciones = listado;
    state.paginaActual = 1;
    renderizarLicitaciones();
  } catch (error) {
    state.licitaciones = [];
    renderizarLicitaciones();
    mostrarAlerta(dom.alertaLicitaciones, "danger", error.message || "Error al cargar licitaciones. Intente nuevamente.");
  } finally {
    setLoader(dom.loaderLicitaciones, false);
    bloquearFormularioLicitaciones(false);
  }
}

function bloquearFormularioLicitaciones(bloquear) {
  [dom.fecha, dom.estado, $("#btnBuscarLicitaciones"), dom.btnLimpiarLicitaciones].forEach(el => el.disabled = bloquear);
}

function renderizarLicitaciones() {
  const total = state.licitaciones.length;
  const totalPaginas = Math.max(1, Math.ceil(total / CONFIG.pageSize));
  const inicio = (state.paginaActual - 1) * CONFIG.pageSize;
  const pagina = state.licitaciones.slice(inicio, inicio + CONFIG.pageSize);

  dom.contador.textContent = total > 0
    ? `Mostrando ${pagina.length} de ${total} licitaciones. Página ${state.paginaActual} de ${totalPaginas}.`
    : "No hay licitaciones para mostrar.";

  dom.paginacion.classList.toggle("d-none", total <= CONFIG.pageSize);
  dom.btnAnterior.disabled = state.paginaActual === 1;
  dom.btnSiguiente.disabled = state.paginaActual === totalPaginas;

  dom.grid.innerHTML = pagina.map(item => crearCardLicitacion(item)).join("");
}

function crearCardLicitacion(item) {
  const codigo = escaparHTML(item.CodigoExterno);
  const nombre = escaparHTML(item.Nombre || "Licitación sin nombre");
  const estado = escaparHTML(item.Estado || dom.estado.value || "--");
  const fechaCierre = escaparHTML(item.FechaCierre || "--");

  return `
    <div class="col">
      <article class="card licitacion-card" tabindex="0" aria-label="Licitación ${codigo}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between gap-2 align-items-start mb-3">
            <span class="badge text-bg-primary">${estado}</span>
            <span class="card-code">${codigo}</span>
          </div>
          <h3 class="h6 card-title-limit">${nombre}</h3>
          <div class="meta-line mt-auto">
            <span>Fecha cierre</span>
            <strong>${fechaCierre}</strong>
          </div>
          <div class="d-flex gap-2 flex-wrap mt-3">
            <button class="btn btn-sm btn-primary" type="button" onclick="obtenerDetalleLicitacion('${codigo}')" aria-label="Ver detalle de licitación ${codigo}">Ver detalle</button>
            <a class="btn btn-sm btn-outline-secondary" href="https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?id=${codigo}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${codigo} en Mercado Público">Mercado Público</a>
          </div>
        </div>
      </article>
    </div>`;
}

async function obtenerDetalleLicitacion(codigo) {
  const modal = new bootstrap.Modal(dom.modalDetalle);
  dom.modalContenido.innerHTML = `<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando detalle</span></div><p class="mt-2">Cargando detalle de ${escaparHTML(codigo)}...</p></div>`;
  modal.show();

  const url = `${CONFIG.endpointListado}?codigo=${encodeURIComponent(codigo)}&ticket=${CONFIG.ticket}`;

  try {
    const datos = await fetchJSON(url);
    const detalle = Array.isArray(datos?.Listado) ? datos.Listado[0] : null;

    if (!detalle) {
      dom.modalContenido.innerHTML = `<div class="alert alert-warning" role="alert">No se encontró detalle para la licitación seleccionada.</div>`;
      return;
    }

    renderizarDetalle(detalle, codigo);
  } catch (error) {
    dom.modalContenido.innerHTML = `<div class="alert alert-danger" role="alert">${escaparHTML(error.message || "Error al cargar detalles de la licitación. Intente más tarde.")}</div>`;
  }
}
window.obtenerDetalleLicitacion = obtenerDetalleLicitacion;

function renderizarDetalle(detalle, codigo) {
  const comprador = detalle.Comprador || {};
  const fechas = detalle.Fechas || {};
  const items = Array.isArray(detalle.Items?.Listado) ? detalle.Items.Listado : [];

  dom.modalContenido.innerHTML = `
    <div class="mb-3">
      <span class="badge text-bg-primary mb-2">${escaparHTML(detalle.Estado || "--")}</span>
      <h3 class="h5">${escaparHTML(detalle.Nombre || "Licitación sin nombre")}</h3>
      <p class="text-muted mb-0">Código externo: <strong>${escaparHTML(detalle.CodigoExterno || codigo)}</strong></p>
    </div>
    <dl class="row">
      <dt class="col-sm-4">Descripción</dt><dd class="col-sm-8">${escaparHTML(detalle.Descripcion)}</dd>
      <dt class="col-sm-4">Organismo comprador</dt><dd class="col-sm-8">${escaparHTML(comprador.NombreOrganismo)}</dd>
      <dt class="col-sm-4">Unidad</dt><dd class="col-sm-8">${escaparHTML(comprador.NombreUnidad)}</dd>
      <dt class="col-sm-4">Monto estimado</dt><dd class="col-sm-8">${formatearCLP(detalle.MontoEstimado)}</dd>
      <dt class="col-sm-4">Fecha publicación</dt><dd class="col-sm-8">${escaparHTML(fechas.FechaPublicacion)}</dd>
      <dt class="col-sm-4">Fecha cierre</dt><dd class="col-sm-8">${escaparHTML(fechas.FechaCierre)}</dd>
    </dl>
    <h4 class="h6 mt-4">Ítems asociados</h4>
    ${items.length ? `
      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Unidad</th></tr></thead>
          <tbody>${items.slice(0, 8).map(item => `<tr><td>${escaparHTML(item.NombreProducto || item.Descripcion)}</td><td>${escaparHTML(item.Cantidad)}</td><td>${escaparHTML(item.UnidadMedida)}</td></tr>`).join("")}</tbody>
        </table>
      </div>` : `<p class="text-muted">Sin ítems disponibles.</p>`}
  `;
}

function limpiarRut(rut) {
  return rut.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
}

function formatearRut(rutLimpio) {
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  return `${Number(cuerpo).toLocaleString("es-CL")}-${dv}`;
}

function validarRutChileno(rut) {
  const rutLimpio = limpiarRut(rut);
  if (!rutLimpio) return { valido: false, mensaje: "Debe ingresar un RUT." };
  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) return { valido: false, mensaje: "El RUT debe tener 7 u 8 dígitos y un dígito verificador válido." };

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  const dvEsperado = dvEsperadoNum === 11 ? "0" : dvEsperadoNum === 10 ? "K" : String(dvEsperadoNum);

  if (dv !== dvEsperado) return { valido: false, mensaje: `El dígito verificador no corresponde. Debiera ser ${dvEsperado}.` };
  return { valido: true, rutFormateado: formatearRut(rutLimpio) };
}

async function buscarProveedor(event) {
  event?.preventDefault();
  ocultarAlerta(dom.alertaProveedor);
  dom.resultadoProveedor.innerHTML = `<h3 class="h5">Resultado</h3><p class="text-muted mb-0">Procesando búsqueda...</p>`;

  const validacion = validarRutChileno(dom.rut.value);
  if (!validacion.valido) {
    setCampoInvalido(dom.rut, dom.rutError, validacion.mensaje);
    return;
  }
  setCampoValido(dom.rut, dom.rutError);

  setLoader(dom.loaderProveedor, true);
  bloquearFormularioProveedor(true);

  const rut = validacion.rutFormateado;
  const url = `${CONFIG.endpointProveedor}?rutempresaproveedor=${encodeURIComponent(rut)}&ticket=${CONFIG.ticket}`;

  try {
    const datos = await fetchJSON(url);
    const proveedor = Array.isArray(datos?.listaEmpresas) ? datos.listaEmpresas[0] : null;

    if (!proveedor) {
      mostrarAlerta(dom.alertaProveedor, "warning", "Proveedor no encontrado para el RUT ingresado.");
      dom.resultadoProveedor.innerHTML = `<h3 class="h5">Sin resultados</h3><p class="mb-0">No existen datos disponibles para el RUT ${escaparHTML(rut)}.</p>`;
      return;
    }

    dom.resultadoProveedor.innerHTML = `
      <h3 class="h5">Proveedor encontrado</h3>
      <dl class="row mb-0">
        <dt class="col-sm-4">RUT</dt><dd class="col-sm-8">${escaparHTML(rut)}</dd>
        <dt class="col-sm-4">Razón social</dt><dd class="col-sm-8">${escaparHTML(proveedor.NombreEmpresa || proveedor.RazonSocial)}</dd>
        <dt class="col-sm-4">Código empresa</dt><dd class="col-sm-8">${escaparHTML(proveedor.CodigoEmpresa)}</dd>
      </dl>`;
  } catch (error) {
    mostrarAlerta(dom.alertaProveedor, "danger", error.message || "Error de red al consultar proveedor.");
    dom.resultadoProveedor.innerHTML = `<h3 class="h5">Error</h3><p class="mb-0">No fue posible obtener los datos del proveedor en este momento.</p>`;
  } finally {
    setLoader(dom.loaderProveedor, false);
    bloquearFormularioProveedor(false);
  }
}

function bloquearFormularioProveedor(bloquear) {
  [dom.rut, $("#btnBuscarProveedor"), dom.btnEjemploRut].forEach(el => el.disabled = bloquear);
}

function limpiarLicitaciones() {
  dom.formLicitaciones.reset();
  setCampoValido(dom.fecha, dom.fechaError);
  setCampoValido(dom.estado, dom.estadoError);
  ocultarAlerta(dom.alertaLicitaciones);
  state.licitaciones = [];
  state.paginaActual = 1;
  renderizarLicitaciones();
}

function setFechaPorDefecto() {
  // Fecha del instructivo. Puede cambiarse libremente desde el input.
  dom.fecha.value = "2025-05-30";
  dom.estado.value = "revocada";
}

document.addEventListener("DOMContentLoaded", () => {
  setFechaPorDefecto();
  dom.formLicitaciones.addEventListener("submit", obtenerLicitaciones);
  dom.btnLimpiarLicitaciones.addEventListener("click", limpiarLicitaciones);
  dom.btnAnterior.addEventListener("click", () => { state.paginaActual--; renderizarLicitaciones(); });
  dom.btnSiguiente.addEventListener("click", () => { state.paginaActual++; renderizarLicitaciones(); });
  dom.formProveedor.addEventListener("submit", buscarProveedor);
  dom.btnEjemploRut.addEventListener("click", () => { dom.rut.value = "77.653.382-3"; dom.rut.focus(); });
});
